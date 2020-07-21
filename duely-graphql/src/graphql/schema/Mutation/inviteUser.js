import { withConnection } from '../../../db';
import gmail from '../../../gmail';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function inviteUser(obj, { agencyUuid, emailAddress, role, message }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  if (!validator.isEmail(emailAddress))
    return {
      success: false,
      message: `Email address format '${emailAddress}' is invalid.`,
      type: 'InviteUserResult'
    };

  emailAddress = validator.normalizeEmail(emailAddress);

  return await withConnection(context, async withSession => {
    return await withSession(async client => {
      try {
        // query agency info
        const res_a = await client.query('SELECT name_, subdomain_uuid_ FROM operation_.query_agency_($1::uuid)', [agencyUuid]);
        if (res_a.rows.length !== 1)
          throw new Error('Agency not found!');

        const { name_: agencyName, subdomain_uuid_: subdomainUuid } = res_a.rows[0];

        // query subdomain info
        const res_s = await client.query('SELECT name_ FROM operation_.query_subdomain_($1::uuid)', [subdomainUuid]);
        if (res_s.rows.length !== 1)
          throw new Error('Subdomain not found!');

        const subdomain = res_s.rows[0].name_;

        // query user info
        const res_u = await client.query('SELECT name_ FROM operation_.query_user_by_email_address_($1::text)', [emailAddress]);
        const nameOfExistingUser = res_u.rows.length === 1
          ? res_u.rows[0].name_
          : null;

        // create user invite on database 
        const res = await client.query('SELECT uuid_ FROM operation_.invite_user_($1::uuid, $2::text, $3::text)', [agencyUuid, emailAddress, role]);
        const inviteUuid = res.rows[0].uuid_;

        if (nameOfExistingUser === null) {
          // user does not exist yet, let's start the sign up process
          const redirectUrl = new URL(`https://${subdomain}.duely.app/sign-up?invite=${encodeURIComponent(inviteUuid)}&email_address=${encodeURIComponent(emailAddress)}`)
          const json = JSON.stringify({ redirectUrl: redirectUrl.href });

          // get verification code for new user
          const res = await client.query('SELECT verification_code_ FROM operation_.start_email_address_verification_($1::text, $2::boolean, $3::json)', [emailAddress, false, json]);
          const verificationCode = res.rows[0].verification_code_;
          redirectUrl.searchParams.set('verification_code', verificationCode);

          try {
            const messages = await gmail.sendEmailAsAdminDuely({
              to: emailAddress,
              subject: `Invitation from ${agencyName} - Sign up for ${subdomain}.duely.app`,
              body: (redirectUrl
                ? [
                  p`Hi! 👋`,
                  p`You have been invited to join Duely by ${strong`${validator.escape(agencyName)}`}.`,
                  p`Click the link below to verify your email address for Duely.${br``}* this link ${strong`expires in 24 hours`}. After that you will need to request another link.${br``}* this link ${strong`can only be used once`}. After you click the link it will no longer work.`,
                  p`${strong`==&gt; ${a`${redirectUrl.href}Click here to verify your email and access Duely`}`}`,
                  p`${em`This link expires in 24 hours and can only be used once. You can always request another link to be sent if this one has been used or is expired.`}`
                ]
                : [
                  p`Hi! 👋`,
                  p`You have been invited to join Duely by ${strong`${validator.escape(agencyName)}`}.`,
                  p`Your invite verification code is ${strong`${verificationCode}`}.`,
                  p`${em`This code expires in 24 hours and can only be used once. You can always request another verification code to be sent if this one has been used or is expired.`}`
                ]
              ).filter(l => l !== null).join('\r\n')
            });
          
            if (!messages.id) {
              // email not sent because of some error
              try {
                await client.query('SELECT uuid_ FROM operation_.cancel_user_invite_($1::uuid)', [inviteUuid]);
              } catch (error) {
                console.log(error.message);
              }

              return {
                success: false,
                message: 'Something went wrong while trying to send invite email. Invite cancelled.',
                type: 'InviteUserResult'
              };
            }
          } catch (error) {
            // email not sent because of some error
            console.log(error.message);

            try {
              await client.query('SELECT uuid_ FROM operation_.cancel_user_invite_($1::uuid)', [inviteUuid]);
            } catch (error) {
              console.log(error.message);
            }

            return {
              success: false,
              message: 'Something went wrong while trying to send invite email. Invite cancelled.',
              type: 'InviteUserResult'
            };
          }

        } else {
          // user already exists
          const redirectUrl = new URL(`https://${subdomain}.duely.app?invite=${encodeURIComponent(inviteUuid)}&login=${encodeURIComponent(emailAddress)}`)

          try {
            const messages = await gmail.sendEmailAsAdminDuely({
              to: emailAddress,
              subject: `Invitation from ${agencyName} - ${subdomain}.duely.app`,
              body: [
                '<html>',
                  '<style type="text/css">',
                    'body, p, div {',
                    '  font-family: Helvetica, Arial, sans-serif;',
                    '  font-size: 14px;',
                    '}',
                    'a {',
                    '  text-decoration: none;',
                    '}',
                  '</style>',
                  '<body>',
                    `<p>Hello, ${nameOfExistingUser},</p>`,
                    '<p>',
                      `You have been invited to join ${agencyName} at ${subdomain}.duely.app.`,
                      `To get started, click this link: <a href="${redirectUrl.href}"><strong>Get started with ${subdomain}.duely.app</strong></a>`,
                    '</p>',
                  '</body>',
                '</html>'
              ].join('\r\n')
            });
          
            if (!messages.id) {
              // email not sent because of some error
              try {
                await client.query('SELECT uuid_ FROM operation_.cancel_user_invite_($1::uuid)', [inviteUuid]);
              } catch (error) {
                console.log(error.message);
              }

              return {
                success: false,
                message: 'Something went wrong while trying to send invite email. Invite cancelled.',
                type: 'InviteUserResult'
              };
            }
          } catch (error) {
            // email not sent because of some error
            console.log(error.message);

            try {
              await client.query('SELECT uuid_ FROM operation_.cancel_user_invite_($1::uuid)', [inviteUuid]);
            } catch (error) {
              console.log(error.message);
            }

            return {
              success: false,
              message: 'Something went wrong while trying to send invite email. Invite cancelled.',
              type: 'InviteUserResult'
            };
          }
        }

        // success
        return {
          success: true,
          inviteUuid,
          type: 'InviteUserResult'
        };

      } catch (error) {
        return {
          // error
          success: false,
          message: error.message,
          type: 'InviteUserResult'
        };
      }
    });
  });
};

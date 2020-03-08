import { pool } from '../../../db';
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

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

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

    // create user invite on database 
    const res = await client.query('SELECT uuid_ FROM operation_.invite_user_($1::uuid, $2::text, $3::text)', [agencyUuid, emailAddress, role]);
    const inviteUuid = res.rows[0].uuid_;

    // get verification code for new user
    try {
      const res = await client.query('SELECT verification_code_ FROM operation_.start_email_address_verification_($1::text)', [emailAddress]);
      verificationCode = res.rows[0].verification_code_;

      try {
        const messages = await gmail.sendEmailAsAdminDuely({
          to: emailAddress,
          subject: `Invitation from ${agencyName} - Sign up for ${subdomain}.duely.app`,
          body: [
            `To get started, click this link to sign up: https://${subdomain}.duely.app/create-account?email=${emailAddress}&code=${verificationCode}`
          ].join('\r\n')
        });
      
        if (!messages.id) {
          // email not sent because of some error
        }
      } catch (error) {
        // email not sent because of some error
      }

    } catch (error) {
      if (error.code === '43505') {
        // user already exists
        try {
          const messages = await gmail.sendEmailAsAdminDuely({
            to: emailAddress,
            subject: `Invitation from ${agencyName} - ${subdomain}.duely.app`,
            body: [
              `To get started, click this link: https://${subdomain}.duely.app?login=${emailAddress}`,
            ].join('\r\n')
          });
        
          if (!messages.id) {
            // email not sent because of some error
          }
        } catch (error) {
          // email not sent because of some error
        }
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
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};

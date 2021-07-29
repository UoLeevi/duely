import jwt from 'jsonwebtoken';
import { readFile } from 'fs';
import base64url from 'base64url';
import axios from 'axios';

let accountInfo: {
  client_email: string;
  private_key: string;
};

async function updateAccountInfo() {
  await new Promise((resolve, reject) => {
    if (!process.env.GSERVICEACCOUNTFILE) {
      throw new Error('Invalid configuration.');
    }

    readFile(process.env.GSERVICEACCOUNTFILE, 'utf8', function (error, data) {
      if (error) {
        reject(error);
      } else {
        accountInfo = JSON.parse(data);
        resolve(accountInfo);
      }
    });
  });
}

// see: https://developers.google.com/identity/protocols/oauth2/service-account#httprest_1
// Additionally, scopes need to be enabled here: https://admin.google.com/ac/owl/domainwidedelegation
async function issueJwtForAdminDuely(...scopes: string[]) {
  if (!accountInfo) await updateAccountInfo();

  const iat = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iss: accountInfo.client_email,
      sub: 'admin@duely.app',
      scope: scopes.join(' '),
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      exp: iat + 3600,
      iat
    },
    accountInfo.private_key,
    {
      algorithm: 'RS256'
    }
  );
}

async function requestAccessTokenForAdminDuely(...scopes: string[]) {
  const jwt = await issueJwtForAdminDuely(...scopes);
  const data = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const res = await axios.post('https://www.googleapis.com/oauth2/v4/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return res.data.access_token;
}

async function requestAccessTokenForAdminDuelyGmailSend() {
  return await requestAccessTokenForAdminDuely('https://www.googleapis.com/auth/gmail.send');
}

const sendAsAliases = [
  'admin@duely.app',
  'noreply@duely.app',
  'receipts@duely.app',
  'support@duely.app'
];

export async function sendEmail(
  from: string,
  to: string,
  subject: string,
  body: string
): Promise<{ id: string }> {
  if (!sendAsAliases.map((alias) => `<${alias}>`).some((alias) => from.endsWith(alias))) {
    throw Error(`Specified 'From' address is not allowed`);
  }

  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset="UTF-8"',
    `From: ${from}`,
    'MIME-Version: 1.0',
    'Content-Transfer-Encoding: 7bit',
    '',
    body,
    ''
  ].join('\r\n');

  const access_token = await requestAccessTokenForAdminDuelyGmailSend();
  const data = { raw: base64url.encode(message) };
  const res = await axios.post(
    'https://www.googleapis.com/gmail/v1/users/admin%40duely.app/messages/send',
    data,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );

  return res.data;
}

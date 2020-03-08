import jwt from 'jsonwebtoken';
import { readFile } from 'fs';
import https from 'https';
import base64url from 'base64url';

let accountInfo;

async function updateAccountInfo() {
  await new Promise((resolve, reject) => {
    readFile(process.env.GSERVICEACCOUNTFILE, 'utf8', function (error, data) {
      if (error) {
        reject(error);
      } else {
        accountInfo = JSON.parse(data);
        resolve();
      }
    });
  });
}

async function issueJwtForAdminDuelyGmailSend() {
  if (!accountInfo)
    await updateAccountInfo();

  const iat = Math.floor(Date.now() / 1000);

  return jwt.sign({
    iss: accountInfo.client_email,
    sub: 'admin@duely.app',
    scope: 'https://www.googleapis.com/auth/gmail.send',
    aud: 'https://www.googleapis.com/oauth2/v4/token',
    exp: iat + 3600,
    iat
  },
  accountInfo.private_key,
  {
    algorithm: 'RS256'
  });
}

function requestAccessTokenForAdminDuelyGmailSend() {
  return new Promise(async (resolve, reject) => {
    const jwt = await issueJwtForAdminDuelyGmailSend();
    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;

    const options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/oauth2/v4/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length
      }
    };
    
    const req = https.request(options, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => body += data );
      res.on('end', () => {
        const { access_token } = JSON.parse(body);
        resolve(access_token);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export default {
  sendEmailAsAdminDuely ({ to, subject, body } = {}) {
    return new Promise(async (resolve, reject) => {
      const message = [
        `To: <${to}>`,
        `Subject: ${subject}`,
        'Content-Type: text/html; charset="UTF-8"',
        'From: duely.app <admin@duely.app>',
        'MIME-Version: 1.0',
        'Content-Transfer-Encoding: 7bit',
        '',
        body,
        ''
      ].join('\r\n');

      {
        const body = JSON.stringify({ raw: base64url.encode(message)});
        const access_token = await requestAccessTokenForAdminDuelyGmailSend();

        const options = {
          hostname: 'www.googleapis.com',
          port: 443,
          path: '/gmail/v1/users/admin%40duely.app/messages/send',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': body.length
          }
        };
        
        const req = https.request(options, res => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', data => body += data );
          res.on('end', () => resolve(JSON.parse(body)));
        });
        
        req.on('error', reject);
        req.write(body);
        req.end();
      }
    });
  }
};

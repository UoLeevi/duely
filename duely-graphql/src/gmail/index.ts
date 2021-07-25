import { readFile } from 'fs';
import axios from 'axios';

const templatesPath = 'dist/gmail/templates';

let accountInfo: {
  client_email: string;
  private_key: string;
};
const templates: Record<string, string> = {};

async function loadTemplate(template: string = 'default') {
  await new Promise((resolve, reject) => {
    readFile(`${templatesPath}/${template}.html`, 'utf8', function (error, data) {
      if (error) {
        reject(error);
      } else {
        templates[template] = data;
        resolve(data);
      }
    });
  });
}

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

async function issueJwtForAdminDuelyGmailSend() {
  if (!accountInfo) await updateAccountInfo();

  const iat = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
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
    }
  );
}

async function requestAccessTokenForAdminDuelyGmailSend() {
  const jwt = await issueJwtForAdminDuelyGmailSend();
  const data = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const res = await axios.post('https://www.googleapis.com/oauth2/v4/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return res.data.access_token;
}

export default {
  async sendEmailAsAdminDuely({
    to,
    subject,
    body
  }: { to?: string; subject?: string; body?: string } = {}): Promise<{ id: string }> {
    if (!templates.default) {
      await loadTemplate('default');
    }

    body = templates.default.replace('<!-- {BODY} -->', body ?? '');

    const message = [
      `To: <${to}>`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset="UTF-8"',
      'From: Duely <admin@duely.app>',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      '',
      body,
      ''
    ].join('\r\n');

    const access_token = await requestAccessTokenForAdminDuelyGmailSend();
    const data = { raw: base64url.encode(message) };
    const res = await axios.post('/gmail/v1/users/admin%40duely.app/messages/send', data, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    return res.data;
  }
};

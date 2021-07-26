// usage with kubectl:
// kubectl run -it --rm --restart=Never curl --image=curlimages/curl -- -X POST --data-urlencode "body=test" http://duely-email-service:8080/preview/:template

import express, { Request, Response } from 'express';
import { readFile } from 'fs';
import path from 'path';
import cors from 'cors';
import isEmail from 'validator/es/lib/isEmail';
import Handlebars from 'handlebars';
import { sendEmailAsAdminDuely } from './gmail';

const templatesDirpath = path.resolve(__dirname, 'templates');
const templates = new Map<string, Promise<HandlebarsTemplateDelegate>>();

async function getTemplate(templatePath: string = 'default') {
  let promise = templates.get(templatePath);

  if (!promise) {
    promise = new Promise((resolve, reject) => {
      readFile(
        path.resolve(templatesDirpath, `${templatePath}.html`),
        'utf8',
        function (error, data: string) {
          if (error) {
            reject(error);
          } else {
            const template = Handlebars.compile(data);
            resolve(template);
          }
        }
      );
    });

    templates.set(templatePath, promise);
  }

  return await promise;
}

main();

async function main() {
  const app = express();
  app.set('port', process.env.PORT ?? 3000);
  app.set('trust proxy', true);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.post('/send/:template', handle_send);
  app.post('/preview/:template', handle_preview);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: app.get('port') }, () => {
    console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
  });
}

async function handle_send(req: Request, res: Response) {
  let { template: templatePath } = req.params;
  templatePath = path.resolve(templatesDirpath, `${decodeURIComponent(templatePath)}`);

  if (!templatePath.startsWith(templatesDirpath + path.sep)) {
    res.status(400).send('Invalid template path');
    return;
  }

  templatePath = templatePath.substring(templatesDirpath.length + path.sep.length);

  let template: HandlebarsTemplateDelegate;

  try {
    template = await getTemplate(templatePath);
  } catch {
    res.status(400).send('Invalid template path');
    return;
  }

  let { to, subject, ...context } = req.body;

  if (typeof to !== 'string') {
    res.status(400).send(`Invalid data type for field 'to'`);
    return;
  }

  if (typeof subject !== 'string') {
    res.status(400).send(`Invalid data type for field 'subject'`);
    return;
  }

  if (!to.includes('<')) {
    to = `<${to}>`;
  }

  if (!isEmail(to, { require_display_name: true })) {
    to = to.substring(to.lastIndexOf('<'));
    if (!isEmail('Dummy Display Name ' + to, { require_display_name: true })) {
      res.status(400).send('Invalid email address');
      return;
    }
  }

  let document: string;

  try {
    document = template(context);
  } catch {
    res.status(400).send('Unable to compile HTML document from template');
    return;
  }

  try {
    const { id } = await sendEmailAsAdminDuely(to, subject, document);
    res.send({ success: true, id });
    console.log(`Email sent to '${to}' with template '${templatePath}'. Id: ${id}'`);
  } catch (error: any) {
    console.error('Error: ', error.message);
    res.status(500).send('Unable to send email due to an error');
  }
}

async function handle_preview(req: Request, res: Response) {
  let { template: templatePath } = req.params;
  templatePath = path.resolve(templatesDirpath, `${decodeURIComponent(templatePath)}`);

  if (!templatePath.startsWith(templatesDirpath + path.sep)) {
    res.status(400).send('Invalid template path');
    return;
  }

  templatePath = templatePath.substring(templatesDirpath.length + path.sep.length);

  let template: HandlebarsTemplateDelegate;

  try {
    template = await getTemplate(templatePath);
  } catch {
    res.status(400).send('Invalid template path');
    return;
  }

  let context = req.body;
  let document: string;

  try {
    document = template(context);
  } catch {
    res.status(400).send('Unable to compile HTML document from template');
    return;
  }

  res.set('Content-Type', 'text/html');
  res.send(document);
}

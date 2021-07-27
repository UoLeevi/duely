// usage with kubectl:
// kubectl run -it --rm --restart=Never curl --image=curlimages/curl -- -X POST --data-urlencode "body=test" http://duely-email-service:8080/preview/:template

import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import isEmail from 'validator/es/lib/isEmail';
import hbs from 'hbs';
import fs from 'fs';
import { sendEmail } from './gmail';

const templateInfos = new Map<
  string,
  {
    exists: boolean;
  }
>();

const app = express();

hbs.registerPartials(path.join(__dirname, '/templates/partials'), (error?: Error) => {
  if (error) {
    console.error('Error while registering partials', error.message);
  }
});

app.set('port', process.env.PORT ?? 3000);
app.set('trust proxy', true);
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.__express);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/send/:template', handle_send);
app.post('/preview/:template', handle_preview);
app.get('/preview/:template', handle_preview);
app.get('/.well-known/server-health', (req, res) => res.send('ok'));

app.listen({ port: app.get('port') }, () => {
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
});

async function getTemplateInfo(template: string) {
  let info = templateInfos.get(template);

  if (!info) {
    const templateDirPath = path.resolve(app.get('views'));
    const templatePath = path.resolve(`${templateDirPath}/${template}.hbs`);

    if (!templatePath.startsWith(templateDirPath)) {
      info = { exists: false };
      templateInfos.set(template, info);
    } else {
      try {
        await fs.promises.access(templatePath, fs.constants.F_OK);
        info = { exists: true };
        templateInfos.set(template, info);
      } catch {
        info = { exists: false };
        templateInfos.set(template, info);
      }
    }
  }

  return info;
}

async function handle_send(req: Request, res: Response) {
  let { template } = req.params;
  const info = await getTemplateInfo(template);

  if (!info.exists) {
    res.status(404);
    return;
  }

  let { from, to, subject, ...context } = { ...req.body, ...req.query } as Record<string, any>;

  from ??= 'Duely <admin@duely.app>';

  if (typeof from !== 'string') {
    res.status(400).send(`Invalid data type for field 'from'`);
    return;
  }

  if (typeof to !== 'string') {
    res.status(400).send(`Invalid data type for field 'to'`);
    return;
  }

  if (typeof subject !== 'string') {
    res.status(400).send(`Invalid data type for field 'subject'`);
    return;
  }

  if (!from.includes('<')) {
    from = `<${from}>`;
  }

  if (!isEmail(from, { require_display_name: true })) {
    from = from.substring(from.lastIndexOf('<'));
    if (!isEmail('Dummy Display Name ' + from, { require_display_name: true })) {
      res.status(400).send('Invalid email address');
      return;
    }
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

  subject = subject.replace(/[\r\n]/g, '');

  res.render(template, context, async (err: Error, html: string) => {
    try {
      const { id } = await sendEmail(from, to, subject, html);
      res.send({ success: true, id });
      console.log(
        `Email sent from '${from}' to '${to}' with subject '${subject}' using template '${template}'. Message id: ${id}'`
      );
    } catch (error: any) {
      console.error('Error: ', error.message);
      res.status(500).send('Unable to send email due to an error');
    }
  });
}

async function handle_preview(req: Request, res: Response) {
  let { template } = req.params;
  const info = await getTemplateInfo(template);

  if (!info.exists) {
    res.sendStatus(404);
    return;
  }

  const context = { ...req.body, ...req.query };
  res.render(template, context);
}

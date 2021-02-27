import express, { Request, Response } from 'express';
import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { serviceAccountContextPromise } from '@duely/db';

const scriptDirpath = path.resolve(__dirname, 'jobs');

let context: {
  jwt: string;
};

main();

async function main() {
  context = await serviceAccountContextPromise;
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.use('/run/', express.raw({ type: 'application/json' }));
  app.post('/run/:job/:arg1?/:arg2?/:arg3?/:arg4?/:arg5?/:arg6?/:arg7?/:arg8?', handle_run);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

async function handle_run(req: Request, res: Response) {
  const { job, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8 } = req.params;
  const scriptPath = path.resolve(scriptDirpath, `${decodeURIComponent(job)}/index.js`);

  if (!scriptPath.startsWith(scriptDirpath + path.sep)) {
    res.sendStatus(400);
    return;
  }

  try {
    await fs.promises.access(scriptPath, fs.constants.F_OK);
  } catch {
    res.sendStatus(400);
    return;
  }

  const args = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8]
    .filter((a) => a != null)
    .map(decodeURIComponent);

  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;
  const process = childProcess.fork(scriptPath, [context.jwt, ...args]);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    console.error(`Error from job '${job}':`);
    console.error(err);
    res.sendStatus(400);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    console.log(`Job '${job}' exited with code ${code}`);
    if (code === 0) {
      res.send('ok');
    } else {
      res.sendStatus(400);
    }
  });
}

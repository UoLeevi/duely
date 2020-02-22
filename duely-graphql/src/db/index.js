import { Pool } from 'pg';
import config from './config';

const RECONNECTION_TIMEOUT = 30000;
const RECONNECTION_RETRY_COUNT = 3;
let retryCounter = RECONNECTION_RETRY_COUNT;

const pool = new Pool(config);
pool.on('error', err => {
  console.error('error on idle postgres client', err.stack);
});

const sharedClientOnConnectCallbacks = [];
let sharedClientPromise = pool.connect();

function retrySharedClientConnect() {
  setTimeout(() => {
    sharedClientPromise = pool.connect().then(client => {
      retryCounter = RECONNECTION_RETRY_COUNT;
      sharedClientOnConnectCallbacks.forEach(async callback => await callback(client));
    }).catch(err => {
      if (retryCounter-- === 0) {
        console.error('error on connecting shared postgres client and retries failed.', err.stack);
        process.exit(1);
      }

      retrySharedClientConnect();
    });
  }, RECONNECTION_TIMEOUT);
}

sharedClientPromise.then(client => {
  client.on('error', err => {
    console.error('error on shared postgres client', err.stack);
    retrySharedClientConnect();
  });
});

async function addBackgroundJob(callback = async client => {}, execute = true) {
  function removeBackgroundJob() {
    const index = sharedClientOnConnectCallbacks.indexOf(callback);
    sharedClientOnConnectCallbacks.splice(index, 1);
  }

  const client = await sharedClientPromise;
  sharedClientOnConnectCallbacks.push(callback);

  if (execute)
    await callback(client);

  return removeBackgroundJob;
}

export {
  pool,
  addBackgroundJob
};

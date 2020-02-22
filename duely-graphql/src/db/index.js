import { Client, Pool } from 'pg';
import config from './config';

const RECONNECTION_TIMEOUT = 30000;
const RECONNECTION_RETRY_COUNT = 3;
let retryCounter = RECONNECTION_RETRY_COUNT;

const pool = new Pool(config);
pool.on('error', err => {
  console.error('error on idle postgres client.', err.stack);
});

let sharedClient = new Client(config);
let isSharedClientConnected = false;
const backgroundJobs = [];

function retrySharedClientConnect() {
  setTimeout(() => {
    sharedClient = new Client(config);
    sharedClient.connect(err => {
      if (err) {
        if (retryCounter-- === 0) {
          console.error('error on connecting shared postgres client and retries failed.', err.stack);
          process.exit(1);
        }

        retrySharedClientConnect();
        return;
      }

      isSharedClientConnected = true;

      sharedClient.on('error', err => {
        isSharedClientConnected = false;
        console.error('error on shared postgres client.', err.stack);
        retrySharedClientConnect();
      });

      retryCounter = RECONNECTION_RETRY_COUNT;
      backgroundJobs.forEach(async callback => await callback(sharedClient));
    });
  }, RECONNECTION_TIMEOUT);
}

sharedClient.connect(err => {
  if (err) {
    console.error('error on connecting shared postgres client.', err.stack);
    retrySharedClientConnect();
    return;
  }

  isSharedClientConnected = true;

  sharedClient.on('error', err => {
    isSharedClientConnected = false;
    console.error('error on shared postgres client.', err.stack);
    retrySharedClientConnect();
  });

  backgroundJobs.forEach(async callback => await callback(sharedClient));
});

async function addBackgroundJob(callback = async client => {}, execute = true) {
  function removeBackgroundJob() {
    const index = backgroundJobs.indexOf(callback);
    backgroundJobs.splice(index, 1);
  }

  backgroundJobs.push(callback);

  if (isSharedClientConnected && execute)
    await callback(sharedClient);

  return removeBackgroundJob;
}

export {
  pool,
  addBackgroundJob
};

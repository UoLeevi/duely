import { Client, Pool } from 'pg';
import config from './config';

const RECONNECTION_TIMEOUT = 30000;
const RECONNECTION_RETRY_COUNT = 3;
let retryCounter = RECONNECTION_RETRY_COUNT;

const pool = new Pool(config);
pool.on('error', error => {
  console.error('error on idle postgres client.', error.stack);
});

let sharedClient = new Client(config);
let isSharedClientConnected = false;
const backgroundJobs = [];

function retrySharedClientConnect() {
  setTimeout(() => {
    sharedClient = new Client(config);
    sharedClient.connect(error => {
      if (error) {
        if (retryCounter-- === 0) {
          console.error('error on connecting shared postgres client and retries failed.', error.stack);
          process.exit(1);
        }

        retrySharedClientConnect();
        return;
      }

      isSharedClientConnected = true;

      sharedClient.on('error', error => {
        isSharedClientConnected = false;
        console.error('error on shared postgres client.', error.stack);
        retrySharedClientConnect();
      });

      retryCounter = RECONNECTION_RETRY_COUNT;
      backgroundJobs.forEach(async callback => await callback(sharedClient));
    });
  }, RECONNECTION_TIMEOUT);
}

sharedClient.connect(error => {
  if (error) {
    console.error('error on connecting shared postgres client.', error.stack);
    retrySharedClientConnect();
    return;
  }

  isSharedClientConnected = true;

  sharedClient.on('error', error => {
    isSharedClientConnected = false;
    console.error('error on shared postgres client.', error.stack);
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

async function withConnection(context, callback = async withSession => {}) {
  const client = await pool.connect();

  try {
    async function withSession(callback = async client => {}) {
      await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

      try {
        return await callback(client);
      } finally {
        await client.query('SELECT operation_.end_session_()');
      }
    }

    return await callback(withSession);

  }
  finally {
    client.release();
  }
}

async function queryResource(client, id_or_resource_name, filter) {
  if (filter) {
    const resources = await queryResourceAll(client, id_or_resource_name, filter);
    return resources[0];
  }

  const id = id_or_resource_name;
  const res = await client.query('SELECT * FROM operation_.query_resource_($1::text)', [id]);
  return res.rows[0].query_resource_;
}

async function queryResourceAll(client, resource_name, filter) {
  const res = await client.query('SELECT * FROM operation_.query_resource_all_($1::text, $2::jsonb)', [resource_name, filter]);
  return res.rows.map(r => r.query_resource_all_);
}

async function createResource(client, resource_name, data) {
  const res = await client.query('SELECT * FROM operation_.create_resource_($1::text, $2::jsonb)', [resource_name, data]);
  return res.rows[0].create_resource_;
}

async function updateResource(client, id, data) {
  const res = await client.query('SELECT * FROM operation_.update_resource_($1::text, $2::jsonb)', [id, data]);
  return res.rows[0].update_resource_;
}

async function deleteResource(client, id) {
  const res = await client.query('SELECT * FROM operation_.delete_resource_($1::text)', [id]);
  return res.rows[0].delete_resource_;
}

export {
  pool,
  addBackgroundJob,
  withConnection,
  queryResource,
  queryResourceAll,
  createResource,
  updateResource,
  deleteResource
};

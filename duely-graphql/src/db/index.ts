import { Client, Pool, PoolClient, QueryConfig } from 'pg';
import config from './config';

const RECONNECTION_TIMEOUT = 30000;
const RECONNECTION_RETRY_COUNT = 3;
let retryCounter = RECONNECTION_RETRY_COUNT;

export const pool = new Pool(config);
pool.on('error', (error) => {
  console.error('error on idle postgres client.', error.stack);
});

let sharedClient = new Client(config);
let isSharedClientConnected = false;

type ClientCallback = (client: Client) => Promise<void>;
const backgroundJobs: ClientCallback[] = [];

function retrySharedClientConnect() {
  setTimeout(() => {
    sharedClient = new Client(config);
    sharedClient.connect((error) => {
      if (error) {
        if (retryCounter-- === 0) {
          console.error(
            'error on connecting shared postgres client and retries failed.',
            error.stack
          );
          process.exit(1);
        }

        retrySharedClientConnect();
        return;
      }

      isSharedClientConnected = true;

      sharedClient.on('error', (error) => {
        isSharedClientConnected = false;
        console.error('error on shared postgres client.', error.stack);
        retrySharedClientConnect();
      });

      retryCounter = RECONNECTION_RETRY_COUNT;
      backgroundJobs.forEach(async (callback) => await callback(sharedClient));
    });
  }, RECONNECTION_TIMEOUT);
}

sharedClient.connect((error) => {
  if (error) {
    console.error('error on connecting shared postgres client.', error.stack);
    retrySharedClientConnect();
    return;
  }

  isSharedClientConnected = true;

  sharedClient.on('error', (error) => {
    isSharedClientConnected = false;
    console.error('error on shared postgres client.', error.stack);
    retrySharedClientConnect();
  });

  backgroundJobs.forEach(async (callback) => await callback(sharedClient));
});

export async function addBackgroundJob(
  callback: ClientCallback = async (client) => {},
  execute = true
) {
  function removeBackgroundJob() {
    const index = backgroundJobs.indexOf(callback);
    backgroundJobs.splice(index, 1);
  }

  backgroundJobs.push(callback);

  if (isSharedClientConnected && execute) {
    await callback(sharedClient);
  }

  return removeBackgroundJob;
}

type WithSessionCallback = <R = any>(functions: ReturnType<typeof useFunctions>) => Promise<R>;
type WithConnectionCallback<R = any> = (
  withSession: (callback: WithSessionCallback) => Promise<R>
) => Promise<R>;

export async function withConnection<R = any>(
  context: { jwt?: string; ip?: string },
  callback: WithConnectionCallback<R>
) {
  const client = await pool.connect();

  async function withSession<RSession = any> (
    callback: WithSessionCallback
  ): Promise<RSession> {
    const functions = useFunctions(client);
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [
      context.jwt,
      context.ip
    ]);

    try {
      await client.query('BEGIN');
      const res = await callback(functions);
      await client.query('COMMIT');
      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.query('SELECT operation_.end_session_()');
    }
  }

  try {
    return await callback(withSession);
  } finally {
    client.release();
  }
}

function useFunctions(client: PoolClient) {
  async function queryAll<R = any, I extends any[] = any[]>(
    sql: string | QueryConfig<I>,
    ...parameters: I
  ): Promise<R[]> {
    const res =
      parameters.length > 0
        ? await client.query<Record<string, R>, I>(sql, parameters)
        : await client.query<Record<string, R>, I>(sql);
    const resultFieldName = res.fields[0].name;
    return res.rows.map((r) => r[resultFieldName]);
  }

  async function query<R = any, I extends any[] = any[]>(
    sql: string | QueryConfig<I>,
    ...parameters: I
  ): Promise<R> {
    const res = await queryAll<R, I>(sql, ...parameters);
    return res[0];
  }

  async function queryResourceAccess(id: string): Promise<string> {
    return await query<string, [string]>(
      'SELECT * FROM operation_.query_resource_access_($1::text)',
      id
    );
  }

  async function queryResource<R = any, F extends Record<string, any> = Record<string, any>>(
    id_or_resource_name: string,
    filter?: F
  ): Promise<R> {
    if (filter) {
      const resources = await queryResourceAll<R, F>(id_or_resource_name, filter);
      return resources[0];
    }

    const id = id_or_resource_name;
    return await query('SELECT * FROM operation_.query_resource_($1::text)', id);
  }

  async function queryResourceAll<R = any, F extends Record<string, any> = Record<string, any>>(
    resource_name: string,
    filter?: F
  ): Promise<R[]> {
    return await queryAll(
      'SELECT * FROM operation_.query_resource_all_($1::text, $2::jsonb)',
      resource_name,
      filter
    );
  }

  async function createResource<R = any, I extends Record<string, any> = Record<string, any>>(
    resource_name: string,
    data: I
  ): Promise<R> {
    return await query<R, [string, I]>(
      'SELECT * FROM operation_.create_resource_($1::text, $2::jsonb)',
      resource_name,
      data
    );
  }

  async function updateResource<R = any, I extends Record<string, any> = Record<string, any>>(
    id: string,
    data: I
  ): Promise<R> {
    return await query<R, [string, I]>(
      'SELECT * FROM operation_.update_resource_($1::text, $2::jsonb)',
      id,
      data
    );
  }

  async function deleteResource<R = any, I extends Record<string, any> = Record<string, any>>(
    id: string
  ): Promise<R> {
    return await query<R, [string]>('SELECT * FROM operation_.delete_resource_($1::text)', id);
  }

  return {
    client,
    queryAll,
    query,
    queryResourceAccess,
    queryResource,
    queryResourceAll,
    createResource,
    updateResource,
    deleteResource
  };
}

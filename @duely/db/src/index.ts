import { ClientBase, Pool, PoolClient, QueryConfig } from 'pg';
import config from './config';
import fs from 'fs';
import { ResolvableValue, Util } from '@duely/core';
import { AccessLevel, Resources, ResourcesWithState } from './resources';

export * from './errors';
export * from './resources';

if (!process.env.DUELY_SERVICE_ACCOUNT_PASSWORD) {
  if (!process.env.SERVICEACCOUNTCONFIGFILE) {
    throw new Error('Invalid configuration.');
  }

  const config = JSON.parse(fs.readFileSync(process.env.SERVICEACCOUNTCONFIGFILE, 'utf8'));
  process.env = {
    ...config.env,
    ...process.env
  };

  if (!process.env.DUELY_SERVICE_ACCOUNT_PASSWORD) {
    throw new Error('Invalid configuration.');
  }
}

export const pool = new Pool(config);
pool.on('error', (error) => {
  console.error('error on idle postgres client.', error.stack);
});

type WithSessionExCallback<TArg = any, R = any> = (arg: TArg) => Promise<R>;
type WithSessionCallback<R = any> = (functions: ReturnType<typeof useFunctions>) => Promise<R>;
type WithConnectionCallback<R = any> = (
  withSession: (callback: WithSessionCallback) => Promise<R>
) => Promise<R>;

type Context = {
  ip?: string | null;
  jwt: string | null;
};

export async function beginVisit(): Promise<string> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM operation_.begin_visit_() jwt_');
    return res.rows[0].jwt_;
  } finally {
    client.release();
  }
}

export async function endVisit(context: Context): Promise<void>;
export async function endVisit(client: ClientBase): Promise<void>;
export async function endVisit(arg: Context | ClientBase): Promise<void> {
  await query(arg as any /* Context | ClientBase */, 'SELECT operation_.end_visit_()');
}

export async function logIn(
  context: Context,
  email_address: string,
  password: string
): Promise<string>;
export async function logIn(
  client: ClientBase,
  email_address: string,
  password: string
): Promise<string>;
export async function logIn(
  arg: Context | ClientBase,
  email_address: string,
  password: string
): Promise<string> {
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT operation_.log_in_user_($1::text, $2::text)',
    email_address,
    password
  );
}

export async function logOut(context: Context): Promise<void>;
export async function logOut(client: ClientBase): Promise<void>;
export async function logOut(arg: Context | ClientBase): Promise<void> {
  await query(arg as any /* Context | ClientBase */, 'SELECT operation_.log_out_user_()');
}

type CurrentUser = {
  id: string;
  name: string;
  email_address: string;
};

export async function queryCurrentUser(context: Context): Promise<CurrentUser | null>;
export async function queryCurrentUser(client: ClientBase): Promise<CurrentUser | null>;
export async function queryCurrentUser(arg: Context | ClientBase): Promise<CurrentUser | null> {
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.query_current_user_()'
  );
}

export async function withSessionEx<TArg = any, R = any>(
  context: ResolvableValue<Context, [ClientBase]>,
  callback: WithSessionExCallback<TArg, R>,
  arg: ResolvableValue<TArg, [ClientBase]>,
  client?: ClientBase
): Promise<R> {
  let poolClient: PoolClient | null = null;

  if (!client) {
    poolClient = await pool.connect();
    client = poolClient;
  }

  try {
    context = await Util.resolve(context, client);
    const resolvedArg: TArg = await Util.resolve(arg, client);

    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [
      context.jwt,
      context.ip
    ]);

    try {
      await client.query('BEGIN');
      const res = await callback(resolvedArg);
      await client.query('COMMIT');
      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      await client.query('SELECT operation_.end_session_()');
    }
  } finally {
    poolClient?.release();
  }
}

export async function withSession<R = any>(
  context: Context,
  callback: WithSessionCallback<R>,
  client?: ClientBase
): Promise<R> {
  return await withSessionEx(context, callback, useFunctions, client);
}

async function logInServiceAccount() {
  const context = {
    jwt: await beginVisit()
  };

  const callback = async (client: ClientBase) => {
    return {
      jwt: await logIn(
        client,
        'serviceaccount@duely.app',
        process.env.DUELY_SERVICE_ACCOUNT_PASSWORD!
      )
    };
  };

  return await withSessionEx(context, callback, Util.identity);
}

const serviceAccountContextState: {
  ttl: number;
  logInTime: number;
  contextPromise: Promise<Context> | null;
} = {
  ttl: 4001000,
  logInTime: Number.NEGATIVE_INFINITY,
  contextPromise: null
};

export async function getServiceAccountContext(): Promise<Context> {
  const time = Date.now();

  if (time - serviceAccountContextState.logInTime > serviceAccountContextState.ttl) {
    serviceAccountContextState.logInTime = time;
    serviceAccountContextState.contextPromise = logInServiceAccount();
  }

  return await serviceAccountContextState.contextPromise!;
}

export async function withConnection<R = any>(
  context: Context,
  callback: WithConnectionCallback<R>
) {
  const client = await pool.connect();
  try {
    return await callback(async (callback) => await withSession(context, callback, client));
  } finally {
    client.release();
  }
}

function isClient(contextOrClient: Context | ClientBase): contextOrClient is ClientBase {
  return Util.hasMethod(contextOrClient, 'query');
}

export async function queryAll<R = any, I extends any[] = any[]>(
  client: ClientBase,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R[]>;

export async function queryAll<R = any, I extends any[] = any[]>(
  context: Context,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R[]>;

export async function queryAll<R = any, I extends any[] = any[]>(
  arg: Context | ClientBase,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R[]> {
  if (isClient(arg)) {
    const client = arg;
    const res =
      parameters?.length ?? 0 > 0
        ? await client.query<Record<string, R>, I>(sql, parameters)
        : await client.query<Record<string, R>, I>(sql);
    const resultFieldName = res.fields[0].name;
    return res.rows.map((r) => r[resultFieldName]);
  }

  const callback = async (client: ClientBase) => await queryAll(client, sql, ...parameters);
  const context = arg;
  return await withSessionEx(context, callback, Util.identity);
}

export async function query<R = any, I extends any[] = any[]>(
  context: Context,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R>;
export async function query<R = any, I extends any[] = any[]>(
  client: ClientBase,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R>;
export async function query<R = any, I extends any[] = any[]>(
  arg: Context | ClientBase,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R> {
  const res = await queryAll<R, I>(arg as any /* Context | ClientBase */, sql, ...parameters);
  return res[0];
}

export async function queryResourceAccess(context: Context, id: string): Promise<AccessLevel>;
export async function queryResourceAccess(client: ClientBase, id: string): Promise<AccessLevel>;
export async function queryResourceAccess(
  arg: Context | ClientBase,
  id: string
): Promise<AccessLevel> {
  return await query<AccessLevel, [string]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.query_resource_access_($1::text)',
    id
  );
}

export async function queryResource<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  id_or_filter: string | Partial<Resources[K]>,
  token?: string
): Promise<Resources[K]>;
export async function queryResource<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  id_or_filter: string | Partial<Resources[K]>,
  token?: string
): Promise<Resources[K]>;
export async function queryResource<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  id_or_filter: string | Partial<Resources[K]>,
  token?: string
): Promise<Resources[K]> {
  if (!arg || !resource_name || !id_or_filter) throw Error('Arguments are required');

  const parameterPgTypes = ['text'];

  parameterPgTypes.push(typeof id_or_filter === 'string' ? 'text' : 'jsonb');

  if (token != undefined) parameterPgTypes.push('text');

  const parametersSql = parameterPgTypes.map((t, i) => `$${i + 1}::${t}`).join(', ');
  const parameters = [resource_name, id_or_filter, token].slice(0, parameterPgTypes.length);

  return await query(
    arg as any /* Context | ClientBase */,
    `SELECT * FROM operation_.query_resource_(${parametersSql})`,
    ...parameters
  );
}

export async function queryResourceAll<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  filter?: Partial<Resources[K]>,
  token?: string
): Promise<Resources[K][]>;
export async function queryResourceAll<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  filter?: Partial<Resources[K]>,
  token?: string
): Promise<Resources[K][]>;
export async function queryResourceAll<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  filter?: Partial<Resources[K]>,
  token?: string
): Promise<Resources[K][]> {
  if (!arg || !resource_name || !filter) throw Error('Arguments are required');

  const parameterPgTypes = ['text', 'jsonb'];

  if (token != undefined) parameterPgTypes.push('text');

  const parametersSql = parameterPgTypes.map((t, i) => `$${i + 1}::${t}`).join(', ');
  const parameters = [resource_name, filter, token].slice(0, parameterPgTypes.length);

  return await queryAll(
    arg as any /* Context | ClientBase */,
    `SELECT * FROM operation_.query_resource_(${parametersSql})`,
    ...parameters
  );
}

export async function createResource<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function createResource<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function createResource<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]> {
  return await query<Resources[K], [string, Partial<Resources[K]>]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.create_resource_($1::text, $2::jsonb)',
    resource_name,
    data
  );
}

export async function upsertResource<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function upsertResource<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function upsertResource<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  data: Partial<Resources[K]>
): Promise<Resources[K]> {
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.upsert_resource_($1::text, $2::jsonb)',
    resource_name,
    data
  );
}

export async function updateResource<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  id: string,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function updateResource<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  id: string,
  data: Partial<Resources[K]>
): Promise<Resources[K]>;
export async function updateResource<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  id: string,
  data: Partial<Resources[K]>
): Promise<Resources[K]> {
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.update_resource_($1::text, $2::text, $3::jsonb)',
    resource_name,
    id,
    data
  );
}

export async function deleteResource<K extends keyof Resources>(
  context: Context,
  resource_name: K,
  id: string
): Promise<Resources[K]>;
export async function deleteResource<K extends keyof Resources>(
  client: ClientBase,
  resource_name: K,
  id: string
): Promise<Resources[K]>;
export async function deleteResource<K extends keyof Resources>(
  arg: Context | ClientBase,
  resource_name: K,
  id: string
): Promise<Resources[K]> {
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.delete_resource_($1::text, $2::text)',
    resource_name,
    id
  );
}

function useFunctions(client: ClientBase) {
  return {
    client,
    async commit() {
      await client.query('COMMIT AND CHAIN');
    },
    async queryAll<R = any, I extends any[] = any[]>(
      sql: string | QueryConfig<I>,
      ...parameters: I
    ): Promise<R[]> {
      return await queryAll(client, sql, ...parameters);
    },
    async query<R = any, I extends any[] = any[]>(
      sql: string | QueryConfig<I>,
      ...parameters: I
    ): Promise<R> {
      return await query(client, sql, ...parameters);
    },
    queryResourceAccess: Util.partial(queryResourceAccess, client),
    async queryResource<K extends keyof Resources>(
      resource_name: K,
      id_or_filter: string | Partial<Resources[K]>,
      token?: string
    ): Promise<Resources[K]> {
      return await queryResource(client, resource_name, id_or_filter, token);
    },
    async queryResourceAll<K extends keyof Resources>(
      resource_name: K,
      filter?: Partial<Resources[K]>,
      token?: string
    ): Promise<Resources[K][]> {
      return await queryResourceAll(client, resource_name, filter, token);
    },
    async createResource<K extends keyof Resources>(
      resource_name: K,
      data: Partial<Resources[K]>
    ): Promise<Resources[K]> {
      return await createResource(client, resource_name, data);
    },
    async upsertResource<K extends keyof Resources>(
      resource_name: K,
      data: Partial<Resources[K]>
    ): Promise<Resources[K]> {
      return await upsertResource(client, resource_name, data);
    },
    async updateResource<K extends keyof Resources>(
      resource_name: K,
      id: string,
      data: Partial<Resources[K]>
    ): Promise<Resources[K]> {
      return await updateResource(client, resource_name, id, data);
    },
    async deleteResource<K extends keyof Resources>(
      resource_name: K,
      id: string
    ): Promise<Resources[K]> {
      return await deleteResource(client, resource_name, id);
    }
  };
}

export type ProcessingState = 'pending' | 'processing' | 'processed' | 'failed';

export async function updateProcessingState(
  context: Context,
  resource_name: keyof ResourcesWithState,
  id: string,
  state: ProcessingState
): Promise<void>;
export async function updateProcessingState(
  context: Context,
  resource_name: keyof ResourcesWithState,
  id: string,
  err: Error
): Promise<void>;
export async function updateProcessingState(
  context: Context,
  resource_name: keyof ResourcesWithState,
  id: string,
  arg: ProcessingState | Error
): Promise<void> {
  if (typeof arg === 'string') {
    const state = arg;
    await updateResource(context, resource_name, id, { state });
  } else {
    const err = arg;
    await updateResource(context, resource_name, id, {
      state: 'failed',
      error: err.toString()
    });
  }
}

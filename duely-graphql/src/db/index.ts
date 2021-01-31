import { ClientBase, Pool, PoolClient, QueryConfig } from 'pg';
import config from './config';
import fs from 'fs';
import { ResolvableValue, Util } from '@duely/core';

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
  jwt?: string | null;
};

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
  const context = async (client: ClientBase) => {
    const res = await client.query('SELECT * FROM operation_.begin_visit_() jwt_');
    return {
      jwt: res.rows[0].jwt_
    };
  };

  const callback = async (client: ClientBase) => {
    const res = await client.query('SELECT operation_.log_in_user_($1::text, $2::text) jwt_', [
      'serviceaccount@duely.app',
      process.env.DUELY_SERVICE_ACCOUNT_PASSWORD
    ]);
    return { jwt: res.rows[0].jwt_ };
  };

  return await withSessionEx(context, callback, Util.identity);
}

const serviceAccountContextPromise = logInServiceAccount();
export const fetchServiceAccountContext = () => serviceAccountContextPromise;

export async function withConnection<R = any>(
  context: Context,
  callback: WithConnectionCallback<R>
) {
  const client = await pool.connect();
  try {
    return await callback((callback) => withSession(context, callback, client));
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
  return withSessionEx(context, callback, Util.identity);
}

export async function query<R = any, I extends any[] = any[]>(
  client: ClientBase,
  sql: string | QueryConfig<I>,
  ...parameters: I
): Promise<R>;

export async function query<R = any, I extends any[] = any[]>(
  context: Context,
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

export async function queryResourceAccess(client: ClientBase, id: string): Promise<string>;
export async function queryResourceAccess(context: Context, id: string): Promise<string>;
export async function queryResourceAccess(arg: Context | ClientBase, id: string): Promise<string> {
  return await query<string, [string]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.query_resource_access_($1::text)',
    id
  );
}

export async function queryResource<R = any, F extends Record<string, any> = Record<string, any>>(
  client: ClientBase,
  id_or_resource_name: string,
  filter?: F
): Promise<R>;

export async function queryResource<R = any, F extends Record<string, any> = Record<string, any>>(
  context: Context,
  id_or_resource_name: string,
  filter?: F
): Promise<R>;

export async function queryResource<R = any, F extends Record<string, any> = Record<string, any>>(
  arg: Context | ClientBase,
  id_or_resource_name: string,
  filter?: F
): Promise<R> {
  if (filter) {
    const resources = await queryResourceAll<R, F>(
      arg as any /* Context | ClientBase */,
      id_or_resource_name,
      filter
    );
    return resources[0];
  }

  const id = id_or_resource_name;
  return await query(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.query_resource_($1::text)',
    id
  );
}

export async function queryResourceAll<
  R = any,
  F extends Record<string, any> = Record<string, any>
>(client: ClientBase, resource_name: string, filter?: F): Promise<R[]>;

export async function queryResourceAll<
  R = any,
  F extends Record<string, any> = Record<string, any>
>(context: Context, resource_name: string, filter?: F): Promise<R[]>;

export async function queryResourceAll<
  R = any,
  F extends Record<string, any> = Record<string, any>
>(arg: Context | ClientBase, resource_name: string, filter?: F): Promise<R[]> {
  return await queryAll(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.query_resource_all_($1::text, $2::jsonb)',
    resource_name, filter
  );
}

export async function createResource<R = any, I extends Record<string, any> = Record<string, any>>(
  client: ClientBase,
  resource_name: string,
  data: I
): Promise<R>;

export async function createResource<R = any, I extends Record<string, any> = Record<string, any>>(
  context: Context,
  resource_name: string,
  data: I
): Promise<R>;

export async function createResource<R = any, I extends Record<string, any> = Record<string, any>>(
  arg: Context | ClientBase,
  resource_name: string,
  data: I
): Promise<R> {
  return await query<R, [string, I]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.create_resource_($1::text, $2::jsonb)',
    resource_name, data
  );
}

export async function updateResource<R = any, I extends Record<string, any> = Record<string, any>>(
  client: ClientBase,
  id: string,
  data: I
): Promise<R>;

export async function updateResource<R = any, I extends Record<string, any> = Record<string, any>>(
  context: Context,
  id: string,
  data: I
): Promise<R>;

export async function updateResource<R = any, I extends Record<string, any> = Record<string, any>>(
  arg: Context | ClientBase,
  id: string,
  data: I
): Promise<R> {
  return await query<R, [string, I]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.update_resource_($1::text, $2::jsonb)',
    id, data
  );
}

export async function deleteResource<R = any>(client: ClientBase, id: string): Promise<R>;
export async function deleteResource<R = any>(context: Context, id: string): Promise<R>;
export async function deleteResource<R = any>(arg: Context | ClientBase, id: string): Promise<R> {
  return await query<R, [string]>(
    arg as any /* Context | ClientBase */,
    'SELECT * FROM operation_.delete_resource_($1::text)',
    id
  );
}

function useFunctions(client: ClientBase) {
  return {
    client,
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
    async queryResource<R = any, F extends Record<string, any> = Record<string, any>>(
      id_or_resource_name: string,
      filter?: F
    ): Promise<R> {
      return await queryResource(client, id_or_resource_name, filter);
    },
    async queryResourceAll<R = any, F extends Record<string, any> = Record<string, any>>(
      resource_name: string,
      filter?: F
    ): Promise<R[]> {
      return await queryResourceAll(client, resource_name, filter);
    },
    async createResource<R = any, I extends Record<string, any> = Record<string, any>>(
      resource_name: string,
      data: I
    ): Promise<R> {
      return await createResource(client, resource_name, data);
    },
    async updateResource<R = any, I extends Record<string, any> = Record<string, any>>(
      id: string,
      data: I
    ): Promise<R> {
      return await updateResource(client, id, data);
    },
    async deleteResource<R = any>(id: string): Promise<R> {
      return await deleteResource(client, id);
    }
  };
}

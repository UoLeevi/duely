import axios from 'axios';
import type { Serializable } from 'child_process';

const lambdaServiceBaseUrl = new URL('http://duely-lambda-service:8080/run/');

export function createLambdaUrl(job: string, ...args: string[]): URL {
  const jobpath = encodeURIComponent(job);
  const argspath = args.map((arg) => `/${encodeURIComponent(arg)}`).join('');
  const endpoint = jobpath + argspath;
  return new URL(endpoint, lambdaServiceBaseUrl);
}

export type LambdaResult = Record<string, any> & Serializable & { success: boolean };

export async function runLambda(job: string, ...args: string[]): Promise<LambdaResult> {
  const url = createLambdaUrl(job, ...args);
  return await axios.post(url.toString());
}

export function setResult(result: LambdaResult) {
  if (!process.send) {
    throw new Error('`process.send` is undefined. Use the `setResult` only inside lambda process.');
  }

  process.send(result);
}

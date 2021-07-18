export type DuelyGraphQLErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'OTHER';

export class DuelyGraphQLError extends Error {
  extensions: {
    code: DuelyGraphQLErrorCode;
  };

  constructor(code: DuelyGraphQLErrorCode, message?: string) {
    super(message);

    this.extensions = {
      code
    };
  }
}

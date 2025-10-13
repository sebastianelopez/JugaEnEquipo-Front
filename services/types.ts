export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; errorMessage: string; error?: unknown };

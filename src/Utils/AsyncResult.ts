export type AsyncResult<T, E = string> =
    | {
          result: null;
          loading: true;
          error: null;
      }
    | {
          result: T;
          loading: false;
          error: null;
      }
    | {
          result: null;
          loading: false;
          error: E;
      };

export const initialAsyncResultValue = {
    result: undefined,
    loading: true,
    error: null,
};

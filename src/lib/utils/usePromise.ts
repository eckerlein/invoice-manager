function createResource<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T | undefined;
  let error: any;

  const suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      error = err;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw error;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

// Cache to store the resource
let cache: { [key: string]: any } = {};

export function usePromise<T>(key: string, promise: Promise<T>): T {
  if (!cache[key]) {
    cache[key] = createResource(promise);
  }
  return cache[key].read();
}

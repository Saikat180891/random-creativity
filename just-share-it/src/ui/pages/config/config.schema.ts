/* eslint-disable @typescript-eslint/no-explicit-any */
// ConfigPage/config.schema.ts

export const validatePort = (_: any, value: string) => {
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return Promise.reject("Port must be between 1 and 65535");
  }
  return Promise.resolve();
};

export const validateIp = (_: any, value: string) => {
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

  if (!ipRegex.test(value)) {
    return Promise.reject("Enter a valid IPv4 address");
  }
  return Promise.resolve();
};

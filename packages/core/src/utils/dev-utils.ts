export const logger: Console = new Proxy(console, {
  get() {
    // @ts-ignore
    const isProduction: boolean = process.env.NODE_ENV === "production";
    if (isProduction) {
      //TODO: save logs to file/db
      return;
    }
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    return Reflect.get(...arguments);
  },
  set() {
    // @ts-ignore
    const isProduction: boolean = process.env.NODE_ENV === "production";
    if (isProduction) {
      //TODO: save logs to file/db
      return;
    }
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    return Reflect.get(...arguments);
  },
});

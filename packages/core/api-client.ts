import { createAxiosClient } from "./src";

export const AxiosClient = createAxiosClient({
  endpointUrl: "localhost:3000",

  headers: {},
});
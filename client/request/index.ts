import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// let makeRequest =<P>:P
const makeRequest = <P, R>(
  options: AxiosRequestConfig<P>
): Promise<AxiosResponse<R, P>> => {
  const service = axios.create(options);
  service.interceptors.request.use((config) => {
    console.log("request:", config);
    // request middleware
    return config;
  });
  service.interceptors.response.use((config) => {
    // response middleware
    return config;
  });
  return service.request(options);
};

const request = <P, R>(config: AxiosRequestConfig<P>) => {
  return makeRequest<P, R>(config);
};

export default request;

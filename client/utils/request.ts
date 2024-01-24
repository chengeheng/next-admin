import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessTokenInCookie } from "./cookieUtils";

// let makeRequest =<P>:P
const makeRequest = <P, R>(
  options: AxiosRequestConfig<P>
): Promise<AxiosResponse<R, P>> => {
  const service = axios.create(options);
  service.interceptors.request.use((config) => {
    const headers = Object.assign({}, config.headers);
    const access_token = getAccessTokenInCookie();
    if (access_token) {
      headers.Authorization = headers.Authorization || `Bearer ${access_token}`;
    }
    // request middleware
    return { ...config, headers };
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

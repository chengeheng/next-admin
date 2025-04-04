"use client";
import { SWRConfig } from "swr";

const SWRProvider = ({ children, ...restProps }) => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 0,
        errorRetryCount: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...restProps,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;

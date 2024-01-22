"use client";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import styles from "./page.module.css";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import useSWRMutation, { MutationFetcher } from "swr/mutation";

import request from "@/client/request";
import useSWR, { Fetcher } from "swr";

interface loginProps {
  username: string;
  password: string;
}
const url = "/api/login";
const refreshUrl = "/api/token/refresh";
// const fetcher: MutationFetcher<AxiosResponse<loginProps>> = async (params) =>
//   await axios.post<loginProps, any>(url, params);
const fetcher: MutationFetcher<AxiosResponse<any>, string, loginProps> = (
  params
) => request<loginProps, any>({ url, params });

// TODO need to understand how pattern works （by delete {name: number} in AxiosResponse）
const refreshFetcher: Fetcher<
  AxiosResponse<{ user: string }, { name: number }>,
  { name: number }
> = (params) =>
  request({
    url: refreshUrl,
    method: "get",
    params,
  });

const Login = (props) => {
  const [form] = Form.useForm();

  const { data, trigger } = useSWRMutation(url, fetcher);
  const { data: testData } = useSWR([refreshUrl, 123], ([key, name]) =>
    refreshFetcher({ name })
  );
  console.log(data);
  console.log("testData:", testData);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2>Next Admin</h2>
        </div>
        <div className={styles.bottom}>
          <Form form={form}>
            <Form.Item name="username">
              <Input prefix={<UserOutlined color="#1677ff" />}></Input>
            </Form.Item>
            <Form.Item name="password">
              <Input prefix={<LockOutlined color="#1677ff" />}></Input>
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                onClick={() => {
                  console.log("click");
                  form.validateFields().then((values: loginProps) => {
                    trigger({
                      username: values.username,
                      password: values.password,
                    });
                  });
                }}
              >
                立即登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

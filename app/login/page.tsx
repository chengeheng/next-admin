"use client";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import styles from "./page.module.css";
import useSWRMutation from "swr/mutation";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { loginFetcher } from "@/client/api/login";

interface loginProps {
  username: string;
  password: string;
}

const Login = (props) => {
  const [form] = Form.useForm();

  const { data, trigger } = useSWRMutation("/api/login", loginFetcher);
  const router = useRouter();

  const handleSubmit = useCallback(
    () =>
      form.validateFields().then((values: loginProps) => {
        trigger({
          username: values.username,
          password: values.password,
        }).then((res) => {
          router.push("/dashboard");
        });
      }),
    [router]
  );

  useEffect(() => {
    // document.addEventListener("keypress", (e) => {
    //   if (e.key === "Enter") {
    //     handleSubmit();
    //   }
    // });
  }, [handleSubmit]);

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2>Next Admin</h2>
        </div>
        <div className={styles.bottom}>
          <Form form={form} onSubmitCapture={handleSubmit}>
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
                onClick={handleSubmit}
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

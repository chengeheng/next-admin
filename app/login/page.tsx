"use client";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import styles from "./page.module.css";

const Login = (props) => {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h2>Next Admin</h2>
        </div>
        <div className={styles.bottom}>
          <Form>
            <Form.Item name="username">
              <Input prefix={<UserOutlined color="#1677ff" />}></Input>
            </Form.Item>
            <Form.Item name="password">
              <Input prefix={<LockOutlined color="#1677ff" />}></Input>
            </Form.Item>
            <Form.Item>
              <Button style={{ width: "100%" }} type="primary">
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

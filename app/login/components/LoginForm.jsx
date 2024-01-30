"use client";
import Image from "next/image";
import React, { useState, memo, useEffect } from "react";
// import { useNavigate, useLocation } from 'react-router-dom'
import md5 from "md5";
import { Button, Form, Input, App } from "antd";
import { LockOutlined } from "@ant-design/icons";
// import rootStore, { observer } from '@/store'
// import { login } from '@/api/auth'
import { searchRoute, getlocalStorage } from "@/lib/utils";

const initialValues = {
  loginId: "sysAdmin",
  password: "Root@123",
  // password: '628c709b5d084dc6b22a6dbe87665419'
};

const LoginForm = () => {
  const { message } = App.useApp();
  console.log(message);
  // const navigate = useNavigate()
  // const { pathname } = useLocation()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [codeUrl, setCodeUrl] = useState(
    "/api/system/captcha/queryLoginCaptcha"
  );

  // const { authStore } = rootStore

  // 提交【验证成功】
  const onFinish = async (loginForm) => {
    if (!loginForm.captcha) {
      message.warning("请输入验证码");
      return false;
    }
    if (!loginForm.loginId || !loginForm.password) {
      message.warning("请输入用户名或密码");
      return false;
    }
    try {
      setLoading(true);
      // 获取登录信息
      // const { data } = await login({
      // 	...loginForm,
      // 	password: md5(loginForm.password)
      // })
      //   const { data } = await fetch("/api/system/session/getCurrentSession", {
      //     ...loginForm,
      //     password: md5(loginForm.password),
      //   });
      fetch("/api/system/session/login", {
        ...loginForm,
        password: md5(loginForm.password),
      }).then((res) => {
        if (res) {
        }
      });

      // authStore.setToken(data.sessionId)
      // authStore.setUserinfo(data)
      message.success("登录成功！");

      // 跳转
      // navigate('/home')
    } finally {
      setLoading(false);
      getCodeurl();
    }
  };

  const getCodeurl = () => {
    setCodeUrl(
      "/api/system/captcha/queryLoginCaptcha?time=" + new Date().getTime()
    );
  };
  useEffect(() => {
    const userInfo = getlocalStorage("userInfo") || {};
    // if (pathname === '/login') {
    // 	if (userInfo.id) {
    // 		// navigate('/home')
    // 	}
    // }
  }, []);

  // 提交【验证失败】
  const onFinishFailed = (errorInfo) => {
    console.log("Failed", errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        initialValues={initialValues}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="用户名"
          name="loginId"
          // rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          // rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item label="验证码" name="captcha">
          <Input
            addonAfter={
              <div style={{ width: 84 }}>
                <img
                  width={84}
                  // height={34}
                  src={codeUrl}
                  onClick={getCodeurl}
                  alt="验证码"
                />
              </div>
            }
            placeholder="请输入验证码"
            // style={{ width: "100%" }}
            className="code"
          />
        </Form.Item>
        <Form.Item className="login-btn">
          <Button type="primary" htmlType="submit" block loading={loading}>
            确认
          </Button>
        </Form.Item>
        <a>OA 登录</a>
      </Form>
    </>
  );
};

export default async () => {
  return (
    <App>
      <LoginForm />
    </App>
  );
};
// export default observer(LoginForm);

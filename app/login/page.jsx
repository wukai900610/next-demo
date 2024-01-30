import React, { memo } from "react";

import LoginForm from "./components/LoginForm";
import "./index.scss";

export const metadata = {
  title: "登录",
  description: "登录|注册",
};

const Login = memo(() => {
  return (
    <div className="login-container">
      <div className="login-left"></div>
      <div className="login-form">
        <div className="login-logo">
          <span className="logo-welcome">欢迎登录！</span>
          <span className="logo-title">认养1头牛供应链计划平台</span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
});

export default Login;

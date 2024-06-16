import React, { useState } from "react";
import SignIn from "./signin";
import Register from "../register/register";

function Login() {
  const [form, setForm] = useState(true);

  return (
    <> {form ? <SignIn setForm={setForm} /> : <Register setForm={setForm} />}</>
  );
}

export default Login;

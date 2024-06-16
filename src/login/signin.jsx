import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

function SignIn({ setForm }) {
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    /* LOGIN CONTAINER */
    <div className="flex h-full w-full">
      {/* IMAGE CONTAINER */}
      <div className="flex flex-1">
        <img
          src="./login.jpg"
          className="w-full rounded-br-xl rounded-tr-xl object-cover"
        />
      </div>

      {/* FORM DIV */}
      <div className="flex flex-1">
        {/* FORM CONTAINER */}
        <div className="flex h-full w-full flex-col">
          {/* TITLE */}
          <div className="flex flex-[0.5] items-center justify-center border-b border-slate-700 text-2xl">
            Welcome back !
          </div>

          {/* FORM WRAPPER */}
          <div className="-mt-20 flex h-full w-full flex-[4] flex-col items-center justify-center gap-10">
            <h1>Sign in to your account!</h1>
            <form
              onSubmit={handleLogin}
              className="flex w-[80%] flex-col items-center justify-center gap-10"
            >
              {/* EMAIL */}
              <div className="flex w-full flex-col gap-3">
                <label htmlFor="email" className="">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="johndoe@mail.com"
                  name="email"
                  className="flex-1 rounded-lg bg-[rgba(42,60,94,0.5)] p-2 outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div className="flex w-full flex-col gap-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="******"
                  name="password"
                  className="flex-1 rounded-lg bg-[rgba(42,60,94,0.5)] p-2 outline-none"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className={`flex w-[50%] items-center justify-center rounded-xl bg-[rgba(42,60,94,0.9)] p-4 transition-all duration-150 ease-in hover:scale-105 ${loading && "cursor-not-allowed"}`}
                disabled={loading}
              >
                {loading ? (
                  <TailSpin height={24} width={24} radius={1} color="white" />
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* NAVIGATE TO SIGNUP/REGISTER */}
            <button onClick={() => setForm((prev) => !prev)}>
              <p className="underline">Dont have an account? Sign up</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

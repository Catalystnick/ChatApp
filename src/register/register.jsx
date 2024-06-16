import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../lib/upload";
import { TailSpin } from "react-loader-spinner";

function Register({ setForm }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  function handleAvatar(e) {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "user", response.user.uid), {
        username,
        email,
        id: response.user.uid,
        blocked: [],
        avatar: imgUrl,
      });

      await setDoc(doc(db, "userchats", response.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can log in now");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    /* REGISTER CONTAINER */
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
            Hello there !
          </div>
          <div className="-mt-20 flex h-full w-full flex-[4] flex-col items-center justify-center gap-10">
            <h1>Create an account!</h1>
            {/* REGISTER FORM */}
            <form
              onSubmit={handleRegister}
              className="flex w-[80%] flex-col items-center justify-center gap-5"
            >
              {/* USERNAME */}
              <div className="flex w-full flex-col gap-3">
                <label htmlFor="username" className="">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  name="username"
                  className="flex-1 rounded-lg bg-[rgba(42,60,94,0.5)] p-2 outline-none"
                />
              </div>

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

              {/* ADD PROFILE PICTURE */}
              <div className="flex w-full">
                <label
                  htmlFor="file"
                  className="flex cursor-pointer items-center gap-5 hover:underline"
                >
                  <img
                    src={avatar.url || "./avatar.png"}
                    className="h-[80px] w-[80px] rounded-[50%] object-cover"
                  />
                  Upload an image
                </label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  onChange={handleAvatar}
                />
              </div>

              {/* REGISTER */}
              <button
                type="submit"
                className={`flex w-[50%] items-center justify-center rounded-xl bg-[rgba(42,60,94,0.9)] p-4 transition-all duration-150 ease-in hover:scale-105 ${loading && "cursor-not-allowed"}`}
                disabled={loading}
              >
                {loading ? (
                  <TailSpin height={24} width={24} radius={1} color="white" />
                ) : (
                  "Register"
                )}
              </button>
            </form>
            {/* NAVIGATE TO LOGIN */}
            <button onClick={() => setForm((prev) => !prev)}>
              <p className="underline">Have an account? Log in.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

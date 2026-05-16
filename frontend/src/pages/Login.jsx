import { useState } from "react";

export default function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = () => {

    // ADMIN
    if (
      username === "captreobn" &&
      password === "123456admin"
    ) {

      localStorage.setItem(
        "role",
        "admin"
      );

      window.location.href =
        "/dashboard";

      return;
    }

    // USER
    if (
      username === "captreobn" &&
      password === "123456"
    ) {

      localStorage.setItem(
        "role",
        "user"
      );

      window.location.href =
        "/spare-devices";

      return;
    }

    alert("Sai tài khoản");
  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
      "
    >

      <div
        className="
          bg-white
          p-10
          rounded-3xl
          shadow-xl
          w-[400px]
          space-y-5
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
          "
        >
          Đăng nhập
        </h1>

        <input
          type="text"
          placeholder="Tài khoản"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="
            border
            p-4
            rounded-xl
            w-full
          "
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            border
            p-4
            rounded-xl
            w-full
          "
        />

        <button
          onClick={handleLogin}
          className="
            bg-blue-500
            text-white
            w-full
            p-4
            rounded-xl
            font-bold
          "
        >
          Đăng nhập
        </button>

      </div>

    </div>
  );
}

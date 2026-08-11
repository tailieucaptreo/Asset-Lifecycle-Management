import axios from "axios";
import API from "../config";

import { useState, useEffect } from "react";

import { Eye, EyeOff } from "lucide-react";

export default function Login() {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    // Hiện / ẩn mật khẩu
    const [showPassword, setShowPassword] =
        useState(false);


    useEffect(() => {

        const timer = setTimeout(() => {

            autoBackup();

        }, 500);

        return () => clearTimeout(timer);

    }, []);


    // =====================================================
    // AUTO BACKUP
    // =====================================================

    const autoBackup = async () => {

        try {

            const today =
                new Date()
                    .toISOString()
                    .slice(0, 10);


            const lastBackup =
                localStorage.getItem(
                    "lastBackup"
                );


            if (lastBackup === today) {

                return;

            }


            const response =
                await axios.get(

                    `${API}/api/backup/system`,

                    {
                        responseType: "blob"
                    }

                );


            const blob =
                new Blob([
                    response.data
                ]);


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                `AssetLifecycleBackup_${today}.xlsx`;


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            localStorage.setItem(
                "lastBackup",
                today
            );

        }

        catch (err) {

            console.error(
                "Auto Backup Error:",
                err
            );

        }

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        if (e) {

            e.preventDefault();

        }


        try {

            const res =
                await axios.post(

                    `${API}/api/auth/login`,

                    {
                        username,
                        password
                    }

                );


            // Token
            localStorage.setItem(
                "token",
                res.data.token
            );


            // User
            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data.user
                )
            );


            // Role
            localStorage.setItem(
                "role",
                res.data.user.role
            );


            // Chuyển trang
            if (
                res.data.user.role === "admin"
            ) {

                window.location.href =
                    "/dashboard";

            }

            else {

                window.location.href =
                    "/spare-devices";

            }

        }

        catch (err) {

            console.log(err);


            if (
                err.response?.status === 401
            ) {

                alert(
                    "Sai tên đăng nhập hoặc mật khẩu"
                );

                return;

            }


            if (
                err.response?.status === 500
            ) {

                alert(
                    "Lỗi máy chủ, vui lòng thử lại"
                );

                return;

            }


            alert(

                err.response?.data?.message ||

                "Đăng nhập thất bại"

            );

        }

    };


    return (

        <div
            className="
            relative
            min-h-screen
            overflow-hidden
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-[#3B1EFF]
            via-[#246BFF]
            to-[#00C6FF]
            "
        >

            {/* =================================================
                NỀN BLUR
            ================================================= */}

            <div
                className="
                absolute
                top-[-200px]
                left-[-100px]
                w-[500px]
                h-[500px]
                bg-pink-500/30
                rounded-full
                blur-[180px]
                "
            />


            <div
                className="
                absolute
                bottom-[-200px]
                right-[-150px]
                w-[600px]
                h-[600px]
                bg-cyan-300/30
                rounded-full
                blur-[220px]
                "
            />


            {/* =================================================
                LOGIN CARD
            ================================================= */}

            <div
                className="
                relative
                z-10
                w-[450px]
                max-w-[90vw]
                rounded-[36px]
                bg-white/15
                backdrop-blur-2xl
                border
                border-white/20
                shadow-[0_20px_80px_rgba(0,0,0,.25)]
                p-10
                "
            >

                <form onSubmit={handleLogin}>

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="text-center">

                        <div className="text-6xl mb-4">
                            🔐
                        </div>


                        <h1
                            className="
                            text-white
                            font-black
                            text-4xl
                            mb-2
                            "
                        >
                            Đăng nhập
                        </h1>


                        <p
                            className="
                            text-white/70
                            mb-8
                            "
                        >
                            Hệ Thống Quản Lý Thiết Bị
                        </p>

                    </div>


                    {/* =================================================
                        TÀI KHOẢN
                    ================================================= */}

                    <input
                        type="text"
                        placeholder="Tài khoản"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        className="
                        w-full
                        mb-5
                        p-5
                        rounded-2xl
                        bg-white/15
                        border
                        border-white/20
                        text-white
                        placeholder-white/50
                        outline-none
                        focus:ring-2
                        focus:ring-cyan-300
                        "
                    />


                    {/* =================================================
                        MẬT KHẨU + CON MẮT
                    ================================================= */}

                    <div
                        className="
                        relative
                        w-full
                        mb-6
                        "
                    >

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className="
                            w-full
                            p-5
                            pr-14
                            rounded-2xl
                            bg-white/15
                            border
                            border-white/20
                            text-white
                            placeholder-white/50
                            outline-none
                            focus:ring-2
                            focus:ring-cyan-300
                            "
                        />


                        {/* CON MẮT */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (prev) =>
                                        !prev
                                )
                            }
                            className="
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            flex
                            items-center
                            justify-center
                            p-2
                            text-white/70
                            hover:text-white
                            transition
                            duration-200
                            "
                            aria-label={
                                showPassword
                                    ? "Ẩn mật khẩu"
                                    : "Hiện mật khẩu"
                            }
                        >

                            {showPassword ? (

                                <EyeOff
                                    size={23}
                                    strokeWidth={2}
                                />

                            ) : (

                                <Eye
                                    size={23}
                                    strokeWidth={2}
                                />

                            )}

                        </button>

                    </div>


                    {/* =================================================
                        NÚT ĐĂNG NHẬP
                    ================================================= */}

                    <button
                        type="submit"
                        className="
                        w-full
                        p-5
                        rounded-2xl
                        font-bold
                        text-lg
                        text-white
                        bg-gradient-to-r
                        from-cyan-400
                        to-blue-600
                        hover:scale-[1.02]
                        transition
                        duration-300
                        shadow-lg
                        "
                    >

                        Đăng nhập

                    </button>

                </form>

            </div>

        </div>

    );

}

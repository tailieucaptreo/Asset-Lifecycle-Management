import { useState } from "react";
import axios from "axios";
import API from "../config";

export default function Login() {

const [username,setUsername]=
useState("");

const [password,setPassword]=
useState("");

const [loading,setLoading]=
useState(false);


const handleLogin=
async()=>{

try{

setLoading(true);

const res=
await axios.post(

`${API}/api/auth/login`,

{
username,
password
}

);


// lưu token

localStorage.setItem(
"token",
res.data.token
);


// lưu role

localStorage.setItem(
"role",
res.data.user.role
);


// lưu tên

localStorage.setItem(
"username",
res.data.user.username
);


// chuyển trang

if(
res.data.user.role==="admin"
){

window.location.href=
"/dashboard";

}else{

window.location.href=
"/spare-devices";

}

}

catch(err){

alert(

err.response?.data?.message ||

"Đăng nhập thất bại"

);

}

finally{

setLoading(false);

}

};

return (

<div
className="
min-h-screen
relative
overflow-hidden
bg-gradient-to-br
from-indigo-700
via-blue-600
to-cyan-500
flex
items-center
justify-center
"
>

{/* nền hiệu ứng */}

<div
className="
absolute
top-[-150px]
left-[-150px]
w-[450px]
h-[450px]
bg-pink-500/30
rounded-full
blur-3xl
animate-pulse
"
/>

<div
className="
absolute
bottom-[-200px]
right-[-150px]
w-[500px]
h-[500px]
bg-cyan-300/30
rounded-full
blur-3xl
animate-pulse
"
/>


{/* CARD LOGIN */}

<div
className="
relative
z-10
w-[420px]
backdrop-blur-xl
bg-white/15
border
border-white/20
rounded-[30px]
shadow-2xl
p-10
"
>

<h1
className="
text-5xl
font-black
text-white
text-center
mb-3
"
>
🔐
</h1>

<h2
className="
text-3xl
font-bold
text-center
text-white
mb-8
"
>
Đăng nhập
</h2>

<input
type="text"
placeholder="Tài khoản"
value={username}
onChange={(e)=>
setUsername(
e.target.value
)
}
className="
w-full
mb-5
p-4
rounded-2xl
bg-white/20
text-white
placeholder-white/70
outline-none
border
border-white/20
focus:border-cyan-300
"
/>

<input
type="password"
placeholder="Mật khẩu"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)
}
className="
w-full
mb-6
p-4
rounded-2xl
bg-white/20
text-white
placeholder-white/70
outline-none
border
border-white/20
focus:border-cyan-300
"
/>

<button
onClick={handleLogin}
className="
w-full
p-4
rounded-2xl
font-bold
text-lg
bg-gradient-to-r
from-cyan-400
to-blue-500
text-white
hover:scale-[1.02]
transition
duration-300
shadow-lg
"
>

Đăng nhập

</button>

<p
className="
text-center
text-white/70
mt-6
text-sm
"
>

Asset Lifecycle Management

</p>

</div>

</div>

);

import { useState } from "react";

export default function Login() {

const [username,setUsername]=
useState("");

const [password,setPassword]=
useState("");

const handleLogin=()=>{

if(
username==="captreobn" &&
password==="123456admin"
){

localStorage.setItem(
"role",
"admin"
);

window.location.href=
"/dashboard";

return;

}

if(
username==="captreobn" &&
password==="123456"
){

localStorage.setItem(
"role",
"user"
);

window.location.href=
"/spare-devices";

return;

}

alert(
"Sai tài khoản"
);

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

{/* nền blur */}

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


{/* CARD */}

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
Asset Lifecycle Management
</p>

</div>


<input
type="text"
placeholder="Tài khoản"
value={username}
onChange={(e)=>
setUsername(
e.target.value
)}
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


<input
type="password"
placeholder="Mật khẩu"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
className="
w-full
mb-6
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


<button
onClick={handleLogin}
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

</div>

</div>

);

}

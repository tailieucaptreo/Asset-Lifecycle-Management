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

return(

<div
className="
min-h-screen
flex
items-center
justify-center
relative
overflow-hidden
bg-gradient-to-br
from-indigo-700
via-blue-600
to-cyan-500
"
>

<div
className="
absolute
top-[-150px]
left-[-150px]
w-[450px]
h-[450px]
rounded-full
bg-pink-500/30
blur-3xl
animate-pulse
"
/>

<div
className="
absolute
bottom-[-150px]
right-[-150px]
w-[500px]
h-[500px]
rounded-full
bg-cyan-300/30
blur-3xl
animate-pulse
"
/>

<div
className="
relative
z-10
w-[420px]
bg-white/15
backdrop-blur-xl
border
border-white/20
rounded-[30px]
shadow-2xl
p-10
"
>

<h1
className="
text-center
text-5xl
mb-4
"
>
🔐
</h1>

<h2
className="
text-center
text-white
font-bold
text-3xl
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
placeholder:text-white/60
outline-none
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
placeholder:text-white/60
outline-none
"
/>

<button
onClick={handleLogin}
className="
w-full
p-4
rounded-2xl
font-bold
text-white
bg-gradient-to-r
from-cyan-400
to-blue-500
hover:scale-[1.02]
transition
"
>

Đăng nhập

</button>

<p
className="
mt-6
text-center
text-white/70
text-sm
"
>

Asset Lifecycle Management

</p>

</div>

</div>

);

}

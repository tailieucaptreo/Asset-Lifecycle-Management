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

return(

<div
className="
min-h-screen
flex
justify-center
items-center
bg-gray-100
"
>

<div
className="
bg-white
w-[420px]
rounded-3xl
shadow-xl
p-10
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

onChange={(e)=>
setUsername(
e.target.value
)
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

onChange={(e)=>
setPassword(
e.target.value
)
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

disabled={loading}

className="
w-full
bg-blue-600
hover:bg-blue-700
text-white
rounded-xl
p-4
font-bold
"

>

{
loading
?
"Đang đăng nhập..."
:
"Đăng nhập"
}

</button>

</div>

</div>

);

}

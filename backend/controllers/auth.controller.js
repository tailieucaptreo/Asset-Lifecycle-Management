const jwt =
require("jsonwebtoken");

exports.login =
async (
req,
res
)=>{

try{

const {
username,
password
}=
req.body;


// ADMIN

if(
username==="captreobn" &&
password==="123456admin"
){

const token=
jwt.sign(

{
username:
"captreobn",

role:
"admin"
},

process.env.JWT_SECRET,

{
expiresIn:
"7d"
}

);

return res.json({

token,

user:{

username:
"captreobn",

role:
"admin"

}

});

}


// USER

if(
username==="captreobn" &&
password==="123456"
){

const token=
jwt.sign(

{
username:
"captreobn",

role:
"user"
},

process.env.JWT_SECRET,

{
expiresIn:
"7d"
}

);

return res.json({

token,

user:{

username:
"captreobn",

role:
"user"

}

});

}


// SAI

return res
.status(401)
.json({

message:
"Sai tài khoản"

});

}

catch(err){

console.log(err);

return res
.status(500)
.json({

message:
"Lỗi server"

});

}

};

const prisma = require("../prisma");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

try {

const {
username,
password
} = req.body;

const user =
await prisma.user.findUnique({

where:{
username
}

});

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


return res
.status(401)
.json({

message:
"Sai tài khoản"

});

}

catch{

res
.status(500)
.json({

message:
"Lỗi server"

});

}

};

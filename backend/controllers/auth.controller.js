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

if(!user){

return res
.status(401)
.json({
message:"Sai tài khoản"
});

}

if(password!==user.password){

return res
.status(401)
.json({
message:"Sai mật khẩu"
});

}

const token =
jwt.sign(

{
id:user.id,
role:user.role,
username:user.username
},

process.env.JWT_SECRET,

{
expiresIn:"7d"
}

);

res.json({

token,

user:{

username:
user.username,

role:
user.role

}

});

}

catch(err){

console.log(err);

res
.status(500)
.json({
message:"Server error"
});

}

};

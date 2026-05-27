const jwt =
require("jsonwebtoken");

module.exports =
(req,res,next)=>{

try{

const authHeader =
req.headers.authorization;

if(!authHeader){

return res
.status(401)
.json({

message:
"Unauthorized"

});

}

const token =
authHeader
.split(" ")[1];

if(!token){

return res
.status(401)
.json({

message:
"Token missing"

});

}

req.user =
jwt.verify(

token,

process.env.JWT_SECRET

);

next();

}

catch(err){

console.log(
"AUTH ERROR:",
err.message
);

return res
.status(401)
.json({

message:
"Invalid token"

});

}

};

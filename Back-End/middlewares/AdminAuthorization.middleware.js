const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/users.model");
const saltRounds = Number(process.env.saltRounds);

const AdminAuthorizationMiddleware = async (req,res,next)=>{
    let token = req.headers.authorization;// it will contain Bearer & Token;

    if(token)
    {
        // console.log(token);
        try {
            var decoded = jwt.verify(token.split(" ")[1], process.env.jwt_secret_key);
            // console.log(decoded);
            if(decoded)
            {
                let user = await UserModel.findById(decoded.userID);
                // console.log(user)
                if(user.role == "Admin")
                {
                    next();
                }else{
                    res.send({msg:"You are not authorized to perform this operation."});
                }
            }else{
                res.send({msg:"Please Log in 1"});
            }
        } catch (error) {
            // console.log(error);
            res.send({err:error.message});
        }

    }else{
        res.send({msg:"Please Log in 2"});
    }
};


module.exports  = {
    AdminAuthorizationMiddleware
}
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt")
const saltRounds = Number(process.env.saltRounds);

const UserAuthorizationMiddleware = (req,res,next)=>{
    const {password} = req.body;
    let token = req.headers.authorization;// it will contain Bearer & Token;
    if(token)
    {
        // console.log(token);
        try {
            var decoded = jwt.verify(token.split(" ")[1], process.env.jwt_secret_key);
            // console.log(decoded);
            if(decoded)
            {
                if(password){
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        // hash is hashed password.
                        if (err) {
                            console.log(err);
                            res.send({ err: err.message });
                            return;
                        }
                    req.body.password = hash;
                    req.body.userID = decoded.userID;
                    next();
                    });
                }else{
                    req.body.userID = decoded.userID;
                    next();
                }

            }else{
                res.send({msg:"Please Log in first"})
            }
        } catch (error) {
            // console.log(error);
            res.send({err:error.message})
        }

    }else{
        res.send({msg:"Please Log in first"})
    }
};

const AfterAddCartQuantity = (req,res,next)=>{
    const {quantity} = req.body;
    if(req.method == "PATCH"){
        if(quantity >= 0){
            next();
        }
    }
};


module.exports  = {
    UserAuthorizationMiddleware,
    AfterAddCartQuantity
}
const { UserModel } = require("../models/users.model");
require('dotenv').config();
const bcrypt = require("bcrypt")
const saltRounds = Number(process.env.saltRounds);


const registrationMiddleware = async (req, res, next) => {
    const { email, password, mobile } = req.body;
    try {
        const emailUser = await UserModel.find({ email });
        const mobileuser = await UserModel.find({ mobile });
        // console.log(emailUser,mobileuser);
        if (emailUser.length !== 0) res.send({ msg: "This Email is already registered. Try Log in",err:false })
        else if (mobileuser.length !== 0) res.send({ msg: "This Mobile Number is already registered. Try Log in",err:false })
        else {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                // hash is hashed password.
                if (err) {
                    console.log(err);
                    res.send({ err: err.message,err:false });
                    return;
                }
                req.body.password = hash;
                next();
            });
        }
    } catch (error) {
        res.send({ err: error.message });
    }
};

module.exports = { registrationMiddleware }
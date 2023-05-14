const { UserModel } = require("../models/users.model");
const express = require("express");
const bcrypt = require("bcrypt");
const { registrationMiddleware } = require("../middlewares/registration.middleware");
const jwt = require("jsonwebtoken");
const { loginMiddleware } = require("../middlewares/login.middleware");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
require('dotenv').config();
const userRouter = express.Router();

userRouter.get("/",async(req,res)=>{
    // console.log(1);
    const {page,limit} = req.query;
    if(page && limit){
        let skipped = (+limit* +page) - +limit;
        // console.log(skipped)
        let users = await UserModel.find().skip(skipped).limit(limit);
        res.send({users:users});
    }else{
    let users = await UserModel.find();
    res.send({users:users,hi:1});
    }
})
// user registration thing are working here
userRouter.post("/register",registrationMiddleware,async (req,res)=>{
    try {
            const user = new UserModel(req.body);
            await user.save();
            // console.log(req.body);
        res.send({msg:`Welcome!, ${req.body.name} Your Registration is Successfully.`})
    } catch (error) {
        res.send({err:error.message})
    }
});

// login route 
userRouter.post("/login",loginMiddleware,async (req,res)=>{
    const {email} = req.body;
    const user = await UserModel.findOne({email})
    try {
        const token = jwt.sign({ userID: user._id, role:user.role }, process.env.jwt_secret_key, { expiresIn: "24h" });//{ expiresIn: 60*60*4 } for foour hour
        res.send({msg:`Welcome!, ${user.name} Your Login is Successfully.`,token:token, userId:user._id, role:user.role,name:user.name})
    } catch (error) {
        res.send({err:error.message})
    }
});


userRouter.patch("/update",UserAuthorizationMiddleware,async (req,res)=>{
    const {userID,name} = req.body;
    try {
        await UserModel.findByIdAndUpdate(userID,req.body);
        res.send({msg:`${name}'s Details are Updated Successfully.`})
    } catch (error) {
        res.send({err:error.message})
    }
});

userRouter.delete("/delete/:id",UserAuthorizationMiddleware,async (req,res)=>{
    const {id} = req.params;
    let user = await UserModel.findById(id);
    try {
        let DeleteUser = await UserModel.findByIdAndDelete(id);
        // console.log(DeleteUser);
        res.send({msg:`${user.name}'s Account is Deleted Successfully.`,Deleted_User:DeleteUser})
    } catch (error) {
        res.send({err:error.message})
    }
});


module.exports = {userRouter}
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    mobile:{type:Number,required:true, minLength:10,maxLength:10},
    role:{type:String,default:"Explorer",enum:["Explorer","Admin"]},
    todos:[{type:mongoose.Schema.Types.ObjectId, ref:"todo"}],
    cart:[{type:mongoose.Schema.Types.ObjectId, ref:"cart"}],
    wishlist:[{type:mongoose.Schema.Types.ObjectId, ref:"wishlist"}],
    myorder:[{type:mongoose.Schema.Types.ObjectId, ref:"myorder"}]
});

const UserModel = mongoose.model("user",UserSchema);

module.exports = {UserModel}
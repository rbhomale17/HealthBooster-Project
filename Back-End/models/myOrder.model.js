const mongoose = require("mongoose");

const MyOrderSchema = mongoose.Schema({
    name:{type:String,required:true},
    mobile:{type:Number,required:true, minLength:10,maxLength:10},
    address:{type:String,required:true},
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' } ],
    status:{type:String, default:"Delivered", enum:["In Transit", "Delivered","Out For Delivery"]},
    date:{type:String},
    cost:{type:Number},
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'user' } 
});

const MyOrderModel = mongoose.model("myorder", MyOrderSchema);

module.exports = { MyOrderModel }

// https://mock-api-server-fkxx.onrender.com/
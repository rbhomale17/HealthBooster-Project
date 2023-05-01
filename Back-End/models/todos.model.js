const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
    title:String,
    status:{type:Boolean,default:false},
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'user' } 
});

const TodoModel = mongoose.model("todo",TodoSchema);

module.exports = {TodoModel}

// https://mock-api-server-fkxx.onrender.com/
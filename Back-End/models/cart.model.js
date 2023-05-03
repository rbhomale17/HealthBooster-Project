const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    "title": { type: String},
    "brand": { type: String},
    "category": { type: String},
    "rating": { type: Number },
    "price": { type: Number},
    "img": { type: String},
    "quantity": { type: Number, min: 1, default: 1 },
    "userID":{ type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    "prodID":{ type: mongoose.Schema.Types.ObjectId, ref: 'product' } 
});

const CartModel = mongoose.model("cart",cartSchema);

module.exports = {CartModel}

// https://mock-api-server-fkxx.onrender.com/
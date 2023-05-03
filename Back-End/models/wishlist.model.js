const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
    "title": { type: String },
    "brand": { type: String },
    "category": { type: String },
    "rating": { type: Number },
    "price": { type: Number },
    "img": { type: String },
    "quantity": { type: Number, min: 1, default: 1 },
    "userID": { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

const WishlistModel = mongoose.model("wishlist", wishlistSchema);

module.exports = { WishlistModel }

// https://mock-api-server-fkxx.onrender.com/
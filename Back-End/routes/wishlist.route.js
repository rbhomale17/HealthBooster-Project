const { UserModel } = require("../models/users.model");
const express = require("express");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
const { WishlistModel } = require("../models/wishlist.model");
require('dotenv').config();
const wishlistRouter = express.Router();

// Show Wishlist items Routes
wishlistRouter.get("/", UserAuthorizationMiddleware, async (req, res) => {
    let wishlist = await UserModel.findById({ _id: req.body.userID }).populate("wishlist");
    // console.log(todos);
    res.send({ wishlist: wishlist.wishlist });
});

// Wishlist item adding Routes
wishlistRouter.post("/add", UserAuthorizationMiddleware, async (req, res) => {
    try {
        // console.log(req.body);
        await WishlistModel.insertMany([req.body]).then(async (product, err) => {
            if (err) return console.log("err", err);
            // console.log("todoID",todo, "userID",req.body.userID);
            let user = await UserModel.findById(req.body.userID);
            // console.log(product[0]._id);
            user.wishlist.push(product[0]._id);
            await UserModel.findByIdAndUpdate(req.body.userID, user);
        });
        res.send({ msg: "Product Added To Wishlist." })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Wishlist item Update Routes
wishlistRouter.patch("/update/:id", UserAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await WishlistModel.findByIdAndUpdate({ _id: id }, req.body);
        let product = await WishlistModel.findById(id);
        // console.log(product.quantity);
        let wishlistList = await UserModel.findById({ _id: req.body.userID }).populate("wishlist");
        res.send({ msg: "product Updated.", quantity: product.quantity, wishlist: wishlistList.wishlist })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Wishlist item Delete Route
wishlistRouter.delete("/delete/:id", UserAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        let product = await WishlistModel.findById(id);
        if (product) {
            await WishlistModel.findByIdAndDelete(id);
            let wishlist = await UserModel.findById({ _id: req.body.userID }).populate("wishlist");
            // console.log(todos);
            wishlist.wishlist = wishlist.wishlist.filter(async (el, i) => {
                if (el._id !== id) {
                    return true;
                }
            });
            wishlist = await UserModel.findByIdAndUpdate({ _id: req.body.userID }, wishlist).populate("wishlist");
            let wishlistList = await UserModel.findById({ _id: req.body.userID }).populate("wishlist");
            res.send({ msg: "Product Deleted From wishlist.", wishlist: wishlistList.wishlist })
        } else {
            res.send({ msg: "Product Not Found" })
        }
    } catch (error) {
        res.send({ err: error.message })
    }
});


module.exports = { wishlistRouter }
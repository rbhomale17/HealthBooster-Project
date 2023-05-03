const { UserModel } = require("../models/users.model");
const express = require("express");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
const { WishlistModel } = require("../models/wishlist.model");
const { AdminAuthorizationMiddleware } = require("../middlewares/AdminAuthorization.middleware");
const { MyOrderModel } = require("../models/myOrder.model");
const { CartModel } = require("../models/cart.model");
require('dotenv').config();
const myorderRouter = express.Router();

// Show Wishlist items Routes
myorderRouter.get("/", UserAuthorizationMiddleware, async (req, res) => {
    let myorder = await UserModel.findById({ _id: req.body.userID }).populate("myorder");
    // console.log(todos);
    let orders = await MyOrderModel.findById(myorder.myorder[0]._id).populate("orders");
    res.send({ myorder: myorder.myorder, orders: orders.orders });
});
// AdminAuthorizationMiddleware
myorderRouter.get("/allorders",  async (req, res) => {
    let myorders = await MyOrderModel.find();
    // console.log(myorders);
    res.send({ myorder: myorders.myorder });
})
// Wishlist item adding Routes
myorderRouter.post("/add", UserAuthorizationMiddleware, async (req, res) => {
    try {
        // console.log(req.body);
        let user = await UserModel.findById(req.body.userID);
        let body = { ...req.body, "name": user.name, "mobile": user.mobile }
        await MyOrderModel.insertMany([body]).then(async (order, err) => {
            if (err) return console.log("err", err);
            // console.log("todoID",todo, "userID",req.body.userID);
            let user = await UserModel.findById(req.body.userID);
            let orders = await MyOrderModel.findById(order[0]._id)
            // console.log(order[0].orders);
            let cart = await CartModel.find({ userID: req.body.userID });
            // console.log({cart:cart});
            cart.forEach((element) => {
                // console.log(element.prodID)
                orders.orders.push(element.prodID)
            });
            // console.log(orders);
            await MyOrderModel.findByIdAndUpdate(order[0]._id, orders)
            user.myorder.push(order[0]._id);
            // console.log("hii");
            await UserModel.findByIdAndUpdate(req.body.userID, user);
            cart = {};
            let ans = await CartModel.find({ userID: req.body.userID }).deleteMany()
            // console.log(ans);
        });
        res.send({ msg: "Product Added To Wishlist." })
    } catch (error) {
        res.send(error)
    }
});

// Wishlist item Update Routes
myorderRouter.patch("/update/:id", UserAuthorizationMiddleware, async (req, res) => {
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
myorderRouter.delete("/delete/:id", UserAuthorizationMiddleware, async (req, res) => {
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
            res.send({ msg: "Product Deleted From Cart.", wishlist: wishlistList.wishlist })
        } else {
            res.send({ msg: "Product Not Found" })
        }
    } catch (error) {
        res.send({ err: error.message })
    }
});


module.exports = { myorderRouter }
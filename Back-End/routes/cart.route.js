const { UserModel } = require("../models/users.model");
const express = require("express");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
const { CartModel } = require("../models/cart.model");
require('dotenv').config();
const cartRouter = express.Router();

// Show Cart items Routes
cartRouter.get("/", UserAuthorizationMiddleware, async (req, res) => {
    let cart = await UserModel.findById({ _id: req.body.userID }).populate("cart");
    res.send({ cart: cart.cart });
});

// Cart item adding Routes
cartRouter.post("/add", UserAuthorizationMiddleware, async (req, res) => {
    try {
        // console.log(req.body);
        await CartModel.insertMany([req.body]).then(async (product, err) => {
            if (err) return console.log("err", err);
            // console.log("todoID",todo, "userID",req.body.userID);
            let user = await UserModel.findById(req.body.userID);
            // console.log(product[0]._id);
            user.cart.push(product[0]._id);
            await UserModel.findByIdAndUpdate(req.body.userID, user);
        });
        res.send({ msg: "Product Added To Cart." })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Cart item Update Routes
cartRouter.patch("/update/:id",UserAuthorizationMiddleware, async (req, res) => {
    const {id} = req.params;
    try {
        await CartModel.findByIdAndUpdate({_id:id},req.body);
        let product = await CartModel.findById(id);
        console.log(product.quantity);
        res.send({msg:"product Updated.",quantity:product.quantity})
    } catch (error) {
        res.send({err:error.message})
    }
});

// Cart item Delete Route
cartRouter.delete("/delete/:id", UserAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        let product = await CartModel.findById(id);
        if(product){
        await CartModel.findByIdAndDelete(id);
        let cart = await UserModel.findById({ _id: req.body.userID }).populate("cart");
        // console.log(todos);
        cart.cart = cart.cart.filter(async (el, i) => {
            if (el._id !== id) {
                return true;
            }
        });
        await UserModel.findByIdAndUpdate({ _id: req.body.userID }, cart).populate("cart");
        cart = await UserModel.findById({ _id: req.body.userID }).populate("cart");
        
        res.send({ msg: `Product ${product.title} is Deleted From Cart.` })
    }else{
        res.send({msg:"Product Not Found"})
    }
    } catch (error) {
        res.send({ err: error.message })
    }
});


module.exports = { cartRouter }
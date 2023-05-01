const { UserModel } = require("../models/users.model");
const express = require("express");
const jwt = require("jsonwebtoken");
const { UserAuthorizationMiddleware } = require("../middlewares/UserAuthorization.middleware");
const { TodoModel } = require("../models/todos.model");
require('dotenv').config();
const todosRouter = express.Router();

todosRouter.get("/", UserAuthorizationMiddleware, async (req, res) => {
    let todos = await UserModel.findById({ _id: req.body.userID }).populate("todos");
    // console.log(todos);
    res.send({ todos: todos.todos });
});

// user registration thing are working here
todosRouter.post("/add", UserAuthorizationMiddleware, async (req, res) => {
    try {
        // console.log(req.body);
        await TodoModel.insertMany([req.body]).then(async (todo, err) => {
            if (err) return console.log("err", err);
            // console.log("todoID",todo, "userID",req.body.userID);
            let user = await UserModel.findById(req.body.userID);
            // console.log(todo[0]._id);
            user.todos.push(todo[0]._id);
            await UserModel.findByIdAndUpdate(req.body.userID, user);
        });
        res.send({ msg: "Todo Added" })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Todos Update Routes
todosRouter.patch("/update/:id",UserAuthorizationMiddleware, async (req, res) => {
    const {id} = req.params;
    await TodoModel.findByIdAndUpdate({_id:id},req.body);
    res.send({msg:"Todo Updated."})
});

// todos Delete Route
todosRouter.delete("/delete/:id", UserAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await TodoModel.findByIdAndDelete(id);
        let todos = await UserModel.findById({ _id: req.body.userID }).populate("todos");
        // console.log(todos);
        todos.todos = todos.todos.filter(async (el, i) => {
            if (el._id !== id) {
                return true;
            }
        });
        todos = await UserModel.findByIdAndUpdate({ _id: req.body.userID }, todos).populate("todos");
        res.send({ msg: "Todo Deleted." })
    } catch (error) {
        res.send({ err: error.message })
    }
});


module.exports = { todosRouter }
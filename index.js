const express = require("express");
require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require("cors");
const { Connection } = require("./Back-End/config/db");
app.use(cors());
const { userRouter } = require("./Back-End/routes/users.route");
const { todosRouter } = require("./Back-End/routes/todos.route");
const { productRouter } = require("./Back-End/routes/products.route");


app.get("/",(req,res)=>{
  let obj = {
    owner:"Rushi Bhoamle",
    project:"NXM101-Construct Week Project",
    project_code:"moral-riddle-2098",
    student_code:"fw25_348",
    course:"Full Stack Web Developer",
    tech_stacks:"Node.js, Express JS, MongoDB, Mongoose, npm packages, JavaScript, HTML, CSS"
  }
    res.send({Server_Details:obj})
});



app.use('/users',userRouter);
app.use("/todos",todosRouter)
app.use("/products",productRouter)

app.listen(Number(process.env.port),async()=>{
    try {
      await Connection;
      console.log("Connected To DB");
    } catch (error) {
     console.log(error);
     console.log("Failed To Connect DB");
    };
    console.log(`server is started at port ${Number(process.env.port)}`);
});



// {
//   "name": "Neurobion Forte Tablet 30'S",
//   "price": "₹37.72",
//   "img": "https://cdn01.pharmeasy.in/dam/products_otc/I09432/neurobion-forte-tablet-30s-1-1669655036.jpg"
//  }
const express = require("express");
const { AdminAuthorizationMiddleware } = require("../middlewares/AdminAuthorization.middleware");
const { ProductModel } = require("../models/product.model");
const { AfterAddCartQuantity } = require("../middlewares/UserAuthorization.middleware");
require('dotenv').config();
const productRouter = express.Router();

// new product registration thing are working here
productRouter.post("/add", AdminAuthorizationMiddleware, async (req, res) => {
    try {
        // console.log(req.body.product);
        let prod = await ProductModel.insertMany([req.body]);
        console.log(prod);
        res.send({ msg: `New Product: ${req.body.title} is Added.` })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Product Update Routes Admin
productRouter.patch("/update/:id", AdminAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    await ProductModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: `Product: ${req.body.title} is updated.` })
});

// quantity update After add to cart
productRouter.patch("/updateAfterAddCart/:id",AfterAddCartQuantity, async (req, res) => {
    const { id } = req.params;
    await ProductModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: `Product: ${req.body.title} is updated.` })
});

// Product Delete Route for admin
productRouter.delete("/delete/:id", AdminAuthorizationMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        let product = await ProductModel.findById(id);
        // console.log(product);
        await ProductModel.findByIdAndDelete(id);
        res.send({ msg: `Product: ${product.title} is deleted.` })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Product Get request handeler
productRouter.get("/", async (req, res) => {
    const { category, brand, rating, price, quantity, sortrating, sortprice, page, limit } = req.query;
    // console.log(req.query);
    if (page && limit) {
        let p = +page;
        let l = +limit;
        let skipped = (p * l - l);
        if (!category && !brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find().skip().skip(skipped).limit(l);//all
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ category: category }).skip(skipped).limit(l);//category only
            res.send({ products: products });
        }
        else if (category && !brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }] }).skip(skipped).limit(l);//category and rating
            res.send({ products: products });
        }
        else if (category && !brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }] }).skip(skipped).limit(l);//category and price
            res.send({ products: products });
        }
        else if (category && !brand && !rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);//category and price & sort Price
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !sortprice && !sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } }).skip(skipped).limit(l);//rating
            res.send({ products: products });
        }
        else if (category && !brand && rating && !price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);//category and rating & sort rating
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }, { rating: { $gte: rating } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }, { rating: { $gte: rating } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }, { rating: { $gte: rating } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ brand: brand }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { brand: brand }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { brand: brand }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { brand: brand }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { rating: { $gte: rating } }, { brand: brand }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { rating: { $gte: rating } }, { brand: brand }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { brand: brand }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && !sortprice && !sortrating) {
            console.log("Hii");
            let products = await ProductModel.find({ rating: { $gte: rating } }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { brand: brand }, { price: { $lte: price } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find().sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find().sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ category: category }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ category: category }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ brand: brand }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ brand: brand }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ price: sortprice }).skip(skipped).limit(l);
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ rating: sortrating }).skip(skipped).limit(l);
            res.send({ products: products });
        }
    } else {
        if (!category && !brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find();//all
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ category: category });//category only
            res.send({ products: products });
        }
        else if (category && !brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }] });//category and rating
            res.send({ products: products });
        }
        else if (category && !brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }] });//category and price
            res.send({ products: products });
        }
        else if (category && !brand && !rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }] }).sort({ price: sortprice });//category and price & sort Price
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !sortprice && !sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } });//rating
            res.send({ products: products });
        }
        else if (category && !brand && rating && !price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }] }).sort({ rating: sortrating });//category and rating & sort rating
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { price: { $lte: price } }, { rating: { $gte: rating } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }, { rating: { $gte: rating } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }, { rating: { $gte: rating } }] });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] });
            res.send({ products: products });
        }
        else if (category && brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }] });
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ brand: brand });
            res.send({ products: products });
        }
        else if (!category && brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { brand: brand }] });
            res.send({ products: products });
        }
        else if (!category && brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { brand: brand }] });
            res.send({ products: products });
        }
        else if (!category && brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { brand: brand }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { rating: { $gte: rating } }, { brand: brand }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ price: { $lte: price } }, { rating: { $gte: rating } }, { brand: brand }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (!category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { brand: brand }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && !sortprice && !sortrating) {
            console.log("Hii");
            let products = await ProductModel.find({ rating: { $gte: rating } });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && !brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { price: { $lte: price } }] });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ rating: { $gte: rating } }, { category: category }, { brand: brand }, { price: { $lte: price } }] });
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } });
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find().sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find().sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ category: category }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && !brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ category: category }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ brand: brand }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && brand && !rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ brand: brand }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (!category && !brand && rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ rating: { $gte: rating } }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (!category && !brand && !rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ price: { $lte: price } }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }, { price: { $lte: price } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] });
            res.send({ products: products });
        }
        else if (category && brand && !rating && price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { price: { $lte: price } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] });
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && sortprice && !sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ price: sortprice });
            res.send({ products: products });
        }
        else if (category && brand && rating && !price && !quantity && !sortprice && sortrating) {
            let products = await ProductModel.find({ $and: [{ category: category }, { brand: brand }, { rating: { $gte: rating } }] }).sort({ rating: sortrating });
            res.send({ products: products });
        }
        else {
            res.send({
                products: [{
                    "title": "MuscleBlaze Super Gainer XXL Powder, 5 kg (11 lb), Chocolate",
                    "brand": "Muscleblaze",
                    "rating": 4.4,
                    "category": "Biotin",
                    "price": 3599,
                    "img": "https://img4.hkrtcdn.com/12151/prd_1215013-MuscleBlaze-Super-Gainer-XXL-OP-11-lb-Chocolate_o.jpg",
                    "quantity": 120
                }]
            })
        }
    }
});

module.exports = { productRouter }
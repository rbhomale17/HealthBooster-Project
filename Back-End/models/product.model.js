const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  "title": { type: String, required: true},
  "brand": { type: String, required: true},
  "category": { type: String, required: true},
  "rating": { type: Number, required: true, default: 2.8, min: 0.1, max: 5.1 },
  "price": { type: Number, required: true, default: 389 },
  "img": { type: String, default: "https://img10.hkrtcdn.com/13665/prd_1366409-MuscleBlaze-Ayurveda-for-Performance-Ashwagandha-500mg-60-tablets_o.jpg" },
  "quantity": { type: Number, required: true, min: 0, default: 10 }
}, { versionKey: false });

const ProductModel = mongoose.model("product", ProductSchema);

module.exports = { ProductModel }


// ["BPI","Beurer","Dr.Morepen","HealthKart","MB Fuel One","MuscleBlaze" , "Onetouch"] // BRAND
// ["Biotin","Fitness","Mass Gainer","Vitals","Whey Proteins","instrument"] CATEGORY
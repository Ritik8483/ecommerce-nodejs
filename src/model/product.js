const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductTableSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "name is required"],
    },
    description: { type: String, required: [true, "description is required"] },
    price: { type: Number, required: [true, "price is required"] },
  },
  { timestamps: true }
);

exports.ProductTable = mongoose.model(
  "Product", //give this singular name , from this the collection stores in  the mdb
  ProductTableSchema
);

const ProductController = require("../controller/product");
const express = require("express");
const usersRouter = express.Router();
const { checkSchema } = require("express-validator");
const {
  addProductRules,
  getAllProductRules,
  getSingleProductRules,
  updateProductRules,
  deleteProductRules,
} = require("../validations/validation");

const { addProducts, getAllProducts, getSingleProduct, updateProducts, deleteProducts } =
  ProductController;

exports.productTableRouters = usersRouter
  .post("/", checkSchema(addProductRules), addProducts)
  .get("/", checkSchema(getAllProductRules), getAllProducts)
  .get("/:id", checkSchema(getSingleProductRules), getSingleProduct)
  .patch("/:id", checkSchema(updateProductRules), updateProducts)
  .delete("/:id", checkSchema(deleteProductRules), deleteProducts);

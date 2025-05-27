const ProductTableModel = require("../model/product");
const ProductTable = ProductTableModel.ProductTable;
const { responder, errorResponder } = require("../responder/responder");
const { validationResult } = require("express-validator");

exports.addProducts = async (req, res) => {
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const resp = await new ProductTable(req.body).save();
      if (resp.id) {
        responder(res, 3002, {});
      }
    } catch (error) {
      if (error.code === 11000) {
        errorResponder(res, {
          error: `Duplicate key error. ${error.keyValue.name} already exists.`,
        });
      } else {
        errorResponder(res, error);
      }
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

exports.getAllProducts = async (req, res) => {
  // req.query contains all query parameters as strings
  //typeof req.query.limit // "string"
  const limit = +req.query.limit || 100;
  const pageNumber = +req.query.page || 1;
  const searchRegEx = new RegExp(req.query.search, "i");
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const totalProducts = await ProductTable.aggregate([
        {
          $match: {
            $or: [{ name: searchRegEx }, { price: searchRegEx }],
          },
        },
        {
          $count: "productsCount",
        },
      ]);
      const resp = await ProductTable.aggregate([
        { $sort: { _id: -1 } },
        {
          $match: {
            $or: [{ name: searchRegEx }, { price: searchRegEx }],
          },
        },
        { $skip: limit * (pageNumber - 1) },
        { $limit: limit },
      ]);
      if (!totalProducts?.length) {
        responder(res, 3003, resp, 0);
      }
      if (Array.isArray(resp) && totalProducts?.length) {
        responder(res, 3003, resp, totalProducts[0].productsCount || 0);
      }
    } catch (error) {
      errorResponder(res, error);
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const resp = await ProductTable.findById(id).select(
        "-__v -createdAt -updatedAt"
      );
      if (Object.keys(resp).length) {
        responder(res, 3004, resp);
      }
    } catch (error) {
      errorResponder(res, error);
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

exports.updateProducts = async (req, res) => {
  const { id } = req.params;
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const resp = await ProductTable.findOneAndUpdate({ _id: id }, req.body);
      if (Object.keys(resp).length) {
        responder(res, 3005, {});
      }
    } catch (error) {
      if (error.code === 11000) {
        errorResponder(res, {
          error: `Duplicate key error. ${error.keyValue.name} already exists.`,
        });
      } else {
        errorResponder(res, error);
      }
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

exports.deleteProducts = async (req, res) => {
  const { id } = req.params;
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const resp = await ProductTable.findOneAndDelete({ _id: id });
      if (!resp) {
        res.status(400).json({ error: "Product already deleted" });
      } else if (Object.keys(resp).length) {
        responder(res, 3006, {});
      }
    } catch (error) {
      errorResponder(res, error);
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

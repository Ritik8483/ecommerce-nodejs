const addProductRules = {
  name: {
    notEmpty: true,
    errorMessage: "name is required",
  },
  description: {
    notEmpty: true,
    errorMessage: "description is required",
  },
  price: {
    notEmpty: true,
    errorMessage: "price is required",
  },
};

const getAllProductRules = {
  limit: {
    isInt: {
      options: {
        min: 1,
      },
    },
    optional: true,
  },
  page: {
    isInt: {
      options: {
        min: 1,
      },
    },
    optional: true,
    errorMessage: "page must be a number",
  },
  search: {
    isString: true,
    errorMessage: "search must be a string",
    optional: true,
  },
};

const getSingleProductRules = {
  id: {
    isMongoId: true,
    errorMessage: "Invalid Mongodb Id",
  },
};

const updateProductRules = {
  id: {
    isMongoId: true,
    errorMessage: "Invalid Mongodb Id",
  },
  name: {
    notEmpty: true,
    errorMessage: "name is required",
  },
  description: {
    notEmpty: true,
    errorMessage: "description is required",
  },
  price: {
    notEmpty: true,
    errorMessage: "price is required",
  },
};

const deleteProductRules = {
  id: {
    isMongoId: true,
    errorMessage: "Invalid Mongodb Id",
  },
};

module.exports = {
  addProductRules,
  getAllProductRules,
  getSingleProductRules,
  updateProductRules,
  deleteProductRules,
}; 

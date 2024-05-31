const userModel = require("../model/admin-auth");
const jwt = require("jsonwebtoken");
const AdminAuth = userModel.AdminAuth;
const bcrypt = require("bcrypt");
const { responder } = require("../responder/responder");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  try {
    const token = jwt.sign({ email: req.body.email }, "shhhhh"); //generating a token using email
    const hash = bcrypt.hashSync(req.body.password, 10); //hashing the password saltRounds = 10
    const user = new AdminAuth(req.body);
    user.token = token;
    user.password = hash;
    const resp = await user.save();
    responder(res, 3000, {});
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const userResp = await AdminAuth.findOne({ email: req.body.email });
    const isAuth = bcrypt.compareSync(req.body.password, userResp?.password); //userResp?.password contains the hash
    if (isAuth) {
      const token = jwt.sign({ email: req.body.email }, "shhhhh"); //generating a new token using email
      userResp.token = token;
      const finalResponse = await userResp.save();
      responder(res, 3001, {
        name: finalResponse?.name,
        email: finalResponse?.email,
        token: token,
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

exports.getAllAuthUsers = async (req, res) => {
  const limit = +req.query.limit || 100;
  const pageNumber = +req.query.page || 1;
  const searchRegEx = new RegExp(req.query.search, "i");
  const validationError = validationResult(req);
  if (validationError.isEmpty()) {
    try {
      const totalUsers = await AdminAuth.aggregate([
        {
          $match: {
            $or: [{ name: searchRegEx }, { price: searchRegEx }],
          },
        },
        {
          $count: "usersCount",
        },
      ]);
      const resp = await AdminAuth.aggregate([
        { $sort: { _id: -1 } },
        {
          $match: {
            $or: [{ name: searchRegEx }, { price: searchRegEx }],
          },
        },
        { $skip: limit * (pageNumber - 1) },
        { $limit: limit },
        {
          $project: {
            password: 0,
            token: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);
      if (!totalUsers?.length) {
        responder(res, 3007, resp, 0);
      }
      if (Array.isArray(resp) && totalUsers?.length) {
        responder(res, 3007, resp, totalUsers[0].usersCount || 0);
      }
    } catch (error) {
      errorResponder(res, error);
    }
  } else {
    errorResponder(res, validationError.array());
  }
};

const userModel = require("../model/admin-auth");
const jwt = require("jsonwebtoken");
const AdminAuth = userModel.AdminAuth;
const bcrypt = require("bcrypt");
const { responder } = require("../responder/responder");

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
      console.log("finalResponse", finalResponse);
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

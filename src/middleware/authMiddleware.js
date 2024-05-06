const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.get("Authorization");
//   const postmanToken = token?.split(" ")[1]; 
  try {
    const decoded = jwt.verify(token, "shhhhh");
    if (decoded.email) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.sendStatus(401);
    console.log("error", error);
  }
};

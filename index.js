const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const adminAuthRouters = require("./src/routes/admin-auth");
const productRouters = require("./src/routes/product");
const { authMiddleware } = require("./src/middleware/authMiddleware");

const app = express();
app.use(cors()); //cors policy for frontend
app.use(express.json());

console.log("env",env?.parsed?.DB_MONGO_DB);

//routes
const { adminAuthTableRouters } = adminAuthRouters;
const { productTableRouters } = productRouters;

//API's
app.use("/auth", adminAuthTableRouters);
app.use("/product", productTableRouters);
// app.use("/product", authMiddleware, productTableRouters);

//Moongoose connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_MONGO_DB);
  console.log("moongoose connected");
}

//Server Connection
app.listen(process.env.PORT, () => {
  console.log("server started");
});



//MDB compass 
//1. copy connection string after clicking on 3 dots
//
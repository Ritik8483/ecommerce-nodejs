// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const adminAuthRouters = require("./src/routes/admin-auth");
// const productRouters = require("./src/routes/product");
// const { authMiddleware } = require("./src/middleware/authMiddleware");

// const app = express();
// app.use(cors()); //cors policy for frontend
// app.use(express.json());

// //routes
// const { adminAuthTableRouters } = adminAuthRouters;
// const { productTableRouters } = productRouters;

// //API's
// app.use("/auth", adminAuthTableRouters);
// app.use("/product", authMiddleware, productTableRouters);

// //Moongoose connection
// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(process.env.DB_MONGO_DB);
//   console.log("moongoose connected");
// }

// //Server Connection
// app.listen(process.env.PORT, () => {
//   console.log("server started");
// });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const adminAuthRouters = require("./src/routes/admin-auth");
const productRouters = require("./src/routes/product");
const { authMiddleware } = require("./src/middleware/authMiddleware");

const app = express();
app.use(cors()); //cors policy for frontend
app.use(express.json());

//socket connection
const appServerSocket = require("http").createServer(app);
const io = require("socket.io")(appServerSocket, {
  cors: { origin: "http://localhost:5173" }, //both must contain opposite origins (remove / from end)
});

io.on("connection", (socket) => {
  console.log("Socket Connection id : ", socket.id);
  socket.on("message", (data) => {
    console.log("data", data);
    io.to(data.socketId).emit("receive-messages", data); //room can be an array
  });
  // //7.As the useEffect is unmounted it will be disconnected from frontend
  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED", socket.id);
  });
});

//io connection for learning
// io.on("connection", (socket) => {
//   console.log("Socket Connected : ", socket.id); //1.whenever something client side socket is connected it's logged
  // socket.emit("welcome", "Hi Hello world");//2.sending message emitted to client by server
  // socket.broadcast.emit("welcome", `Welcome to the server ${socket.id}`); //3.Message will not go to the socket like first localhost and will be visible
  // on 2nd localhost; we will brodasted socket id of first localhost to 2nd localhost etc
  // Last connected localhost will be the broadcast socket and the data is receved on 1st localhost
  // socket.on("messages", (data) => {
  // //4. recieving message from frontend
  //   console.log("data", data);
  // });
  // socket.on("messages", (data) => {
  //   //5. recieving message and sending it back to frontend
  //   console.log("data", data);
  //   io.emit("receive-message", data);
  // });
  // //6. One on One Chat
  // socket.on("messages", (data) => {
  //   console.log("data", data);
  //   io.to(data.roomId).emit("receive-message", data); //room can be an array
  // });
  // //7.As the useEffect is unmounted it will be disconnected from frontend
  // socket.on("disconnect", () => {
  //   console.log("USER DISCONNECTED", socket.id);
  // });
// });

//routes
const { adminAuthTableRouters } = adminAuthRouters;
const { productTableRouters } = productRouters;

//API's
app.use("/auth", adminAuthTableRouters);
app.use("/product", authMiddleware, productTableRouters);

//Moongoose connection
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DB_MONGO_DB);
  console.log("moongoose connected");
}

//Server Connection
appServerSocket.listen(process.env.PORT, () => {
  //instances of both http and socket must be same
  console.log("server started");
});

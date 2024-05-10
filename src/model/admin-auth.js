const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminAuthSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: { type: String, required: [true, "Password is required"] },
    token: String,
  },
  { timestamps: true }
);

exports.AdminAuth = mongoose.model("auth", adminAuthSchema);

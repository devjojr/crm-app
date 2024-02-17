const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      // checking if the email is valid
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    sale: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);

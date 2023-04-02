import mongoose from "mongoose";
import { Schema, Model } from "mongoose";
//Defining User Schema

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exist."],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    profileImage: {
      type: String,
      default:"https://as2.ftcdn.net/jpg/03/32/59/65/220_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    },
    contactInfo: {
      phoneNumber: {
        type: String,
        unique: [true, "Phone Number already exist."],
      },
      address: {
        permanentAddress: String,
        temporaryAddress: String,
      },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

export default UserModel;

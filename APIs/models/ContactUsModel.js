import mongoose, { Schema } from "mongoose";

const contact = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const ContactUs = mongoose.model("contact_us", contact);

export default ContactUs;

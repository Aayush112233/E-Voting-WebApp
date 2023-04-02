import multer from "multer";
import cloudinary from "cloudinary";
import ImageModel from "../models/image.model.js";
import path from "path";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer middleware to upload to Cloudinary
const upload = multer({
  storage: multer.diskStorage({}),
}).single("image");

// Middleware to handle image upload
const uploadImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Failed to upload image." });
    } else {
      if (!req.file && !req.body.imageData) {
        return res.status(400).json({ message: "No image file or data provided." });
      } else {
        try {
          let result;
          if (req.file) {
            // If a file is provided, upload the file
            result = await cloudinary.uploader.upload(req.file.path);
          } else {
            // If base64 image data is provided, upload the data
            result = await cloudinary.uploader.upload(req.body.imageData, {
              resource_type: "image",
            });
          }
          if (result) {
            req.imageUrl = result.secure_url;
            next();
          }
        } catch (e) {
          next({ status: 400, message: e });
        }
      }
    }
  });
};

export default uploadImage;
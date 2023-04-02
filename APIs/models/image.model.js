import mongoose, { Schema } from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const ImageModel = mongoose.model('Image', imageSchema);

export default ImageModel;
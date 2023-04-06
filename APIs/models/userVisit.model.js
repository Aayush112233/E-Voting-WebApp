import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  counter: {
    type: Number,
    default: 0
  }
});

const PageView = mongoose.model('PageView', pageViewSchema);

export default PageView;
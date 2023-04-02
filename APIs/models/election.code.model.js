import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

const electionCode = new Schema({
  electionId: {
    type: Schema.Types.ObjectId,
    ref: "elections",
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
});

const ElectionCodeModel = mongoose.model("election_code", electionCode);

export default ElectionCodeModel;

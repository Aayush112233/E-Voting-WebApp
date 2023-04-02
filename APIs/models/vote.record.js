import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

const recordSchema = new Schema({
  voterId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  electionId: {
    type: Schema.Types.ObjectId,
    ref: "elections",
    required: true,
  },
  candidateId:{
    type:Schema.Types.ObjectId,
    ref:"elections.candidate"
  }
});

const VoteRecord = mongoose.model("vote_record", recordSchema);

export default VoteRecord;
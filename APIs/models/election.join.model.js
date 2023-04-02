import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

const ElectionJoin = new Schema({
  electionId: {
    type: Schema.Types.ObjectId,
    ref: "elections",
    required: true,
  },
  voterId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  position: {
    type: Array,
    of: new mongoose.Schema({
      positionName: {
        type: String,
        required: true,
      },
    }),
  },
  candidate: {
    type: Array,
    of: new mongoose.Schema({
      candidateName: {
        type: String,
        required: true,
      },
      candidatePosition: {
        type: String,
        required: true,
      },
      candidateImage: {
        type: String,
        required: true,
      },
    }),
  },
  votingStatus: {
    type: Boolean,
    require: true,
    default: false,
  },
});

const ElectionJoinModel = mongoose.model("Election_Join", ElectionJoin);

export default ElectionJoinModel;

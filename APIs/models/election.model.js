import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

function uniqueCandidate(val) {
  const emailSet = new Set();
  const phoneSet = new Set();

  for (let i = 0; i < val.length; i++) {
    const candidate = val[i];
    if (emailSet.has(candidate.candidateEmail)) {
      throw new Error("Duplicate email found in candidates array.");
    }
    if (phoneSet.has(candidate.candidatePhone)) {
      throw new Error("Duplicate phone number found in candidates array.");
    }
    emailSet.add(candidate.candidateEmail);
    phoneSet.add(candidate.candidatePhone);
  }
}

const electionSchema = new Schema(
  {
    electionName: {
      type: String,
      required: true,
    },
    electionStartDate: {
      type: String,
      required: true,
    },
    electionEndDate: {
      type: String,
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
    },
    position: {
      type: Array,
      of: new mongoose.Schema({
        positionName: {
          type: String,
          required: true,
        },
        positionDescription: {
          type: String,
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
        candidateEmail: {
          type: String,
          required: true,
        },
        candidatePhone: {
          type: String,
          required: true,
        },
        candidateDescription: {
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
      validate: [uniqueCandidate, "Duplicate email or phone found "],
    },
    isVoter: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);
const ElectionModel = mongoose.model("election", electionSchema);

export default ElectionModel;

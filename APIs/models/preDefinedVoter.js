import mongoose, { Schema } from "mongoose";

const defineVoter = new mongoose.Schema({
  electionId: {
    type: String,
    required: true,
  },
  voters: {
    type: Array,
    of: new mongoose.Schema({
      voterId: {
        type: String,
        required: true,
      },
      voterName: {
        type: String,
      },
      voterEmail: {
        type: String,
      }      
    }),
  },
});

const PreDefinedVoter = mongoose.model("predefined_voters", defineVoter);

export default PreDefinedVoter;

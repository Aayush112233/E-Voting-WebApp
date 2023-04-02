import ElectionController from "../controllers/election.controller.js";
import express from "express";
import { ElectionCreater } from "../middlewares/election.middleware.js";
import checkAuth from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", ElectionCreater, ElectionController.CreateElection);
router.get("/getElectionByCode", ElectionController.GetElectionByCode);
router.post(
  "/joinElection/:code",
  ElectionCreater,
  ElectionController.JoinElection
);

router.get("/getElectionByUser/:userId", ElectionController.GetElectionById);
router.get("/getElectionByJoin/:joinId", ElectionController.GetElectionByJoins);
router.get(
  "/getCandidateByElection",
  ElectionController.getCandidateDetailsByElection
);
router.get(
  "/getVoteCountByElection/:electionId",
  ElectionController.getVoteCountByElection
);
router.get(
  "/getElectionByPreVoters/:id",
  ElectionController.getElectionByVoters
);
router.post("/getVoterByIdandEmail", ElectionController.getVoterByEmailAndCode);
router.get(
  "/getAllElectionVoteCount",
  ElectionController.getAllVoteCountByElection
);
router.get("/getElectionByCreater", checkAuth, ElectionController.getElectionByCreater);
router.post(
  "/userVote/:joinId",
  ElectionController.UserVote,
  ElectionController.CastVote,
  ElectionController.ChangeVoteStatus
);

export default router;
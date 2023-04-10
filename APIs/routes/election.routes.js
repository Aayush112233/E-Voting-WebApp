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
router.get(
  "/getTotalElectionByUser",
  checkAuth,
  ElectionController.GetElectionCountUser
);
router.get(
  "/getTotalVotesByUser",
  checkAuth,
  ElectionController.GetVoteCountUser
);
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

router.get("/getElectionById/:id", ElectionController.getElectionByElectionID);
router.post("/getVoterByIdandEmail", ElectionController.getVoterByEmailAndCode);
router.get(
  "/getAllElectionVoteCount",
  ElectionController.getAllVoteCountByElection
);
router.get(
  "/getAllElectionVoteCountByCreater",
  checkAuth,
  ElectionController.getAllElectionCountByCreater
);
router.get(
  "/getElectionByCreater",
  checkAuth,
  ElectionController.getElectionByCreater
);
router.get("/getTotalNoOfElection", ElectionController.getTotalNoofElections);
router.get("/getVotersByElection/:id", ElectionController.getVotersByElection);
router.get("/findAllElections", checkAuth, ElectionController.getAllElections);
router.get(
  "/getTotalNoOfVotes",
  checkAuth,
  ElectionController.getTotalNoofVotes
);
router.put(
  "/updateElectionDetails/:id",
  ElectionController.UpdateElectionDetails
);
router.put(
  "/updatePositionDetails/:id",
  ElectionController.UpdatePostionDetails
);
router.put(
  "/updateCandidateDetails/:id",
  ElectionController.UpdateCandidateDetails
);
router.put("/updateVoters/:id", ElectionController.UpdateVotersForElection);
router.get(
  "/getNearestElection",
  checkAuth,
  ElectionController.getNearestElectionAlert
);
router.get(
  "/getElectionParticipateCount",
  checkAuth,
  ElectionController.getElectionParticipatedCount
);
router.get(
  "/getElectionMissed",
  checkAuth,
  ElectionController.getElectionMissed
);
router.get(
  "/getlastElectionDetailsForUser",
  checkAuth,
  ElectionController.getLastCompletedElectionDetails
);
router.post(
  "/userVote/:joinId",
  ElectionController.UserVote,
  ElectionController.CastVote,
  ElectionController.ChangeVoteStatus
);

export default router;

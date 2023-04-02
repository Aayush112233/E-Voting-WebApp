import ElectionModel from "../models/election.model.js";
import ElectionCodeModel from "../models/election.code.model.js";
import GenerateRandomCode from "../config/GenerateCode.js";
import ElectionJoinModel from "../models/election.join.model.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import VoteRecord from "../models/vote.record.js";
import ejs from "ejs";

import PreDefinedVoter from "../models/preDefinedVoter.js";
import transporter from "../config/emailConfig.js";
class ElectionController {
  static CreateElection = async (req, res, next) => {
    const {
      electionName,
      electionStartDate,
      electionEndDate,
      maxVotes,
      organizationName,
      position,
      candidate,
      voters,
    } = req.body;
    if (
      electionName &&
      electionStartDate &&
      electionEndDate &&
      organizationName &&
      position.length > 0 &&
      candidate.length > 0
    ) {
      const startDate = new Date(electionStartDate);
      const endDate = new Date(electionEndDate);
      if (startDate >= endDate) {
        return next({ status: 400, message: "The date range is invalid" });
      }

      if (voters?.length > 0) {
        req.body.isVoter = true;
      }

      const election = new ElectionModel(req.body);
      const voterDefine = new PreDefinedVoter({
        electionId: election._id,
        voters: voters,
      });

      const eletionCode = new ElectionCodeModel({
        electionId: election._id,
        code: GenerateRandomCode(),
      });

      election.save(async function (err, doc) {
        if (err) {
          next({ status: 400, message: err });
        } else {
          const email = req.user.email;

          if (req.body.isVoter) {
            voterDefine.save();
          }

          const html = await ejs.renderFile("./Pages/ElectionCode.html", {
            code: eletionCode.code,
            userName: req.user.firstName + " " + req.user.lastName,
            electionName: electionName,
          });
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Election Code - Evoting",
            html: html,
          });
          eletionCode.save();
          res.status(200).json({
            result: req.body,
            message: "Election Created Sucessfully",
          });
        }
      });
    } else {
      next({ status: 400, message: "All Fields are required" });
    }
  };

  static GetElectionByCode = async (req, res, next) => {
    const { code } = req.body;
    if (code) {
      if (code.length !== 7) {
        return next({
          status: 400,
          message: "The elction code needs to be of 7 digits. Please Check",
        });
      }
      const electionCode = parseInt(code);
      const ElectionDetails = await ElectionCodeModel.aggregate([
        {
          $lookup: {
            from: "elections",
            localField: "electionId",
            foreignField: "_id",
            as: "election_info",
          },
        },
        {
          $match: {
            code: electionCode,
          },
        },
      ]);

      if (ElectionDetails) {
        res.status(200).json({
          ElectionDetails,
        });
      }
    } else {
      return next({ status: 400, message: "Code is empty." });
    }
  };

  static JoinElection = async (req, res, next) => {
    const { code } = req.params;

    if (code) {
      if (code.length !== 7) {
        return next({
          status: 400,
          message: "The elction code needs to be of 7 digits. Please Check",
        });
      }
      const Election = await ElectionCodeModel.findOne({ code: code });
      if (!Election) {
        return next({
          status: 400,
          message: "An election for this code doesn't exist.",
        });
      }

      const SameElection = await ElectionJoinModel.findOne({
        electionId: Election.electionId,
        voterId: req.body.createdBy,
      });
      if (SameElection) {
        return next({
          status: 400,
          message: "You are already in the election.",
        });
      }

      const ElectionDef = await ElectionModel.findOne({
        _id: Election.electionId,
      });

      req.body.electionId = Election.electionId;
      req.body.position = ElectionDef.position;
      req.body.candidate = ElectionDef.candidate;
      req.body.voterId = req.body.createdBy;
      delete req.body.createdBy;
      const ElectionJoin = new ElectionJoinModel(req.body);
      ElectionJoin.save(function (err, doc) {
        if (err) {
          next({ status: 400, message: err });
        } else {
          res.status(200).json({
            result: req.body,
            message: `You are now a participant this election. `,
          });
        }
      });
    } else {
      return next({ status: 400, message: "Code is empty." });
    }
  };

  static GetElectionById = async (req, res, next) => {
    const { userId } = req.params;

    const isIdValid = ObjectId.isValid(userId);
    if (!isIdValid) {
      next({ status: 400, message: "Invalid id" });
      return;
    }

    const voterId = mongoose.Types.ObjectId(userId);

    await ElectionJoinModel.aggregate([
      {
        $lookup: {
          from: "elections",
          localField: "electionId",
          foreignField: "_id",
          as: "election_info",
        },
      },
      {
        $match: {
          voterId: voterId,
        },
      },
    ]).exec(function (err, electionDetails) {
      if (err) throw next({ status: 500, message: "Failed to retrive data" });
      res.status(200).json({
        electionDetails,
      });
    });
  };

  static GetElectionByJoins = async (req, res, next) => {
    const { joinId } = req.params;
    const isIdValid = ObjectId.isValid(joinId);
    if (!isIdValid) {
      next({ status: 400, message: "Invalid id" });
      return;
    }
    const id = mongoose.Types.ObjectId(joinId);
    await ElectionJoinModel.aggregate([
      {
        $lookup: {
          from: "elections",
          localField: "electionId",
          foreignField: "_id",
          as: "election_info",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "voterId",
          foreignField: "_id",
          as: "voter_info",
        },
      },
      {
        $match: {
          _id: id,
        },
      },
      {
        $project: {
          "voter_info.password": 0,
        },
      },
    ]).exec(function (err, JoinDetail) {
      if (err) throw next({ status: 500, message: "Failed to retrive data" });
      res.status(200).json({
        JoinDetail,
      });
    });
  };

  static UserVote = async (req, res, next) => {
    const { joinId } = req.params;
    const { voterId, candidateId, position } = req.body;
    try {
      if (joinId && voterId && candidateId && position) {
        const electionJoin = await ElectionJoinModel.findById(joinId);
        if (!electionJoin) {
          return next({ status: 404, message: "Election Join not found" });
        }
        let candidateIndex = -1;
        const candidate = electionJoin.candidate.find((c, index) => {
          if (c.candidatePosition === position) {
            candidateIndex = index;
            return true;
          }
          return false;
        });
        if (!candidate) {
          return next({ status: 404, message: "Candidate not found" });
        }
        const positionIndex = electionJoin.position.findIndex(
          (p) =>
            p.positionName.toString() === candidate.candidatePosition.toString()
        );
        if (positionIndex === -1) {
          return next({ status: 404, message: "Position not found" });
        }
        electionJoin.candidate.splice(candidateIndex, 1);
        electionJoin.position.splice(positionIndex, 1);
        await electionJoin.save();
        next();
        res.status(200).send("Vote Done Successfully");
      } else {
        next({ status: 400, message: "Something is missing" });
      }
    } catch (err) {
      next({ status: 400, message: "Invalid Id" });
    }
  };
  static ChangeVoteStatus = async (req, res, next) => {
    const { joinId } = req.params;
    const electionJoin = await ElectionJoinModel.findById(joinId);
    if (electionJoin && electionJoin.position.length === 0) {
      await ElectionJoinModel.findOneAndUpdate(
        { _id: joinId },
        { $set: { votingStatus: true } },
        { new: true }
      );
    }
  };

  static CastVote = async (req, res, next) => {
    const { candidateId, voterId, electionId } = req.body;
    if (candidateId && voterId && electionId) {
      const vote = new VoteRecord(req.body);
      vote.save(function (err, doc) {
        if (err) {
          next({ status: 400, message: err });
        } else {
          next();
        }
      });
    }
  };

  static getCandidateDetailsByElection = async (req, res, next) => {
    const { electionId, candidateId } = req.body;
    try {
      // find the election document with the given electionId and the candidate with the given candidateId
      const candidate = await ElectionModel.find(
        { "candidate._id": mongoose.Types.ObjectId(candidateId) },
        { "candidate.$": 1 }
      );

      if (!candidate) {
        throw new Error("Candidate not found");
      }

      // return the candidate information
      res.status(200).json({
        candidate,
      });
    } catch (error) {
      console.error(error);
    }
  };

  static getVoteCountByElection = async (req, res, next) => {
    const { electionId } = req.params;
    if (electionId) {
      const voteInfo = await VoteRecord.find({ electionId: electionId });
      if (voteInfo && voteInfo.length > 0) {
        // Find the election matching the vote
        const election = await ElectionModel.findOne({
          _id: voteInfo[0].electionId,
        }).lean();
        if (!election) {
          return next({
            status: 400,
            message: "Election not found for the given id",
          });
        }

        // Calculate the total number of votes for each candidate
        const candidateVotes = {};
        for (const vote of voteInfo) {
          const candidateId = vote.candidateId.toString();
          if (
            election.candidate.some((c) => c._id.toString() === candidateId)
          ) {
            if (!candidateVotes[candidateId]) {
              candidateVotes[candidateId] = 1;
            } else {
              candidateVotes[candidateId]++;
            }
          }
        }

        // Get the candidate details and total vote count
        const voteCounts = [];
        for (const candidate of election.candidate) {
          const candidateId = candidate._id.toString();
          const count = candidateVotes[candidateId] || 0;
          voteCounts.push({
            candidate: candidate,
            voteCount: count,
          });
        }

        res.status(200).json({
          election: election,
          voteCounts: voteCounts,
        });
      } else {
        next({
          status: 400,
          message: "No vote records found for the election",
        });
      }
    } else {
      next({ status: 400, message: "Election Id is missing" });
    }
  };

  static getElectionByVoters = async (req, res, next) => {
    const { id } = req.params;
    console.log("The id", id);
    const idPattern = /^[0-9a-fA-F]{24}$/;
    if (!idPattern.test(id)) {
      return next({ status: 400, message: "Invalid election ID" });
    }
    const objectId = mongoose.Types.ObjectId(id);

    const details = await PreDefinedVoter.findOne({ electionId: objectId });
    if (details) {
      res.status(200).json({
        details,
      });
    } else {
      next({ status: 400, message: "Election not found" });
    }
  };

  static getVoterByEmailAndCode = async (req, res, next) => {
    const { code, email, user } = req.body;
    if (code && email && user) {
      const userDetail = await PreDefinedVoter.findOne(
        {
          voters: {
            $elemMatch: {
              voterEmail: email,
              voterId: code,
            },
          },
        },
        {
          "voters.$": 1,
          electionId: 1,
        }
      );
      if (userDetail && userDetail.voters && userDetail.voters.length > 0) {
        const Election = await ElectionJoinModel.findOne({
          electionId: userDetail.electionId,
          voterId: user,
        });
        res.status(200).json({
          voter: userDetail.voters[0],
          election: Election._id,
        });
      } else {
        next({
          status: 400,
          message: "Not Verified. Please Check your email or code.",
        });
      }
    } else {
      next({
        status: 400,
        message: "Not Verified. Please Check your email or code.",
      });
    }
  };

  static getAllVoteCountByElection = async (req, res, next) => {
    try {
      const voteRecords = await VoteRecord.find();
      const electionIds = voteRecords.map((vote) => vote.electionId.toString());
      const uniqueElectionIds = [...new Set(electionIds)];
      const voteCounts = [];
      for (const electionId of uniqueElectionIds) {
        const voteInfo = voteRecords.filter(
          (vote) => vote.electionId.toString() === electionId
        );
        const election = await ElectionModel.findOne({
          _id: electionId,
        }).lean();
        if (election) {
          const candidateVotes = {};
          for (const vote of voteInfo) {
            const candidateId = vote.candidateId.toString();
            if (
              election.candidate.some((c) => c._id.toString() === candidateId)
            ) {
              if (!candidateVotes[candidateId]) {
                candidateVotes[candidateId] = 1;
              } else {
                candidateVotes[candidateId]++;
              }
            }
          }
          const totalVotes = Object.values(candidateVotes).reduce(
            (a, b) => a + b,
            0
          );
          voteCounts.push({
            electionId: electionId,
            electionName: election.name,
            month: election.month,
            totalVotes: totalVotes,
          });
        }
      }
      res.status(200).json(voteCounts);
    } catch (err) {
      next(err);
    }
  };

  static getElectionByCreater = async (req, res, next) => {
    try {
      const elections = await ElectionModel.find({ createdBy: req.user._id });
      const electionsWithCodes = await Promise.all(
        elections.map(async (election) => {
          const code = await ElectionCodeModel.findOne({
            electionId: election._id,
          });
          return {
            ...election.toObject(),
            code: code.code,
          };
        })
      );
      res.status(200).json({
        elections: electionsWithCodes,
      });
    } catch (error) {
      next({ status: 400, message: "Not Found" });
    }
  };
}
export default ElectionController;

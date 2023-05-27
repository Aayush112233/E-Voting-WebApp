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
import AdminNotification from "../models/AdminNotification.js";
class ElectionController {
  static CreateElection = async (req, res, next) => {
    try {
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

        const notification = new AdminNotification({
          notification: `A new election was created by ${
            req.user.firstName + " " + req.user.lastName
          }`,
          type: "Election",
        });

        election.save(async function (err, doc) {
          if (err) {
            next({ status: 400, message: err });
          } else {
            const email = req.user.email;
            if (req.body.isVoter) {
              voterDefine.save();
            }
            eletionCode.save();
            notification.save();
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
            res.status(200).json({
              result: req.body,
              message: "Election Created Sucessfully",
            });
          }
        });
      } else {
        next({ status: 400, message: "All Fields are required" });
      }
    } catch (error) {
      next({ status: 500, message: "Server Error" });
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
    try {
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
    } catch (error) {
      next({});
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
      {
        $sort: {
          "election_info.electionStartDate": 1,
        },
      },
    ]).exec(function (err, electionDetails) {
      if (err) throw next({ status: 500, message: err });
      res.status(200).json({
        electionDetails,
      });
    });
  };

  static GetElectionCountUser = async (req, res) => {
    const userId = req.user._id;
    const voterId = mongoose.Types.ObjectId(userId);

    const electionCount = await ElectionJoinModel.countDocuments({ voterId });

    res.status(200).json({ electionCount });
  };

  static GetVoteCountUser = async (req, res) => {
    const userId = req.user._id;
    const voterId = mongoose.Types.ObjectId(userId);

    const voteCount = await VoteRecord.countDocuments({ voterId });

    res.status(200).json({ voteCount });
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

  static getTotalNoofElections = async (req, res, next) => {
    try {
      const totalElections = await ElectionModel.countDocuments({});
      const voterDefined = await ElectionModel.countDocuments({
        isVoter: true,
      });
      const openVoter = totalElections - voterDefined;
      res.json({ totalElections, voterDefined, openVoter });
    } catch (err) {
      next(err);
    }
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

        // Get the candidate details and total vote count, and sort by highest vote count
        const voteCounts = [];
        for (const candidate of election.candidate) {
          const candidateId = candidate._id.toString();
          const count = candidateVotes[candidateId] || 0;
          voteCounts.push({
            candidate: candidate,
            voteCount: count,
          });
        }
        voteCounts.sort((a, b) => b.voteCount - a.voteCount);

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
            electionName: election.electionName,
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

  static getAllElectionCountByCreater = async (req, res, next) => {
    try {
      const voteRecords = await VoteRecord.find();
      const electionIds = voteRecords.map((vote) => vote.electionId.toString());
      const uniqueElectionIds = [...new Set(electionIds)];
      const voteCounts = [];

      // get the user ID from the request or from the authenticated user
      const userId = req.user._id;

      for (const electionId of uniqueElectionIds) {
        const voteInfo = voteRecords.filter(
          (vote) => vote.electionId.toString() === electionId
        );
        const election = await ElectionModel.findOne({
          _id: electionId,
          createdBy: userId, // add the filter condition here
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
            electionName: election.electionName,
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
      const elections = await ElectionModel.find({
        createdBy: req.user._id,
      }).sort({ createdAt: -1 });
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

  static getVotersByElection = async (req, res, next) => {
    const { id } = req.params;
    const isIdValid = ObjectId.isValid(id);
    if (!isIdValid) {
      next({ status: 400, message: "Invalid id" });
      return;
    }

    const voters = await PreDefinedVoter.findOne({ electionId: id });
    if (voters) {
      res.status(200).json({
        voters,
      });
    } else {
      next({ status: 400, message: "No Voters are found" });
    }
  };

  static UpdateElectionDetails = async (req, res, next) => {
    const { id } = req.params;
    const {
      electionName,
      electionStartDate,
      electionEndDate,
      organizationName,
    } = req.body;
    if (
      electionName &&
      electionStartDate &&
      electionEndDate &&
      organizationName
    ) {
      const now = new Date();
      const election = await ElectionModel.findById(id);

      if (now >= election.electionStartDate) {
        next({
          status: 400,
          message: "Cannot edit election details after election start date",
        });
        return;
      }

      ElectionModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: req.body,
        },
        {
          new: true,
        },
        (err, done) => {
          if (err) {
            next({ status: 400, message: err });
          } else {
            res.status(200).json({
              result: req.body,
              message: "Election Information Updated Sucessfully",
            });
          }
        }
      );
    } else {
      next({ status: 400, message: "Invalid Fields" });
    }
  };

  static getElectionByElectionID = async (req, res, next) => {
    const { id } = req.params;
    const isIdValid = ObjectId.isValid(id);

    if (!isIdValid) {
      return next({ status: 400, message: "Invalid Id" });
    }

    const election = await ElectionModel.findById(id);

    if (election) {
      res.status(200).json({
        election,
      });
    } else {
      next({ status: 400, message: "Election for the given Id not Found" });
    }
  };

  static UpdatePostionDetails = async (req, res, next) => {
    const { id } = req.params;
    const { position } = req.body;
    if (position.length > 0) {
      const now = new Date();
      const election = await ElectionModel.findById(id);
      if (now >= election.electionStartDate) {
        next({
          status: 400,
          message: "Cannot edit election details after election start date",
        });
        return;
      }
      ElectionModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: req.body,
        },
        {
          new: true,
        },
        (err, done) => {
          if (err) {
            next({ status: 400, message: err });
          } else {
            res.status(200).json({
              result: req.body,
              message: "Postions Updated Sucessfully",
            });
          }
        }
      );
    }
  };
  static UpdateCandidateDetails = async (req, res, next) => {
    const { id } = req.params;
    const { candidate } = req.body;
    if (candidate.length > 0) {
      const election = await ElectionModel.findById(id);
      if (now >= election.electionStartDate) {
        next({
          status: 400,
          message: "Cannot edit election details after election start date",
        });
        return;
      }
      ElectionModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: req.body,
        },
        {
          new: true,
        },
        (err, done) => {
          if (err) {
            next({ status: 400, message: err });
          } else {
            res.status(200).json({
              result: req.body,
              message: "Candidate Updated Sucessfully",
            });
          }
        }
      );
    }
  };

  static UpdateVotersForElection = async (req, res, next) => {
    const { id } = req.params;
    const { voters } = req.body;
    const electionStatus = await ElectionModel.findOne({ _id: id });

    if (electionStatus) {
      if (electionStatus.isVoter) {
        // Update the existing document with new voters array
        const updatedPreVoterInfo = await PreDefinedVoter.findOneAndUpdate(
          { electionId: id },
          {
            $set: { voters },
          },
          { new: true }
        );

        res.status(200).json({
          message: "Voters updated successfully",
          data: updatedPreVoterInfo,
        });
      } else {
        // Create a new document with the provided voters array
        const newPreDefinedVoter = new PreDefinedVoter({
          electionId: id,
          voters: voters,
        });
        const savedPreDefinedVoter = await newPreDefinedVoter.save();
        if (savedPreDefinedVoter) {
          const updatedElection = await ElectionModel.findByIdAndUpdate(
            { _id: id },
            { isVoter: true },
            { new: true }
          );
        }

        res.status(201).json({
          message: "Voters added successfully",
          data: savedPreDefinedVoter,
        });
      }
    } else {
      next({ status: 400, message: "No Election Found" });
    }
  };

  static getAllElections = async (req, res, next) => {
    try {
      const elections = await ElectionModel.find({}).sort({ createdAt: -1 });
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

  static getTotalNoofVotes = async (req, res, next) => {
    try {
      const totalVotes = await VoteRecord.countDocuments({});
      res.status(200).json({
        totalVotes,
      });
    } catch (err) {
      next({ status: 500, message: err });
    }
  };

  static getNearestElectionAlert = async (req, res, next) => {
    const userId = req.user._id;

    // Get all the elections and filter out the ones that have already ended
    const elections = await ElectionJoinModel.aggregate([
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
          voterId: userId,
        },
      },
      {
        $project: {
          election_info: 1,
        },
      },
    ]).exec();

    const currentDate = new Date();
    const upcomingElections = elections.filter((election) => {
      const startDate = new Date(
        Date.parse(election.election_info[0]?.electionStartDate)
      );
      const endDate = new Date(
        Date.parse(election.election_info[0]?.electionEndDate)
      );
      return startDate > currentDate && endDate > currentDate;
    });

    // Sort the upcoming elections by their start date
    upcomingElections.sort((a, b) => {
      const aStartDate = new Date(
        Date.parse(a.election_info[0].electionStartDate)
      );
      const bStartDate = new Date(
        Date.parse(b.election_info[0].electionStartDate)
      );
      return aStartDate - bStartDate;
    });

    res.status(200).json({
      upcomingElections,
    });
  };

  static getElectionParticipatedCount = async (req, res, next) => {
    const userID = req.user._id;
    const electionCount = await ElectionModel.find({
      createdBy: userID,
    }).countDocuments();
    if (electionCount) {
      res.status(200).json({
        electionCount,
      });
    } else {
      next({ status: 400, message: "No Election Found!" });
    }
  };

  static getElectionMissed = async (req, res, next) => {
    const userId = req.user._id;
    try {
      // find all the election join records for the user
      const electionJoins = await ElectionJoinModel.find({ voterId: userId });
      let missedCount = 0;

      // loop through each election join record and check if the user has casted any vote or not
      for (const electionJoin of electionJoins) {
        const election = await ElectionModel.findById(electionJoin.electionId);

        // check if the election has ended
        const now = new Date();
        if (now > new Date(election.electionEndDate)) {
          const voteRecord = await VoteRecord.findOne({
            voterId: userId,
            electionId: electionJoin.electionId,
          });
          // if the vote record is null, it means the user has not casted any vote for this election
          if (!voteRecord) {
            missedCount++;
          }
        }
      }

      res.status(200).json({ missedCount });
    } catch (error) {
      next(error);
    }
  };

  static getLastCompletedElectionDetails = async (req, res, next) => {
    const voterId = req.user._id;

    try {
      // Find all the election_join records for the given voterId
      const electionJoins = await ElectionJoinModel.find({
        voterId: voterId,
      }).exec();
      // Query the election model to get all the completed elections
      const completedElections = await ElectionModel.find({
        electionEndDate: { $lt: new Date() },
      }).sort({ electionEndDate: -1 });

      // Find the last completed election that the user has voted in
      let lastCompletedElection = null;
      for (const election of completedElections) {
        const electionJoin = electionJoins.find(
          (ej) => ej.electionId.equals(election._id) && ej.votingStatus
        );
        if (electionJoin) {
          lastCompletedElection = election;
          break;
        }
      }

      if (!lastCompletedElection) {
        return res
          .status(404)
          .json({ message: "No completed elections found" });
      }

      // Query the election document to get the total number of positions and candidates
      const electionName = lastCompletedElection.electionName;
      const numPositions = lastCompletedElection.position.length;
      const numCandidates = lastCompletedElection.candidate.length;

      // Query the vote records to get the total vote count for each candidate
      const voteCounts = {};
      const voteRecords = await VoteRecord.find({
        electionId: lastCompletedElection._id,
      });
      voteRecords.forEach((vote) => {
        if (voteCounts[vote.candidateId]) {
          voteCounts[vote.candidateId]++;
        } else {
          voteCounts[vote.candidateId] = 1;
        }
      });

      // Find the candidate with the highest number of votes
      let mostVotes = 0;
      let mostVotesCandidate = null;
      for (const candidateId in voteCounts) {
        if (voteCounts[candidateId] > mostVotes) {
          mostVotes = voteCounts[candidateId];
          mostVotesCandidate = candidateId;
        }
      }
      const candidateId = mostVotesCandidate;

      const candidate = lastCompletedElection.candidate.find(
        (c) => c._id.toString() === candidateId
      );
      const candidateName = candidate.candidateName;

      // Return the result with the required information
      const result = {
        mostVotesReceived: candidateName,
        electionName: electionName,
        totalVotes: voteRecords.length,
        numPositions: numPositions,
        numCandidates: numCandidates,
      };
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}
export default ElectionController;

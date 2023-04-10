import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../../baseUrlProvider";
import { getAllElectionByJoin } from "../../../Services/electionServices";
const VotePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  // const { electionbyJoin } = useSelector((state) => state.joinElectionState);
  const [electionByJoin, setElectionByJoin] = useState([]);
  const { userData } = useSelector((state) => state.userState);
  const [currentVoted, setCurrentVoted] = useState({});
  const [userId, setUserId] = useState();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();
  const [position, setPosition] = React.useState("");
  const [election, setElection] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    getElection()
    // dispatch(getAllElectionByJoin(params.id));
  }, []);

  const getElection = () =>{
    API.get(`/election/getElectionByJoin/${params.id}`)
      .then((response) => {
        setElectionByJoin(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "500px",
      xs: "90%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "#fff",
    justifyContent: "between",
    color: "#000",
    textAlign: "center",
    borderRadius: "20px",
    padding: "20px 20px 30px",
    //   pointerEvents: "none",
    outline: "none",
    opacity: 0,
    transition: "opacity 250ms 700ms ease",
  };

  useEffect(() => {
    if (userData.userInfo) {
      setUserId(userData.userInfo._id);
    }
  }, [userData]);
  useEffect(() => {
    if (
      electionByJoin.length !== 0 &&
      electionByJoin.JoinDetail[0] &&
      electionByJoin.JoinDetail[0].election_info[0] &&
      electionByJoin.JoinDetail[0].position[0] &&
      electionByJoin.JoinDetail[0].candidate[0]
    ) {
      setElection(electionByJoin.JoinDetail[0].election_info[0]);
      setCandidate(
        electionByJoin.JoinDetail[0].candidate.length !== 0
          ? electionByJoin.JoinDetail[0].candidate
          : ""
      );
      setPositions(
        electionByJoin.JoinDetail[0].position.length !== 0
          ? electionByJoin.JoinDetail[0].position
          : ""
      );
    } else {
      setElection([]);
      setCandidate([]);
      setPositions([]);
      if (electionByJoin.length !== 0 && electionByJoin.JoinDetail[0]) {
        navigate("/users/joinElection");
      }
    }
  }, [electionByJoin]);

  useEffect(() => {
    if (positions) {
      setPosition(positions[0]?.positionName);
    }
  }, [positions]);

  useEffect(() => {
    if (position) {
      const filteredCandidate = candidate.filter(
        (item) => item.candidatePosition === position
      );
      setFilteredCandidates(filteredCandidate);
    }
  }, [position, candidate]);

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const CastVote = () => {
    const data = {
      position: currentVoted.candidatePosition,
      voterId: userId,
      candidateId: currentVoted._id,
      electionId: election?._id,
    };

    API.post(
      `${process.env.REACT_APP_API_URL}/election/userVote/${electionByJoin.JoinDetail[0]._id}`,
      data
    )
      .then((res) => {
        toast.success(`You have succesfully voted for ${position} position`);
        getElection()
        setConfirmOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleVote = async (item) => {
    setCurrentVoted(item);
    setConfirmOpen(true);
    // const data = {
    //   position: position,
    //   voterId: userId,
    //   candidateId: candidate,
    //   electionId: election._id,
    // };

    // API.post(
    //   `${process.env.REACT_APP_API_URL}/election/userVote/${electionbyJoin.JoinDetail[0]._id}`,
    //   data
    // )
    //   .then((res) => {
    //     toast.success(`You have succesfully voted for ${position} position`);
    //     dispatch(getAllElectionByJoin(params.id));
    //   })
    //   .catch((err) => {
    //     toast.error(err.response.data.message);
    //   });
  };

  return (
    <>
      <Box
        height={"80vh"}
        alignItems="center"
        display={"flex"}
        flexDirection="column"
      >
        <Grid container mt={2} justifyContent={"center"}>
          <Typography variant="h5">{election?.electionName ?? ""}</Typography>
        </Grid>
        <Grid
          container
          sx={{
            maxWidth: {
              md: "80%",
              xs: "95%",
            },
          }}
          spacing={3}
          mt={3}
        >
          <Grid item xs={12}>
            <TextField
              id="filled-select-currency"
              select
              label="Position"
              helperText="You can change the position from here."
              onChange={handlePositionChange}
              value={position}
              size="small"
              sx={{
                ml: 4,
                "& .MuiSvgIcon-root": {
                  position: "relative",
                },
              }}
            >
              {positions?.map((item) => (
                <MenuItem value={item.positionName}>
                  {item.positionName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} padding={{ md: 4, xs: 1 }}>
              {filteredCandidates?.map((item) => {
                return (
                  <>
                    <Grid item xs={12} md={6}>
                      <Card
                        sx={{
                          minHeight: "300px",
                          padding: 3,
                          boxShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        }}
                      >
                        <CardMedia
                          component="img"
                          alt="green iguana"
                          height="250"
                          sx={{ maxWidth: "100%" }}
                          image={item.candidateImage}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {item.candidateName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            For the position of {item.candidatePosition}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "end" }}>
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleVote(item);
                            }}
                          >
                            Vote
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={confirmOpen}
          onClose={() => {
            setConfirmOpen(false);
          }}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={confirmOpen}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Are you sure about voting{" "}
                <span style={{ fontWeight: "bold" }}>
                  {currentVoted.candidateName}
                </span>{" "}
                for {currentVoted.candidatePosition} ?
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <Alert
                  sx={{
                    "& .MuiAlert-root": {
                      minWidth: "100%",
                    },
                    "& .MuiAlert-icon": {
                      position: "relative",
                      marginRight: "30px",
                      mt: "6px",
                    },
                  }}
                  severity="warning"
                >
                  Once the vote is recorded, it can't be reverted.
                </Alert>
              </Typography>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  marginTop: "20px",
                  gap: "1rem",
                  justifyContent: "end",
                  alignItems: "end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setConfirmOpen(false);
                  }}
                >
                  Close
                </Button>
                <Button variant="outlined" onClick={CastVote}>
                  Confirm
                </Button>
              </div>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </>
  );
};

export default VotePage;

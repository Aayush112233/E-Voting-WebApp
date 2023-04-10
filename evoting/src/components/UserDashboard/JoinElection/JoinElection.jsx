import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Button,
  Chip,
  Fade,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { API } from "../../../baseUrlProvider";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAllElectionById } from "../../../Services/electionServices";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdHowToVote } from "react-icons/md";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import ElectionCount from "../../../Reusables/ElectionCount";
import { IoMdClose } from "react-icons/io";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterIcon,
  FacebookIcon,
} from "react-share";

const JoinElection = ({ setSelectedLink, link }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userState);
  const { electionbyId } = useSelector((state) => state.joinElectionState);
  const [isCodeValid, setCodeValid] = useState(true);
  const [allElection, setAllElection] = useState();
  const [validation, setValidation] = useState("");
  const [change, setChange] = useState(false);
  const [noElection, setNoElection] = useState(true);
  const [voterCode, setVoterCode] = useState(0);
  const [open, setOpen] = useState(false);
  const [toNavigate, setToNavigate] = useState();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "400px",
      xs: "90%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "#000",
    textAlign: "center",
    borderRadius: "20px",
    padding: "30px 30px 70px",
    //   pointerEvents: "none",
    outline: "none",
    opacity: 0,
    transition: "opacity 250ms 700ms ease",
  };

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  // useEffect(()=>{
  //   API.get(`/election/getElectionByPreVoters/${}`)
  // },[allElection])

  useEffect(() => {
    if (userData.userInfo) {
      dispatch(getAllElectionById(userData.userInfo._id));
    }
  }, [userData]);

  useEffect(() => {
    if (electionbyId.electionDetails?.length > 0) {
      setAllElection(electionbyId.electionDetails);
      setNoElection(false);
    } else {
      setNoElection(true);
    }
  }, [electionbyId]);

  const validCode = () => {
    const codeINT = parseInt(code);
    if (!codeINT) {
      setCodeValid(false);
      return setValidation("Please Provice a code.");
    }
    if (code.length !== 7) {
      setCodeValid(false);
      return setValidation("Code must have 7 digit");
    }
    setValidation("");
    return true;
  };

  const handleJoin = () => {
    if (validCode()) {
      API.post(`${process.env.REACT_APP_API_URL}/election/joinElection/${code}`)
        .then((res) => {
          toast.success(res.data.message);
          dispatch(getAllElectionById(userData.userInfo._id));
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const handleValidTime = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now >= start && now <= end) {
      return true;
    } else {
      return false;
    }
  };

  const handleVoteVerify = (id) => {
    API.get(`/election/getElectionByPreVoters/${id}`)
      .then((res) => {
        setOpen(true);
        setToNavigate(id);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleEnterVote = () => {
    const data = {
      code: voterCode,
      email: userData.userInfo.email,
      user: userData.userInfo._id,
    };
    API.post(`/election/getVoterByIdandEmail`, data)
      .then((res) => {
        navigate(`/users/vote/${res.data.election}`);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          gap: "0.4rem",
          alignItems: "center",
          borderRadius: "20px",
          padding: "10px",
        }}
      >
        <Typography
          sx={{ textAlign: "center", color: "green", mt: 2, fontSize: "3rem" }}
        >
          {" "}
          Join Election
        </Typography>
        <Typography
          sx={{ textAlign: "center", color: "green", fontSize: "1.5rem" }}
        >
          {" "}
          Be Ready to vote
        </Typography>
        <Box
          sx={{
            width: {
              md: "70%",
              xs: "95%",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "15px",
            maxHeight: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Grid container mt={2} justifyContent="center" spacing={2}>
            <Grid item>
              <TextField
                label="Election Code"
                id="standard-size-small"
                placeholder="Example : 9892726"
                error={!isCodeValid}
                type="number"
                inputProps={{ min: 0 }}
                helperText={validation}
                size="small"
                counter="false"
                sx={{ marginRight: "20px" }}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeValid(true);
                  setValidation("");
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  color: "green",
                  border: "2px solid green",
                }}
                onClick={handleJoin}
              >
                {" "}
                Join Election
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Box
              sx={{
                mt: 5,
                maxHeight: "500px",
                padding: "10px",
                minWidth: "80%",
                mx: "auto",
                padding: "20px",
                borderRadius: "15px",
                backgroundColor: "white",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              <Grid container spacing={1}>
                {noElection ? (
                  <>
                    <Grid item xs={12} alignItems="center">
                      <Alert
                        severity="success"
                        icon={false}
                        style={{ justifyContent: "center" }}
                      >
                        <strong style={{ textAlign: "center" }}>
                          You haven't participated in any election yet.
                        </strong>
                        <br></br>
                        You can join a election by using its code.
                      </Alert>
                    </Grid>
                  </>
                ) : null}

                {allElection?.map((item) => {
                  return (
                    <Grid item xs={12} key={item._id}>
                      <Alert
                        severity="success"
                        icon={false}
                        sx={{
                          "& .MuiAlert-root": {
                            minWidth: "100%",
                          },
                          "& .MuiAlert-message": {
                            minWidth: "100%",
                            display: "flex",
                            flexDirection: {
                              md: "row",
                              xs: "column",
                            },
                            gap: {
                              md: "1rem",
                              sx: "1rem",
                            },
                            justifyContent: "space-between",
                            alignItems: {
                              md: "center",
                              xs: "none",
                            },
                          },
                        }}
                      >
                        <div>
                          <AlertTitle
                            sx={{ color: "green", fontWeight: "bold" }}
                          >
                            {item.election_info[0]?.electionName}
                          </AlertTitle>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "0.5rem",
                              flexDirection: { md: "row", xs: "column" },
                            }}
                          >
                            <div>
                              <ElectionCount
                                startDate={
                                  item.election_info[0]?.electionStartDate
                                }
                                endDate={item.election_info[0]?.electionEndDate}
                                setChange={setChange}
                              />
                            </div>
                          </Box>
                        </div>
                        <div>
                          {item.votingStatus ? (
                            <>
                              <Chip
                                label="Voted"
                                color="primary"
                                variant="contained"
                                style={{
                                  minWidth: "80px",
                                  backgroundColor: "#266900",
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Chip
                                label="Not Voted"
                                color="primary"
                                variant="contained"
                                style={{
                                  minWidth: "80px",
                                  color: "red",
                                  backgroundColor: "#FFD5D5",
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.7rem",
                          }}
                        >
                          {item.election_info[0]?.isVoter ? (
                            <>
                              <Button
                                variant="outlined"
                                disabled={
                                  item.votingStatus ||
                                  !handleValidTime(
                                    item.election_info[0]?.electionStartDate,
                                    item.election_info[0]?.electionEndDate
                                  )
                                }
                                startIcon={
                                  <MdHowToVote
                                    style={{ position: "relative" }}
                                  />
                                }
                                onClick={() => {
                                  handleVoteVerify(item.electionId);
                                }}
                                sx={{
                                  borderRadius: "30px",
                                  border: "none",
                                  float: "right",
                                  color: "green",
                                  "&:active": {
                                    boxShadow: "none",
                                    backgroundColor: "#0062cc",
                                    border: "none",
                                  },
                                  "&:hover": {
                                    boxShadow: "none",
                                    backgroundColor: "none",
                                    border: "none",
                                  },
                                }}
                              >
                                Vote
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outlined"
                              disabled={
                                item.votingStatus ||
                                !handleValidTime(
                                  item.election_info[0]?.electionStartDate,
                                  item.election_info[0]?.electionEndDate
                                )
                              }
                              startIcon={
                                <MdHowToVote style={{ position: "relative" }} />
                              }
                              onClick={() => {
                                navigate(`/users/vote/${item._id}`);
                              }}
                              sx={{
                                borderRadius: "30px",
                                border: "none",
                                float: "right",
                                color: "green",
                                "&:active": {
                                  boxShadow: "none",
                                  backgroundColor: "#0062cc",
                                  border: "none",
                                },
                                "&:hover": {
                                  boxShadow: "none",
                                  backgroundColor: "none",
                                  border: "none",
                                },
                              }}
                            >
                              Vote
                            </Button>
                          )}

                          <Button
                            variant="outlined"
                            startIcon={
                              <AiOutlineFileSearch
                                style={{ position: "relative" }}
                              />
                            }
                            onClick={() => {
                              navigate(
                                `/users/viewElection/${item.electionId}`
                              );
                            }}
                            sx={{
                              borderRadius: "30px",
                              border: "none",
                              float: "right",
                              color: "green",
                              "&:active": {
                                boxShadow: "none",
                                backgroundColor: "#0062cc",
                                border: "none",
                              },
                              "&:hover": {
                                boxShadow: "none",
                                backgroundColor: "none",
                                border: "none",
                              },
                            }}
                          >
                            View
                          </Button>
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <TwitterShareButton
                            url={"https://evoting.com"}
                            title={`I participated in ${item.election_info[0]?.electionName} from online voting app`}
                            quote={"#voting #election2023"}
                          >
                            <TwitterIcon
                              style={{ position: "relative" }}
                              size={32}
                              round
                            />
                          </TwitterShareButton>
                          <FacebookShareButton
                            url={"https://evoting.com"}
                            title={`I participated in ${item.election_info[0]?.electionName} from online voting app`}
                            quote={"#voting #election2023"}
                          >
                            <FacebookIcon
                              style={{ position: "relative" }}
                              size={32}
                              round
                            />
                          </FacebookShareButton>
                        </div>
                      </Alert>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
        </Box>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          sx={{
            "&:focus": {
              outline: "none",
            },
          }}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 600,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <IoMdClose />
              </IconButton>

              <Typography
                id="modal-modal-title"
                fontWeight={"bold"}
                variant="h5"
                component="h2"
              >
                Enter your code
              </Typography>
              <form>
                <Grid container>
                  <Grid item xs={12} mt={3}>
                    <TextField
                      type="number"
                      value={voterCode}
                      onChange={(e) => setVoterCode(e.target.value)}
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} mt={3}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#333333",
                        borderRadius: "25px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#000000",
                        },
                      }}
                      onClick={handleEnterVote}
                      fullWidth
                    >
                      Enter Election
                    </Button>
                  </Grid>
                  <Grid item xs={12} mt={2}>
                    <Alert
                      severity="info"
                      sx={{
                        position: "relative",
                        "& .MuiAlert-icon": {
                          position: "relative",
                          top: 6,
                          right: 10,
                          marginRight: "20px",
                        },
                      }}
                    >
                      We are needed to —{" "}
                      <strong>
                        enter the id provided by your organization
                      </strong>
                    </Alert>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </>
  );
};

export default JoinElection;

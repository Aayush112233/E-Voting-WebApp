import React, { useEffect, useState } from "react";
import {
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  Button,
  Box,
  Card,
  TextField,
  MenuItem,
  Menu,
} from "@mui/material";
import ElectionDetails from "../Steps/ElectionDetails";
import PositionDetails from "../Steps/PositionDetails";
import CandidateDetails from "../Steps/CandidateDetails";
import StepOverview from "./StepOverview";
import { useDispatch, useSelector } from "react-redux";
import PreDefineVoters from "../Steps/PredefineVoters";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Ballot, NoteAddOutlined } from "@mui/icons-material";
import ManageElection from "../ManageElection/ManageElection";
import { API } from "../../../baseUrlProvider";
import { FetchPreviousElection, clearPreviousElection } from "../../../Services/stepperServices";

const useStyles = styled((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    "Election Information",
    "Voter Information",
    "Define Election Positions",
    "Predefine Voters",
  ];
}

export default function StepForm({ setSelectedLink, link }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [stepper, setStepper] = useState(true);
  const steps = getSteps();
  const { isSubmitted, isLoading } = useSelector((state) => state.stepperState);
  const [value, setValue] = React.useState(0);
  const [selectedElection, setSelectedElection] = useState("");
  const [dropDown, setDropDown] = useState({
    value: "",
    name: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const [elections, setElections] = useState([]);
  useEffect(() => {
    getElectionByCreater();
  }, []);

  const getElectionByCreater = async() => {
    await API.get("/election/getElectionByCreater")
      .then((res) => {
        setElections(res.data.elections);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ElectionDetails
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            classes={classes}
            steps={steps}
          />
        );
      case 1:
        return (
          <PositionDetails
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            classes={classes}
            steps={steps}
          />
        );
      case 2:
        return (
          <CandidateDetails
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            classes={classes}
            steps={steps}
          />
        );
      case 3:
        return (
          <PreDefineVoters
            activeStep={activeStep}
            handleBack={handleBack}
            handleSkip={handleSkip}
            handleNext={handleNext}
            classes={classes}
            steps={steps}
          />
        );
      default:
        return "Unknown step";
    }
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const reset = () => {
    setActiveStep(0);
  };

  const handleSelectChange = async (e) => {
    const id = e.target.value;
    setSelectedElection(id)
    API.get(`election/getElectionById/${id}`)
      .then((res) => {
        delete res.data.election._id;
        delete res.data.election.isVoter;
        delete res.data.election.createdAt;
        delete res.data.election.updatedAt;
        AddVoter(id, res.data.election)
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const AddVoter = (id, data) =>{
    API.get(`/election/getVotersByElection/${id}`).then((res)=>{
      data.voters = res.data.voters.voters
      dispatch(FetchPreviousElection(data))
    }).catch((err)=>{
      dispatch(FetchPreviousElection(data))
    })
  }

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
          background: "#ecf9f0",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            maxWidth: {
              lg: "70%",
              md: "80%",
              xs: "90%",
            },
            borderRadius: "15px",
          }}
        >
          <BottomNavigation
            sx={{
              "&.MuiBottomNavigation-root": {
                backgroundColor: "#ecf9f0",
              },
            }}
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="Create Election"
              icon={<NoteAddOutlined sx={{ position: "relative" }} />}
            />
            <BottomNavigationAction
              label="Your Election"
              icon={<Ballot sx={{ position: "relative" }} />}
            />
          </BottomNavigation>
        </Box>
        {value === 0 && (
          <Card
            sx={{
              width: {
                md: "80%",
                xs: "100%",
              },
              overflow: "auto",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              borderRadius: "20px",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <div>
              {activeStep === 0 ? (
                <>
                  <TextField
                    label="Selection Election"
                    onChange={handleSelectChange}
                    value={selectedElection}
                    select
                    helperText="You can use previous election and edit it as required"
                    size="small"
                    sx={{
                      ml: 4,
                      "& .MuiSvgIcon-root": {
                        position: "relative",
                      },
                    }}
                  >
                    {elections?.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.electionName}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button variant="outlined" sx={{ ml: 1 }} onClick={()=>{dispatch(clearPreviousElection()); setSelectedElection("")}}>
                    Clear
                  </Button>
                </>
              ) : null}

              <Stepper
                activeStep={activeStep}
                sx={{
                  display: stepper ? "flex" : "none",
                }}
              >
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};

                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel
                        {...labelProps}
                        sx={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: "1.5rem",
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <Box
                sx={{
                  marginTop: 3,
                  mx: "auto",
                  padding: "10px",
                  maxWidth: "100%",
                }}
              >
                {activeStep === steps.length ? (
                  <div>
                    <StepOverview setStepper={setStepper} GoBack={reset} />
                  </div>
                ) : (
                  <div>
                    {/* <Typography className={classes.instructions}> */}
                    {getStepContent(activeStep)}
                    {/* </Typography> */}
                  </div>
                )}
              </Box>
            </div>
          </Card>
        )}
        {value === 1 && (
          <>
            <Card
              sx={{
                width: {
                  md: "80%",
                  sm: "90%",
                  xs: "100%",
                },
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
                borderRadius: "20px",
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <ManageElection
                  elections={elections}
                  refreshTable={getElectionByCreater}
                />
              </div>
            </Card>
          </>
        )}
      </Box>
    </>
  );
}

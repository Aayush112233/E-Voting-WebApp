import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Grid,
  IconButton,
  Tabs,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import Tab from "@mui/material/Tab";
import ElectionDetails from "./ElectionDetails";
import PostionDetails from "./PostionDetails";
import ManageCandidate from "./ManageCandidate";
import VoterSection from "./VoterSection";
import { useState } from "react";
import { API } from "../../../baseUrlProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    md: "60%",
    xs: "90%",
  },
  maxHeight: "95vh",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#fff",
  color: "#000",
  borderRadius: "20px",
  padding: "30px 30px 70px",
  //   pointerEvents: "none",
  outline: "none",
  opacity: 0,
  transition: "opacity 250ms 700ms ease",
};
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ElectionView = ({ open, setOpen, election, refreshTable }) => {
  const [value, setValue] = React.useState(0);
  const [electionDetails, setElectionDetails] = useState({
    id: "",
    electionEndDate: "",

    electionName: "",

    electionStartDate: "",

    organizationName: "",
  });

  const [voter, setVoter] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(election);
    setElectionDetails({
      id: election._id,
      electionEndDate: election.electionEndDate,

      electionName: election.electionName,

      electionStartDate: election.electionStartDate,

      organizationName: election.organizationName,
    });
  }, [election]);

  useEffect(() => {
    if (election && election.isVoter) {
      getVoters()
    }
  }, [election]);

  const getVoters = () => {
    API.get(`election/getVotersByElection/${election._id}`)
      .then((res) => {
        setVoter(res.data.voters.voters);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setValue(0)
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
            <Grid container justifyContent={"center"}>
              <Typography variant="h5">{election.electionName}</Typography>
            </Grid>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Election Details" {...a11yProps(0)} />
                <Tab label="Position Details" {...a11yProps(1)} />
                <Tab label="Candidate Details" {...a11yProps(2)} />
                <Tab label="Voters Section" {...a11yProps(3)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ElectionDetails
                electionDetails={electionDetails}
                refreshTable={refreshTable}
                setOpen={setOpen}
              />
            </TabPanel>
            <TabPanel
              value={value}
              index={1}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
              <PostionDetails
                positionDetails={election?.position}
                id={election?._id}
                refreshTable={refreshTable}
                setOpen={setOpen}
              />
            </TabPanel>
            <TabPanel
              value={value}
              index={2}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
              <ManageCandidate
                candidateDetails={election?.candidate}
                electionId={election?._id}
                positionDetails={election.position}
                refreshTable={refreshTable}
                setOpen={setOpen}
              />
            </TabPanel>
            <TabPanel
              value={value}
              index={3}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            >
              <VoterSection
                id={election._id}
                refreshTable={getVoters}
                setOpen={setOpen}
              />
            </TabPanel>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ElectionView;

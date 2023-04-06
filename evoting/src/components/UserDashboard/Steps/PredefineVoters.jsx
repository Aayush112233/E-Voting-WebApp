import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import * as XLSX from "xlsx";
import { ElectionAddSchema } from "../../../Validation/formValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  DefineVoterServices,
  StepperService,
} from "../../../Services/stepperServices";
import { useEffect } from "react";
import { FaFileExcel } from "react-icons/fa";
import ExcelExample from "../../../assets/images/ExcelExample.PNG";
import { useState } from "react";
import { Preview } from "@mui/icons-material";

const PreDefineVoters = ({
  activeStep,
  handleBack,
  handleNext,
  handleSkip,
  classes,
  steps,
}) => {
  const srcset = (image, width, height, rows = 1, cols = 1) => {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${
        height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  };
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.stepperState);
  const [voters, setVoters] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(null);
  const [file, setFile] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "50%",
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
    // opacity: 0,
    // transition: "opacity 250ms 700ms ease",
  };

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const cleanedJson = json.filter(
        (row) => row.some((val) => !!val) // Check if the row has at least one non-empty value
      );
      const voterIds = new Set();
      const voterEmails = new Set();
      const duplicates = [];

      // Check for duplicate voterId and voterEmail
      cleanedJson.forEach((row, index) => {
        const [voterId, voterName, voterEmail] = row;
        if (voterIds.has(voterId)) {
          duplicates.push(`Duplicate voterId at row ${index + 1}: ${voterId}`);
        } else {
          voterIds.add(voterId);
        }
        if (voterEmails.has(voterEmail)) {
          duplicates.push(
            `Duplicate voterEmail at row ${index + 1}: ${voterEmail}`
          );
        } else {
          voterEmails.add(voterEmail);
        }
      });
      if (duplicates.length > 0) {
        alert("Unable to upload, Validation Failure");
        setFile("");
        return;
      }
      const voters = cleanedJson.slice(1).map((row) => ({
        voterId: row[0],
        voterName: row[1],
        voterEmail: row[2],
      }));

      setVoters(voters);
    };

    reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    if (formData.voters?.length > 0) {
      setVoters(formData.voters);
    }
  }, [formData.voters, formData]);

  const handleForm = (data) => {
    dispatch(DefineVoterServices(voters));
    handleNext();
  };

  useEffect(() => {
    if (formData.voters?.length > 0) {
      setVoters(formData.voters);
    }
  }, []);

  return (
    <Box sx={{ width: 1 }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} display="flex">
          <Button
            startIcon={<FaFileExcel style={{ position: "relative" }} />}
            variant="outlined"
            component="label"
          >
            Upload
            <input
              value={file}
              hidden
              type="file"
              onChange={handleFileUpload}
            />
          </Button>
          {voters ? (
            <Button
              startIcon={<Preview style={{ position: "relative" }} />}
              variant="outlined"
              onClick={() => {
                setPreviewOpen(true);
              }}
              component="label"
              sx={{ ml: 3 }}
            >
              Preview Voters
            </Button>
          ) : null}
        </Grid>
        <Grid item xs={12}>
          <Alert
            sx={{
              position: "relative",
              "& .MuiAlert-icon": {
                position: "relative",
                top: 6,
                right: 10,
              },
            }}
            severity="info"
          >
            You are allowed to upload a excel sheet to define the voters. Refer
            to the excel sheet given below to be properly validate your excel.
          </Alert>
        </Grid>
        <Grid item xs={12} sx={{ margin: "auto" }}>
          <img
            {...srcset(ExcelExample, 250, 200)}
            style={{ margin: "auto" }}
            alt={"Excel Example"}
            loading="lazy"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={handleSkip}
            className={classes.button}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            color="primary"
            // onClick={handleElection(handleNext)}
            onClick={handleForm}
            // className={classes.button}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Grid>
        <Modal
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h2"
              fontWeignt="bold"
            >
              Voter List
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ width: "100%", overflow: "auto" }}
            >
              <Table sx={{ width: 1 }} stickyHeader aria-label="sticky table">
                <TableHead style={{ backgroundColor: "#0c435c" }}>
                  <TableRow sx={{ color: "white" }}>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                    >
                      S.N
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Voter Id
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Voter Name
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Voter Email
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voters?.map((item, index) => {
                    const sn = index + 1;
                    return (
                      <>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="center">{sn}</TableCell>
                          <TableCell align="center">
                            {item.voterId}
                          </TableCell>
                          <TableCell align="center">
                            {item.voterName}
                          </TableCell>
                          <TableCell align="center">
                            {item.voterEmail}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </Grid>
    </Box>
  );
};

export default PreDefineVoters;

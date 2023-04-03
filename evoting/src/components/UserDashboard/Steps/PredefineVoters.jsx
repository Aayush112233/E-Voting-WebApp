import { Alert, Box, Button, Grid, TextField } from "@mui/material";
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
  const [file, setFile] = useState("");


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
        alert("Unable to upload, Validation Failure")
        setFile("")
        return;
      }
  
      setVoters(voters);
    };
  
    reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    if (formData.voters?.length > 0) {
      setVoters(formData.voters);
    }
  }, [formData.voters]);

  const handleForm = (data) => {
    dispatch(DefineVoterServices(voters));
    handleNext();
  };

  return (
    <Box sx={{ width: 1 }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12}>
          <Button
            startIcon={<FaFileExcel style={{ position: "relative" }} />}
            variant="outlined"
            component="label"
          >
            Upload
            <input value={file} hidden type="file" onChange={handleFileUpload} />
          </Button>
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
      </Grid>
    </Box>
  );
};

export default PreDefineVoters;

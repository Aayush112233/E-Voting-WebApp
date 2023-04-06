import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { ElectionAddSchema } from "../../../Validation/formValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { StepperService } from "../../../Services/stepperServices";
import { useEffect } from "react";
import Loader from "../../../Reusables/Loader";
const ElectionDetails = ({
  activeStep,
  handleBack,
  handleNext,
  classes,
  steps,
}) => {
  const dispatch = useDispatch();
  const { formData } = useSelector((state) => state.stepperState);
  const {
    register: election,
    handleSubmit: handleElection,
    formState: { errors: electionError },
    setValue,
  } = useForm({
    resolver: yupResolver(ElectionAddSchema),
  });

  const handleForm = (data) => {
    dispatch(StepperService(data));
    handleNext();
  };

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setValue("electionName", formData.electionName);
      setValue("electionStartDate", formData.electionStartDate);
      setValue("electionEndDate", formData.electionEndDate);
      setValue("organizationName", formData.organizationName);
    }
    else{
      setValue("electionName", "");
      setValue("electionStartDate", "");
      setValue("electionEndDate", "");
      setValue("organizationName", "");
    }
  }, [formData]);

  console.log("The form data", formData)
  return (
    <Box sx={{ width: 1 }}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!!electionError.electionName}
            helperText={
              electionError.electionName
                ? electionError.electionName.message
                : ""
            }
            {...election("electionName")}
            name="electionName"
            id="standard-basic"
            label="Election Name"
            InputLabelProps={{
              shrink: formData && "true",
            }}
            variant="standard"
            firstName
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!!electionError.electionStartDate}
            helperText={
              electionError.electionStartDate
                ? electionError.electionStartDate.message
                : ""
            }
            {...election("electionStartDate")}
            name="electionStartDate"
            type="datetime-local"
            id="standard-basic"
            label="Election Start Date"
            InputLabelProps={{
              shrink: "true",
            }}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!!electionError.electionEndDate}
            helperText={
              electionError.electionEndDate
                ? electionError.electionEndDate.message
                : ""
            }
            {...election("electionEndDate")}
            id="standard-basic"
            name="electionEndDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: "true",
            }}
            label="Election End Date"
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="standard-basic"
            error={!!electionError.organizationName}
            helperText={
              electionError.organizationName
                ? electionError.organizationName.message
                : ""
            }
            {...election("organizationName")}
            name="organizationName"
            label="Organization Name"
            InputLabelProps={{
              shrink: formData && "true",
            }}
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            // onClick={handleElection(handleNext)}
            onClick={handleElection(handleForm)}
            // className={classes.button}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ElectionDetails;

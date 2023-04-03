import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { ElectionUpdateSchema } from "../../../Validation/formValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { API } from "../../../baseUrlProvider";
import { toast } from "react-toastify";

const ElectionDetails = ({ electionDetails, refreshTable, setOpen}) => {
  const {
    register: election,
    handleSubmit: handleElection,
    formState: { errors: electionError },
    setValue,
  } = useForm({
    resolver: yupResolver(ElectionUpdateSchema),
  });

  useEffect(() => {
    if (Object.keys(electionDetails).length > 0) {
      setValue("electionName", electionDetails.electionName);
      setValue("electionStartDate", electionDetails.electionStartDate);
      setValue("electionEndDate", electionDetails.electionEndDate);
      setValue("organizationName", electionDetails.organizationName);
    }
  }, [electionDetails]);

  console.log(electionDetails)
  const handleForm = (data) => {
    API.put("/election/updateElectionDetails/"+electionDetails.id, data).then((res)=>{
      toast.success(res.data.message)
      refreshTable()
      setOpen(false)
    }).catch((err)=>{
      toast.success(err.response.data.message)
    })
  };
  return (
    <Box sx={{ width: 1 }}>
      <Grid
        container
        spacing={2}
        sx={{ width: "100%" }}
        justifyContent={"center"}
      >
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
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleElection(handleForm)}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ElectionDetails;

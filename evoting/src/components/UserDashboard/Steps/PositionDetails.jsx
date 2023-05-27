import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TableBody,
  Alert,
} from "@mui/material";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiTwotoneDelete } from "react-icons/ai";
import { GrAdd } from "react-icons/gr";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { PositionServices } from "../../../Services/stepperServices";
import { Stack } from "@mui/system";
import { PositionAddSchema } from "../../../Validation/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";

const PositionDetails = ({
  activeStep,
  handleBack,
  handleNext,
  classes,
  steps,
}) => {
  const [positions, setPositions] = useState([]);
  const [isPositionRepeat, setPositionRepeat] = useState(false);
  const { formData } = useSelector((state) => state.stepperState);
  const [backgroundColor, setBackgroundColor] = useState("white");

  const styles = {
    backgroundColor: backgroundColor,
    transition: "background-color 0.5s ease",
    maxHeight: "300px",
    overflow: "auto",
    maxWidth:"100%"
  };
  const {
    register: position,
    handleSubmit: handlePosition,
    formState: { errors: positionError },
    setValue,
  } = useForm({
    resolver: yupResolver(PositionAddSchema),
  });
  const dispatch = useDispatch();
  const handleTextChange = () => {
    setPositionRepeat(false);
  };

  useEffect(() => {
    if (formData.position?.length > 0) {
      setPositions(formData.position);
    }
  }, [formData.position]);

  const handleSaveToTable = (data) => {
    var existingPosition = positions?.filter(
      (item) => item.positionName === data.positionName
    );
    if (existingPosition.length > 0) {
      setPositionRepeat(true);
      return;
    }
    setPositions([...positions, { ...data }]);
  };

  const NoRows = () => {
    if (positions.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                sx={{
                  position: "relative",
                  "& .MuiAlert-icon": {
                    position: "relative",
                    top: 6,
                    right: 10,
                    marginRight: "20px",
                  },
                }}
                severity="info"
              >
                No Data
              </Alert>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
  };

  const deleteRow = (item) => {
    const newTable = positions?.filter(
      (i) => i.positionName !== item.positionName
    );
    setPositions(newTable);
  };

  const handlePositionAdd = () => {
    if (positions?.length > 0) {
      dispatch(PositionServices(positions));
      handleNext();
    } else {
      setBackgroundColor("red");
      setTimeout(() => {
        setBackgroundColor("white");
      }, 300);
    }
  };
  return (
    <>
      <Box sx={{ width: 1, position: "relative" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid item xs={12} sm={5}>
            <TextField
              error={!!positionError.positionName}
              helperText={
                positionError.positionName
                  ? positionError.positionName.message
                  : ""
              }
              {...position("positionName")}
              name="positionName"
              onChange={(e) => {
                handleTextChange(e);
              }}
              id="standard-basic"
              label="Position Name"
              variant="standard"
              firstName
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              error={!!positionError.positionDescription}
              helperText={
                positionError.positionDescription
                  ? positionError.positionDescription.message
                  : ""
              }
              {...position("positionDescription")}
              name="positionDescription"
              id="standard-basic"
              label="Position Description"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <Button
              variant="contained"
              sx={{ maxWidth: { sm: "70%", xs: "100%" } }}
              onClick={handlePosition(handleSaveToTable)}
            >
              <GrAdd style={{ position: "relative" }} />
            </Button>
          </Grid>
        </Grid>
        {isPositionRepeat ? (
          <Alert
            sx={{
              position: "relative",
              mt: 2,
              "& .MuiAlert-icon": {
                position: "relative",
                top: 6,
                right: 10,
              },
            }}
            severity="error"
          >
            You are not allowed to enter a same position to the table
          </Alert>
        ) : null}

        <Grid container mt={2}>
          <TableContainer component={Paper} sx={styles}>
            <Table
              sx={{ minWidth: 1 }}
              stickyHeader
              aria-label="sticky table"
            >
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
                    Position Name
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", backgroundColor: "#0c435c" }}
                    align="center"
                  >
                    Position Description
                  </TableCell>
                  <TableCell
                    sx={{ color: "white", backgroundColor: "#0c435c" }}
                    align="center"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions?.map((item, index) => {
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
                          {item.positionName}
                        </TableCell>
                        <TableCell align="center">
                          {item.positionDescription}
                        </TableCell>
                        <TableCell align="center">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {/* <AiTwotoneEdit
                              style={{
                                position: "relative",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                            /> */}
                            <AiTwotoneDelete
                              style={{
                                position: "relative",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteRow(item);
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
                <NoRows />
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <div style={{ marginTop: "20px" }}>
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
            onClick={handlePositionAdd}
            className={classes.button}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </Box>
    </>
  );
};

export default PositionDetails;

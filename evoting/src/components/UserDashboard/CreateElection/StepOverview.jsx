import {
  Box,
  Grid,
  styled,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TableBody,
  Button,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SuccessFullTick from "../../../Reusables/SuccessFullTick";
import { SubmitServices } from "../../../Services/stepperServices";
import Loader from "../../../Reusables/Loader";
const StepOverview = ({ GoBack, setStepper }) => {
  const { formData, isSubmitted, isLoading } = useSelector(
    (state) => state.stepperState
  );
  const [isCompleted, setCompleted] = useState(isSubmitted);
  const [isLoad, setisLoad] = useState(isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const styles = {
    transition: "background-color 0.5s ease",
    maxHeight: "300px",
    overflow: "auto",
  };

  useEffect(() => {
    setCompleted(isSubmitted);
    setisLoad(isLoading)
  }, [isSubmitted,isLoading]);

  const Div = styled("div")(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: "#DBEAFE",
    color: "#213E8C",
    padding: theme.spacing(1),
  }));

  const handleElectionSubmit = () => {
    dispatch(SubmitServices(formData));
    setStepper(false);
  };
  return (
    <>
      <Box
        sx={{
          maxHeight: "400px",
          overflow: "auto",
        }}
      >
        <Box sx={{ display: isCompleted ? "none" : "block" }}>
          <Grid container>
            <Typography variant="h5" color="GrayText">
              Election Information
            </Typography>
          </Grid>
          <Grid container mt={2} spacing={2}>
            <Grid item xs={12}>
              <Div>
                <span style={{ fontWeight: "bold" }}>Election Name : </span>
                {formData.electionName}
              </Div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Div>
                <span style={{ fontWeight: "bold" }}>Start Date : </span>
                {formData.electionStartDate}
              </Div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Div>
                <span style={{ fontWeight: "bold" }}>End Date : </span>
                {formData.electionEndDate}
              </Div>
            </Grid>
            <Grid item xs={12} md={5}>
              <Div>
                <span style={{ fontWeight: "bold" }}>
                  Maximum No.of Votes :{" "}
                </span>
                {formData.maxVotes}
              </Div>
            </Grid>
            <Grid item xs={12} md={7}>
              <Div>
                <span style={{ fontWeight: "bold" }}>
                  Organization Information :{" "}
                </span>
                {formData.organizationName}
              </Div>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Typography variant="h5" color="GrayText">
              Position For Election
            </Typography>
          </Grid>
          <Grid container mt={2}>
            <Grid container mt={2}>
              <TableContainer component={Paper} sx={styles}>
                <Table
                  sx={{ minWidth: 650 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead style={{ backgroundColor: "#0c435c" }}>
                    <TableRow sx={{ color: "white" }}>
                      <TableCell
                        sx={{ color: "#213E8C", backgroundColor: "#DBEAFE" }}
                      >
                        S.N
                      </TableCell>
                      <TableCell
                        sx={{ color: "#213E8C", backgroundColor: "#DBEAFE" }}
                        align="center"
                      >
                        Position Name
                      </TableCell>
                      <TableCell
                        sx={{ color: "#213E8C", backgroundColor: "#DBEAFE" }}
                        align="center"
                      >
                        Position Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.position?.map((item, index) => {
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
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid container mt={2}>
            <Typography variant="h5" color="GrayText">
              Candidates for Election
            </Typography>
          </Grid>
          <Grid container mt={2} mb={2}>
            <Grid container mt={2}>
              <TableContainer component={Paper} sx={styles}>
                <Table
                  sx={{ minWidth: 650 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead style={{ backgroundColor: "#0c435c" }}>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                    >
                      S.N
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Candidate Name
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", backgroundColor: "#0c435c" }}
                      align="center"
                    >
                      Position
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {formData.candidate?.map((item, index) => {
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
                              {item.candidateName}
                            </TableCell>
                            <TableCell align="center">
                              {item.candidateAddress}
                            </TableCell>
                            <TableCell align="center">
                              {item.candidateEmail}
                            </TableCell>
                            <TableCell align="center">
                              {item.candidatePhone}
                            </TableCell>
                            <TableCell align="center">
                              {item.candidatePosition}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: isCompleted ? "flex" : "none",
            minHeight: "100px",
            justifyContent: "center",
          }}
        >
          <SuccessFullTick
            isCompleted={isCompleted}
            message={"Election Created Successfully"}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "10px",
          gap: "1rem",
        }}
      >
        {isCompleted ? (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/users");
                setStepper(true);
                setCompleted(false)
              }}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            {isLoad ? (
              <Loader />
            ) : (
              <>
                <Button variant="outlined" onClick={GoBack}>
                  Edit Infomation
                </Button>
                <Button variant="outlined" onClick={handleElectionSubmit}>
                  Create Eletion
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default StepOverview;

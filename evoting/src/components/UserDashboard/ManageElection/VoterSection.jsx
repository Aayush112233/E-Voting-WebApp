import React, { useEffect } from "react";
import { API } from "../../../baseUrlProvider";
import * as XLSX from "xlsx";

import { toast } from "react-toastify";
import {
  Alert,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { VoterAddSchema } from "../../../Validation/formValidation";
import { yupResolver } from "@hookform/resolvers/yup";

import { GrAdd } from "react-icons/gr";
import { AiTwotoneDelete } from "react-icons/ai";
import { useState } from "react";
import { FaFileExcel } from "react-icons/fa";

const VoterSection = ({ id, setOpen, refreshTable }) => {
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [voterDetails, setVoterDetails] = useState(null);
  const [voterRepeat, setVoterRepeat] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState([]);
  const [errorKey, setErrorKey] = useState(0);
  const [file, setFile] = useState("");

  const {
    register: voterValidation,
    handleSubmit: handleVoter,
    formState: { errors: voterError },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(VoterAddSchema),
  });
  const styles = {
    backgroundColor: backgroundColor,
    transition: "background-color 0.5s ease",
    maxHeight: "400px",
    overflow: "auto",
    maxWidth: "100%",
  };

  useEffect(()=>{
    API.get(`election/getVotersByElection/${id}`)
    .then((res) => {
      setVoterDetails(res.data.voters.voters);
    })
    .catch((err) => {
      console.log(err);
    });
  },[])
  const getVoters = () => {
    
  };

  const handleSaveToTable = async (data) => {
    setVoterRepeat(false);
    setDuplicate([]);
    var existingVoterId = voterDetails?.filter(
      (item) => item.voterId === data.voterId
    );
    var existingVoterEmail = voterDetails?.filter(
      (item) => item.voterEmail === data.voterEmail
    );
    if (existingVoterId.length > 0) {
      setVoterRepeat(true);
      setDuplicate([
        ...duplicate,
        `This voter Id already belongs to ${existingVoterId[0].voterName}`,
      ]);
      setFile("")
      return;
    }
    if (existingVoterEmail.length > 0) {
      setVoterRepeat(true);
      setDuplicate([
        ...duplicate,
        `This voter Email already belongs to ${existingVoterEmail[0].voterName}`,
      ]);
      setFile("")
      return;
    }
    setFile("")
    setVoterDetails([...voterDetails, { ...data }]);
    setDuplicate([]);
    setVoterRepeat(false);
  };
  const NoRows = () => {
    if (voterDetails?.length === 0 || voterDetails == null) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
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

  const handleFileUpload = (event) => {
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
        setDuplicate(duplicates);
        setVoterRepeat(true);
        setErrorKey(errorKey + 1);
        return;
      }

      const voters = cleanedJson.slice(1).map((row) => ({
        voterId: row[0],
        voterName: row[1],
        voterEmail: row[2],
      }));

      setVoterDetails(voters);
    };

    reader.readAsArrayBuffer(file);
  };

  const updatePosition = () => {
    const data = {
      voters: voterDetails,
    };
    API.put("/election/updateVoters/" + id, data)
      .then((res) => {
        toast.success(res.data.message);
        refreshTable();
        setOpen(false);
      })
      .catch((err) => {
        toast.success(err.response.data.message);
      });
  };

  const deleteRow = (item) => {
    const newTable = voterDetails?.filter((i) => i.voterId !== item.voterId);
    setVoterDetails(newTable);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" textAlign={"center"}>
            Election Voters
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          startIcon={<FaFileExcel style={{ position: "relative" }} />}
          variant="outlined"
          component="label"
          onClick={() => {
            setVoterRepeat(false);
          }}
        >
          Upload New Excel
          <input
            key={errorKey}
            hidden
            value={file}
            type="file"
            onChange={handleFileUpload}
          />
        </Button>
      </Grid>
      <Grid container spacing={2} sx={{ width: "100%" }} mt={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            error={!!voterError.voterId}
            helperText={voterError.voterId ? voterError.voterId.message : ""}
            {...voterValidation("voterId")}
            name="voterId"
            id="standard-basic"
            label="Voter Id"
            variant="standard"
            firstName
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            error={!!voterError.voterName}
            helperText={
              voterError.voterName ? voterError.voterName.message : ""
            }
            {...voterValidation("voterName")}
            name="voterName"
            id="standard-basic"
            label="Voter Name"
            variant="standard"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            error={!!voterError.voterEmail}
            helperText={
              voterError.voterEmail ? voterError.voterEmail.message : ""
            }
            {...voterValidation("voterEmail")}
            name="voterEmail"
            id="standard-basic"
            label="Voter Email"
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
            onClick={handleVoter(handleSaveToTable)}
          >
            <GrAdd style={{ position: "relative" }} />
          </Button>
        </Grid>
      </Grid>
      {voterRepeat ? (
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
          <Typography>
            {duplicate?.map((duplicate) => (
              <div key={duplicate}>{duplicate}</div>
            ))}
            Please fix these duplicates and upload again.
          </Typography>
        </Alert>
      ) : null}
      <Grid container mt={2}>
        <TableContainer component={Paper} sx={styles}>
          <Table sx={{ minWidth: 1 }} stickyHeader aria-label="sticky table">
            <TableHead style={{ backgroundColor: "#0c435c" }}>
              <TableRow sx={{ color: "white" }}>
                <TableCell sx={{ color: "white", backgroundColor: "#0c435c" }}>
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
                  Email
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
              {voterDetails?.map((item, index) => {
                const sn = index + 1;
                return (
                  <>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="center">{sn}</TableCell>
                      <TableCell align="center">{item.voterId}</TableCell>
                      <TableCell align="center">{item.voterName}</TableCell>
                      <TableCell align="center">{item.voterEmail}</TableCell>
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
        <Grid item xs={12} mt={3} display={"flex"} justifyContent="center">
          <Button
            variant="contained"
            component="label"
            onClick={updatePosition}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default VoterSection;

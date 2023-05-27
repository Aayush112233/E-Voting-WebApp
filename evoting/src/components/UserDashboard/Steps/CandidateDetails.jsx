import React from "react";
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
  Stack,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { CandidateAddSchema } from "../../../Validation/formValidation";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GrAdd } from "react-icons/gr";
import { FaFileImage } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import ImageUploading from "react-images-uploading";
import { cropImage } from "../../../config/cropUtils.js";
import Cropper from "react-easy-crop";
import { CandidateServices } from "../../../Services/stepperServices";
import { PhotoCamera } from "@mui/icons-material";
import InfoModel from "../../../Reusables/InfoModel";

const ImageUploadingButton = ({ value, onChange, ...props }) => {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({ onImageUpload, onImageUpdate }) => (
        <>
          <Button
            variant="outlined"
            style={{
              "&.MuiButton-endIcon": {
                position: "relative",
                backgroundColor: "red",
              },
            }}
            endIcon={<PhotoCamera sx={{ position: "relative" }} />}
            onClick={value ? onImageUpload : () => onImageUpdate(0)}
            {...props}
          >
            Upload Image
          </Button>
        </>
      )}
    </ImageUploading>
  );
};

const ImageCropper = ({
  open,
  image,
  onComplete,
  containerStyle,
  handleSubmit,
  ...props
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Crop Image</DialogTitle>

      <DialogContent>
        <div style={containerStyle}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={(_, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels);
            }}
            onZoomChange={setZoom}
            {...props}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={() =>
            onComplete(cropImage(image, croppedAreaPixels, handleSubmit))
          }
        >
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CandidateDetails = ({
  activeStep,
  handleBack,
  handleNext,
  classes,
  steps,
}) => {
  const [candidates, setCandidate] = useState([]);
  const [isCandidateRepeat, setCandidateRepeat] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [info, setInfo] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState({});
  const [error, setError] = useState(false)

  const styles = {
    backgroundColor: backgroundColor,
    transition: "background-color 0.5s ease",
    // maxHeight: "300px",
    overflow: "auto",
    maxWidth:"100%"
  };
  const { formData } = useSelector((state) => state.stepperState);
  const {
    register: candidate,
    handleSubmit: handleCandidate,
    formState: { errors: candidateError },
    setValue,
  } = useForm({
    resolver: yupResolver(CandidateAddSchema),
  });

  useEffect(() => {
    if (formData.candidate?.length > 0) {
      setCandidate(formData.candidate);
    }
  }, [formData.candidate]);

  const dispatch = useDispatch();
  const handleSaveToTable = (data) => {
    if(preview === null || preview === "" || preview == undefined){
      setError(true)
      return
    }

    var existingCandidate = candidates?.filter(
      (item) =>
        item.candidateEmail === data.candidateEmail ||
        item.candidatePhone === data.candidatePhone
    );
    if (existingCandidate.length > 0) {
      setCandidateRepeat(true);
      return;
    }
    const updatedData = {
      ...data,
      candidateImage: preview,
    };
    setCandidate([...candidates, updatedData]);
    setValue("candidateAddress", "");
    setValue("candidateEmail", "");
    setValue("candidatePhone", "");
    setValue("candidateName", "");
    setValue("candidateAddress", "");
    setValue("candidateDescription", "");
    setPreview("");
  };
  // const readExcelFile = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsArrayBuffer(file);

  //     fileReader.onload = (e) => {
  //       const bufferArray = e.target.result;

  //       const wb = read(bufferArray, { type: "buffer" });

  //       const wsname = wb.SheetNames[0];
  //       const ws = wb.Sheets[wsname];

  //       const data = utils.sheet_to_json(ws);

  //       resolve(data);
  //     };

  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };

  const deleteRow = (item) => {
    const newTable = candidates?.filter(
      (i) => i.candidateName !== item.candidateName
    );
    setCandidate(newTable);
  };

  const handleSubmit = async (image) => {
    setPreview(image);
  };

  const handleViewTableImage = (item) => {
    setCurrentCandidate(item);
    setInfo(true)
  };

  const handleAddCandidate = () => {
    if (candidates.length > 0) {
      dispatch(CandidateServices(candidates));
      handleNext();
    } else {
      setBackgroundColor("red");
      setTimeout(() => {
        setBackgroundColor("white");
      }, 300);
    }
  };

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const result = await readExcelFile(file);
  //   setData(result);
  // };z
  const NoRows = () => {
    if (candidates.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8}>
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
  return (
    <>
      <Box sx={{ width: 1 }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {/* <Grid item xs={12} sm={6}>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <Button component="span" variant="contained">
                Upload Excel File
              </Button>
            </label>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidateName}
              helperText={
                candidateError.candidateName
                  ? candidateError.candidateName.message
                  : ""
              }
              {...candidate("candidateName")}
              name="candidateName"
              id="standard-basic"
              label="Candidate Name"
              variant="standard"
              firstName
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidateAddress}
              helperText={
                candidateError.candidateAddress
                  ? candidateError.candidateAddress.message
                  : ""
              }
              {...candidate("candidateAddress")}
              name="candidateAddress"
              id="standard-basic"
              label="Candidate Address"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidateEmail}
              helperText={
                candidateError.candidateEmail
                  ? candidateError.candidateEmail.message
                  : ""
              }
              {...candidate("candidateEmail")}
              id="standard-basic"
              name="candidateEmail"
              label="Candidate Email"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidatePhone}
              helperText={
                candidateError.candidatePhone
                  ? candidateError.candidatePhone.message
                  : ""
              }
              {...candidate("candidatePhone")}
              id="standard-basic"
              name="candidatePhone"
              label="Phone Number"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidateDescription}
              helperText={
                candidateError.candidateDescription
                  ? candidateError.candidateDescription.message
                  : ""
              }
              {...candidate("candidateDescription")}
              id="standard-basic"
              name="candidateDescription"
              label="Description"
              variant="standard"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              error={!!candidateError.candidatePosition}
              helperText={
                candidateError.candidatePosition
                  ? candidateError.candidatePosition.message
                  : ""
              }
              {...candidate("candidatePosition")}
              id="standard-select-currency"
              select
              label="Select a Position"
              defaultValue={formData.position[0].positionName}
              name="candidatePosition"
              variant="standard"
              sx={{
                "& .MuiSvgIcon-root": {
                  position: "relative",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            >
              {formData.position.map((option, index) => (
                <MenuItem
                  key={option.positionName}
                  value={option.positionName}
                  selected={index === 0}
                >
                  {option.positionName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3} alignItems={"center"} display={"flex"}>
            <ImageUploadingButton
              value={image}
              onChange={(newImage) => {
                setError(false)
                setDialogOpen(true);
                setImage(newImage);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              onClick={handleCandidate(handleSaveToTable)}
              endIcon={<GrAdd style={{ position: "relative", color:"white" }} />}
            >
              Add to table
            </Button>
          </Grid>
        </Grid>
        {isCandidateRepeat ? (
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
            Candidate already exists. Name, Email and Phone Number must be
            unique.
          </Alert>
        ) : null}
        {error ? (
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
            Please Upload an Image of the candidate.
            You can also preview it after adding to the table.
          </Alert>
        ) : null}

        <Grid container mt={2}>
          <TableContainer component={Paper} sx={styles}>
            <Table
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
                  <TableCell
                    sx={{ color: "white", backgroundColor: "#0c435c" }}
                    align="center"
                  >
                    Image
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
                {candidates?.map((item, index) => {
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
                        <TableCell align="center">
                          <FaFileImage
                            style={{ position: "relative", cursor: "pointer" }}
                            onClick={() => {
                              handleViewTableImage(item);
                            }}
                          />
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
        <ImageCropper
          open={dialogOpen}
          image={image.length > 0 && image[0].dataURL}
          handleSubmit={handleSubmit}
          onComplete={(imagePromisse) => {
            imagePromisse.then((image) => {
              setPreview(image);
              setDialogOpen(false);
            });
          }}
          containerStyle={{
            position: "relative",
            width: "100%",
            height: 300,
            background: "#333",
          }}
        />
        <InfoModel info={info} setInfo={setInfo} candidate={currentCandidate} />

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
            onClick={handleAddCandidate}
            className={classes.button}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </Box>
    </>
  );
};

export default CandidateDetails;

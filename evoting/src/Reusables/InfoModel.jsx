import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import React from "react";

const InfoModel = ({ setInfo, info, candidate }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "400px",
      xs: "90%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "start",

    backgroundColor: "#fff",
    justifyContent: "between",
    color: "#000",
    textAlign: "start",
    borderRadius: "20px",
    padding: "20px 20px 30px",
    //   pointerEvents: "none",
    outline: "none",
    opacity: 0,
    transition: "opacity 250ms 700ms ease",
  };
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={info}
        onClose={() => {
          setInfo(false);
        }}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={info}>
          <Box sx={style}>
            <img
              src={candidate?.candidateImage}
              style={{
                width: "100%",
                height: "auto",
                margin:"auto",
                padding:"10px",
                borderRadius: "20px",
              }}
            ></img>
            <div style={{marginTop:"10px", marginLeft:"10px"}}>
            <Typography id="transition-modal-title" variant="h6" >
              <span style={{fontWeight:"bold"}}>Name : </span> <span style={{color:"GrayText"}}>{candidate.candidateName}</span>
            </Typography>
            <Typography id="transition-modal-title" variant="h6">
            <span style={{fontWeight:"bold"}}>Address : </span> <span style={{color:"GrayText"}}>{candidate.candidateAddress}</span>
            </Typography>
            <Typography id="transition-modal-title" variant="h6">
            <span style={{fontWeight:"bold"}}>Position : </span> <span style={{color:"GrayText"}}>{candidate.candidatePosition}</span>
            </Typography>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                marginTop: "20px",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  setInfo(false);
                }}
              >
                Close
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default InfoModel;

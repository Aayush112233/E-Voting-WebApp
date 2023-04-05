import React from "react";
import Modal from "@mui/material/Modal";
import { IoMdClose } from "react-icons/io";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Fade,
  Grid,
  IconButton,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { ReplyAllSharp } from "@mui/icons-material";
import { Reply } from "./Reply";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    sm: "600px",
    xs: "90%",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#fff",
  color: "#000",
  textAlign: "start",
  borderRadius: "20px",
  padding: "30px 30px 70px",
  //   pointerEvents: "none",
  outline: "none",
  opacity: 0,
  transition: "opacity 250ms 700ms ease",
};

const ViewInquiry = ({ open, setOpen, selectedInquiry }) => {
  const [isReply, setReply] = useState(false);

  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
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
              onClick={handleClose}
            >
              <IoMdClose />
            </IconButton>
            <Typography
              id="modal-modal-title"
              fontWeight={"bold"}
              variant="h5"
              color={"gray"}
              component="h2"
            >
              Inquiry From {selectedInquiry?.fullName}
            </Typography>
            {isReply ? (
              <Reply setOpen={setOpen} selectedInquiry={selectedInquiry} setReply={setReply} />
            ) : (
              <Box>
                <Grid container mt={2} spacing={2}>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    gap="1rem"
                    alignItems={"center"}
                  >
                    <Typography variant="h6"> Email :</Typography>{" "}
                    <span style={{ color: "gray", fontSize: "20px" }}>
                      {selectedInquiry?.email}
                    </span>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display={"flex"}
                    gap="0.5rem"
                    sx={{
                        wordBreak:"break-word"
                    }}
                  >
                    <Typography variant="h6" minWidth={"110px"}> Message :</Typography>{" "}
                    <span style={{ color: "gray", fontSize: "20px" }}>
                      {selectedInquiry?.message}
                    </span>
                  </Grid>
                  <Grid item xs={12} display={"flex"} justifyContent={"end"}>
                    <Button
                      variant="outlined"
                      style={{
                        "&.MuiButton-endIcon": {
                          position: "relative",
                          backgroundColor: "red",
                        },
                      }}
                      onClick={() => {
                        setReply(true);
                      }}
                      endIcon={<ReplyAllSharp sx={{ position: "relative" }} />}
                    >
                      Reply
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ViewInquiry;

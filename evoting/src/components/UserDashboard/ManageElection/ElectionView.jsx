import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Backdrop,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    sm: "60%",
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
  opacity: 0,
  transition: "opacity 250ms 700ms ease",
};

const ElectionView = ({ open, setOpen, election }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
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
              onClick={() => {
                setOpen(false);
              }}
            >
              <IoMdClose />
            </IconButton>
            <Grid container justifyContent={"center"}>
              <Typography variant="h5">{election.electionName}</Typography>
            </Grid>

            <Grid container justifyContent={"center"}>
              <Grid item xs={12} sm={6} md={4}>
                    
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ElectionView;

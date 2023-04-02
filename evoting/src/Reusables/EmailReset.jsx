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
import axios from "axios";
import { toast } from "react-toastify";

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

export default function EmailReset({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [email, setEmail] = React.useState("");
  const [isEmailValid, setEmailValid] = React.useState(true);
  useEffect(() => {
    style.opacity = 1;
  }, [open]);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setEmailValid(false);
      return;
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/sendResetEmail`, {
        email: email,
      })
      .then((res) => {
        toast.success(res.data.message);
        handleClose();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
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
              component="h2"
            >
              Reset Your Password
            </Typography>
            <form>
              <Grid container>
                <Grid item xs={12} mt={3}>
                  <TextField
                    name="email"
                    id="outlined-required"
                    label="Enter your email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailValid(true);
                    }}
                    fullWidth
                    type={"email"}
                    error={!isEmailValid}
                    // helperText={isEmailValid?"":""}
                    required
                  />
                </Grid>
                <Grid item xs={12} mt={3}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#333333",
                      borderRadius: "25px",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#000000",
                      },
                    }}
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Get Link
                  </Button>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Alert
                    severity="info"
                    sx={{
                      position: "relative",
                      "& .MuiAlert-icon": {
                        position: "relative",
                        top: 6,
                        right: 10,
                        marginRight: "20px",
                      },
                    }}
                  >
                    We will send a link to —{" "}
                    <strong>reset your password</strong>
                  </Alert>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

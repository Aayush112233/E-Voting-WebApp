import {
  AppBar,
  Grid,
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import React from "react";
import { alpha, styled } from "@mui/material/styles";
import "../assets/customCss/wave.css";
import ContactImage from "../assets/images/Contact.png";
import EmailImage from "../assets/images/EmailImage.jpg";

export const ContactUs = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    width: "80%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));

  const CustomEmailImage = {
    width: "auto",
    height: "100px",
    margin: "auto",
    position: "absolute",
    top: "-8px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    mixBlendMode: "multiply",
  };

  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
  }));

  const ContactDiv = styled(Paper)(({ theme }) => ({
    color: "#000336",
    padding: 10,
    gap: "1rem",
    width: "100%",
    fontWeight: "bold",
    margin: "auto",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
  }));
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          overflowX: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div>
          <Title align="center">Contact Us</Title>
        </div>
        <Grid
          container
          width={{ sm: "90%", md: "80%" }}
          justifyContent={"center"}
        >
          <Box
            display={{ xs: "none", md: "block", justifyContent: "center" }}
            flex={1.75}
          >
            <img
              src={ContactImage}
              alt="contactImg"
              style={{
                maxWidth: "100%",
                marginBottom: "2rem",
                mixBlendMode: "multiply",
              }}
            />
          </Box>
          <Box
            flex={1}
            sx={{
              display: "flex",
            }}
          >
            <ContactDiv elevation={3}>
              <img src={EmailImage} style={CustomEmailImage}></img>
              <Grid
                container
                spacing={3}
                margin={"auto"}
                padding={3}
                width={{ md: "90%", xs: "100%" }}
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <TextField
                    id="standard-basic"
                    label="Full Name"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="standard-multiline-static"
                    label="Your Message"
                    multiline
                    rows={4}
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    sx={{ display: "flex", flexDirection: "row-reverse" }}
                    onClick={() => {
                      alert("I will send an email");
                    }}
                  >
                    <Typography>Send</Typography>
                  </Button>
                </Grid>
              </Grid>
            </ContactDiv>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

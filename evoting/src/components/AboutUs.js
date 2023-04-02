import { Button, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import aboutUs from "../assets/images/AboutUs.jpg";

export const AboutUs = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "relative",
    justifyContent: "center",
    width: "80%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
  }));
  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "64px",
    color: "#000336",
    fontWeight: "bold",
    margin: theme.spacing(4, 0, 4, 0),
    [theme.breakpoints.down("sm")]: {
      fontSize: "40px",
    },
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Title>About Us</Title>
      <CustomBox>
        <Box sx={{ flex: "1.5", justifyContent: "center" }}>
          <img
            src={aboutUs}
            alt="EVoting"
            style={{
              width: "100%",
              marginBottom: "2rem",
              mixBlendMode: "multiply",
            }}
          />
        </Box>
        <Box
          sx={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            alignItems: {
              md: "start",
              xs: "center",
            },
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "18px", color: "#5A6473", my: 4 }}
          >
            Online voting system comes with the fundamental feature of avoiding
            repeated votes to ensure and safeguard the validity of your votes.
          </Typography>
          <Button
            variant="container"
            sx={{
              backgroundColor: "none",
              border: "1px solid black",
              borderRadius: "20px",
            }}
          >
            {" "}
            Learn More{" "}
          </Button>
        </Box>
      </CustomBox>
    </Box>
  );
};

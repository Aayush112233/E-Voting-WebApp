import {
  Grid,
  Typography,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import  {NavigationBar}  from "../components/NavBar";
import "../assets/customCss/wave.css";
import eVote from "../assets/images/landingVote.jpg";
import Features from "../components/Features";
import { ContactUs } from "../components/ContactUs";
import { useRef } from "react";
import { AboutUs } from "../components/AboutUs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

export const LandingPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const home = useRef();
  const aboutUs = useRef();
  const contact = useRef();
  const features = useRef();

  const ScrollToPage = (elementRef) => {
    if (elementRef) {
      if (elementRef === "features") {
        features.current?.scrollIntoView({ behaviour: "smooth" });
      }
      if (elementRef === "home") {
        home.current?.scrollIntoView({ behaviour: "smooth" });
      }
      if (elementRef === "aboutUs") {
        aboutUs.current?.scrollIntoView({ behaviour: "smooth" });
      }
      if (elementRef === "contactUs") {
        contact.current?.scrollIntoView({ behaviour: "smooth" });
      }
    }
  };

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_API_URL}/user/addPageViews`)
    .then((response) => {console.log(response)})
    .catch((err) => {
      console.error(err);
    });
  },[])

  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position:"relative",
    justifyContent: "center",
    top:"100px",
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
        }}
        ref={home}
      >
        <div className="container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 400"
          >
            <path
              fill="#0099ff"
              fillOpacity="1"
              d="M0,320L40,288C80,256,160,192,240,160C320,128,400,128,480,144C560,160,640,192,720,176C800,160,880,96,960,80C1040,64,1120,96,1200,117.3C1280,139,1360,149,1400,154.7L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg>
        </div>
          <Box sx={{position:"relative"}}>
            <NavigationBar scroll={ScrollToPage} />
          </Box>
        <Grid
          container
          minHeight={"85%"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection="column"
          position={"relative"}
        >
          {" "}
          <CustomBox>
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
              <div>
                <Title variant="h2">Vote</Title>
                <Title variant="h2" m={0} fontSize={"56"}>
                  {" "}
                  <span style={{ color: "#65a0f7" }}>Make your Choice</span>
                </Title>
              </div>

              <Typography
                variant="body2"
                sx={{ fontSize: "18px", color: "#5A6473", my: 4 }}
              >
                Online voting system comes with the fundamental feature of
                avoiding repeated votes to ensure and safeguard the validity of
                your votes.
              </Typography>
              <Button
                variant="container"
                onClick={()=>{navigate("/users")}}
                sx={{
                  backgroundColor: "none",
                  border: "1px solid black",
                  borderRadius: "20px",
                }}
              >
                {" "}
                Get Started{" "}
              </Button>
            </Box>
            <Box sx={{ flex: "1.5", justifyContent: "center" }}>
              <img
                src={eVote}
                alt="EVoting"
                style={{
                  maxWidth: "100%",
                  marginBottom: "2rem",
                  mixBlendMode: "multiply",
                }}
              />
            </Box>
          </CustomBox>
        </Grid>
      </Box>
      <div ref={features}>
        <Features />
      </div>
      <div ref={aboutUs}>
        <AboutUs />
      </div>
      <div ref={contact}>
        <ContactUs />
      </div>
    </>
  );
};

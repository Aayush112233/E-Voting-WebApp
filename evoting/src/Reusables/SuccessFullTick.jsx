import { Fade, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "../assets/customCss/TickAnimation.css";

const SuccessFullTick = ({ message, isCompleted }) => {
  return (
    <div className="wrapper">
      <svg
        className="checkmark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 52 52"
      >
        <circle
          className="checkmark__circle"
          cx="26"
          cy="26"
          r="25"
          fill="none"
        />
        <path
          className="checkmark__check"
          fill="none"
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
      <Fade
        in={isCompleted}
        style={{ transitionDelay: isCompleted ? "800ms" : "0ms" }}
      >
        <Typography sx={{ marginLeft: "20px", color: "green" }}>
          {message}
        </Typography>
      </Fade>
    </div>
  );
};

export default SuccessFullTick;

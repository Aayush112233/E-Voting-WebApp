import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const ElectionCount = ({ startDate, endDate, setChange }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [backgroundColor, setBackGound] = useState("");
  const [color, setColor] = useState("white");
  const styles = {
    timerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: backgroundColor,
      padding: "4px",
      borderRadius: "5px",
    },
    timerText: {
      fontSize: "15px",
      fontWeight: "bold",
      margin: "0 10px",
      color: color,
    },
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (now < start) {
        // Election hasn't started yet
        const timeDiff = start.getTime() - now.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${days}d ${hours}h ${minutes}m ${seconds}s until start`
        );
        setBackGound("#c7d6ff")
        setColor("blue")
        setChange(false)
      } else if (now >= start && now <= end) {
        // Election is ongoing
        const timeDiff = end.getTime() - now.getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setBackGound("green")
        setColor("white")
        setChange(true)
        setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
      } else {
        setChange(false)
        // Election has ended
        setBackGound("#FFD5D5")
        setColor("red")
        setTimeRemaining("Election has ended");
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startDate, endDate]);

  return (
    <>
      <div style={styles.timerContainer}>
        <Typography style={styles.timerText}>{timeRemaining}</Typography>
      </div>
    </>
  );
};

export default ElectionCount;

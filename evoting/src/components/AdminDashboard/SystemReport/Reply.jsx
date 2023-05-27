import { Send } from "@mui/icons-material";
import { Box, Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useState } from "react";
import { API } from "../../../baseUrlProvider";
import { toast } from "react-toastify";

export const Reply = ({ setReply, selectedInquiry, setOpen }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleMessageChange = (e) => {
    setError(false);
    setMessage(e.target.value);
    setLoading(false)
  };

  const sendReply = () => {
   
    const data = {
      to: selectedInquiry.email,
      message: message,
    };
    if (message !== "") {
      setLoading(true);
      API.post("/user/replyInquiry", data)
        .then((res) => {
          toast.success("Reply send successfully");
          setOpen(false);
          setLoading(false);
          setReply(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError(true);
    }
  };
  return (
    <Box>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12}>
          <TextField
            id="outlined-multiline-flexible"
            label="Write a reply message"
            multiline
            error={error}
            onChange={handleMessageChange}
            helperText={error ? "TextField Cannot be empty" : ""}
            rows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} display={"flex"} gap={"1rem"} justifyContent={"end"}>
          <Button
            variant="outlined"
            disabled={isLoading}
            style={{
              "&.MuiButton-endIcon": {
                position: "relative",
                backgroundColor: "red",
              },
            }}
            endIcon={<Send sx={{ position: "relative" }} />}
            onClick={sendReply}
          >
            
            Reply
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setReply(false);
            }}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import { RiLockPasswordFill } from "react-icons/ri";
import { GiConfirmed } from "react-icons/gi";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetSchema } from "../Validation/formValidation";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
const Reset = () => {
  const navigate = useNavigate();
  const routeParams = useParams();
  
  const {
    register: resetPassword,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetError },
    setValue,
  } = useForm({
    resolver: yupResolver(ResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleReset = async (data) => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/user/passwordReset/${routeParams.id}/${routeParams.token}`, data)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    setValue("newPassword", "");
    setValue("confirmPassword", "");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: 1,
        backgroundColor: "#e9edfd",
      }}
    >
      <Box width={"400px"} sx={{ borderRadius: "20px", position: "relative" }}>
        <Card
          sx={{
            minWidth: 300,

            padding: "30px",
            boxShadow:
              "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px`",
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <img
                  style={{
                    width: "140px",
                    height: "auto",
                  }}
                  src="https://img.freepik.com/premium-vector/password-reset-icon-flat-vector-design_116137-4571.jpg?w=2000"
                  alt="resetImage"
                ></img>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" textAlign={"center"}>
                Password Reset
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                textAlign={"center"}
                color={"GrayText"}
              >
                Enter your new password and repeat it.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="input-with-icon-textfield"
                placeholder="New Password"
                error={!!resetError.newPassword}
                helperText={
                  resetError.newPassword ? resetError.newPassword.message : ""
                }
                {...resetPassword("newPassword")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RiLockPasswordFill style={{ position: "relative" }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="input-with-icon-textfield"
                placeholder="Confirm Password"
                error={!!resetError.confirmPassword}
                helperText={
                  resetError.confirmPassword
                    ? resetError.confirmPassword.message
                    : ""
                }
                {...resetPassword("confirmPassword")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GiConfirmed style={{ position: "relative" }} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleResetSubmit(handleReset)}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid gray",
                }}
              >
                {" "}
                Reset
              </Button>
            </Grid>
          </Grid>
          <Grid container mt={3}>
            <Grid
              item
              xs={12}
              display="flex"
              sx={{
                flexDirection: {
                  xs: "row",
                  sm: "row",
                },
              }}
              justifyContent={"center"}
              alignItems="center"
            >
              <div>
                <a
                  style={{
                    textDecoration: "none",
                    color: "blue",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Go back to login page
                </a>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default Reset;

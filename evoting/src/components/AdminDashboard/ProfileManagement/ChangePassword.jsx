import { Box, Grid, TextField, Button } from "@mui/material";
import React from "react";
import { ChangePasswordSchema } from "../../../Validation/formValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ChangeUserPassword } from "../../../Services/authServices";

const ChangePassword = () => {
  const { userData } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const {
    register: passwordChange,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const handlePasswordChange = async(data) => {
    await dispatch(ChangeUserPassword(userData.userInfo._id, data));
  };
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        alignContent="start"
        justifyContent={"center"}
        spacing={3}
        sx={{
          height: {
            sm: "70%",
            xs: "90%",
          },
        }}
      >
        <Grid item xs={12} sm={7}>
          <TextField
            error={!!errors.oldPassword}
            name="oldPassword"
            id="standard-basic"
            label="Old Password"
            type="password"
            variant="standard"
            helperText={errors.oldPassword ? errors.oldPassword.message : ""}
            {...passwordChange("oldPassword")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <TextField
            error={!!errors.newPassword}
            id="standard-basic"
            name="newPassword"
            type="password"
            label="New Password"
            variant="standard"
            helperText={errors.newPassword ? errors.newPassword.message : ""}
            fullWidth
            {...passwordChange("newPassword")}
          />
        </Grid>
        <Grid item xs={7} display="flex" justifyContent={"center"}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit(handlePasswordChange)}
          >
            Change Password
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;

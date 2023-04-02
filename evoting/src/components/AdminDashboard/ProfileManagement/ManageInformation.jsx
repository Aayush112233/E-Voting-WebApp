import React, { useEffect } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditUserValidationSchema } from "../../../Validation/formValidation";
import { useDispatch } from "react-redux";
import { SaveUserDetails } from "../../../Services/adminServices";
import { useSelector } from "react-redux";
import { useState } from "react";
const ManageInformation = () => {
  const { userData } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const {
    register: editUser,
    handleSubmit: handleEditUser,
    formState: { errors: editUserError },
    setValue,
  } = useForm({
    resolver: yupResolver(EditUserValidationSchema),
  });
  useEffect(() => {
    if (userData.userInfo) {
      setUser(userData.userInfo);
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      setValue("notRegisteredInput", { test: "1", test2: "2" });

      setValue("firstName", user["firstName"]);
      setValue("lastName", user["lastName"]);
      setValue("email", user["email"]);
      setValue(
        "phoneNumber",
        user.contactInfo ? user.contactInfo["phoneNumber"] : ""
      );
      setValue(
        "permanentAddress",
        user.contactInfo?.address["permanentAddress"]
      );
      setValue(
        "temporaryAddress",
        user.contactInfo?.address["temporaryAddress"]
      );
    }
  }, [user]);

  const handleEditSubmit = async (data) => {
    const update = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contactInfo: {
        phoneNumber: data.phoneNumber,
        address: {
          permanentAddress: data.permanentAddress,
          temporaryAddress: data.temporaryAddress,
        },
      },
    };

    dispatch(SaveUserDetails(user._id, update));
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={!!editUserError.firstName}
            name="firstName"
            id="standard-basic"
            helperText={
              editUserError.firstName ? editUserError.firstName.message : ""
            }
            label="First Name"
            variant="standard"
            firstName
            {...editUser("firstName")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!!editUserError.lastName}
            name="lastName"
            id="standard-basic"
            label="Last Name"
            helperText={
              editUserError.lastName ? editUserError.lastName.message : ""
            }
            variant="standard"
            {...editUser("lastName")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-basic"
            name="email"
            error={!!editUserError.email}
            label="Email"
            helperText={editUserError.email ? editUserError.email.message : ""}
            variant="standard"
            {...editUser("email")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-basic"
            name="phone"
            label="Phone Number"
            variant="standard"
            {...editUser("phoneNumber")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            error={!!editUserError.permanentAddress}
            helperText={
              editUserError.permanentAddress
                ? editUserError.permanentAddress.message
                : ""
            }
            id="standard-basic"
            name="permanentAddress"
            label="Permanent Address"
            variant="standard"
            fullWidth
            {...editUser("permanentAddress")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={!!editUserError.temporaryAddress}
            helperText={
              editUserError.temporaryAddress
                ? editUserError.temporaryAddress.message
                : ""
            }
            name="temporaryAddress"
            id="standard-basic"
            label="Temporary Address"
            variant="standard"
            fullWidth
            {...editUser("temporaryAddress")}
          />
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          alignItems={"center"}
          justifyContent="center"
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "25px",
              cursor: "pointer",
              mt: "10px",
              fontWeight: "bold",
              width: "60%",
            }}
            onClick={handleEditUser(handleEditSubmit)}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageInformation;

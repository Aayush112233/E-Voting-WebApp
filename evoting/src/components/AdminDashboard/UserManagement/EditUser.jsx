import React, { useEffect } from "react";
import { Button, Grid, TextField} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditUserValidationSchema } from "../../../Validation/formValidation";
import { useDispatch } from "react-redux";
import { EditUserDetails } from "../../../Services/adminServices";
const EditUser = ({ userDetails, setEditOpen }) => {
  const dispatch = useDispatch();
  const {
    register: editUser,
    handleSubmit: handleEditUser,
    formState: { errors: editUserError },
    setValue,
  } = useForm({
    resolver: yupResolver(EditUserValidationSchema),
  });

  useEffect(() => {
    setValue("firstName", userDetails["firstName"]);
    setValue("lastName", userDetails["lastName"]);
    setValue("email", userDetails["email"]);
    setValue("phoneNumber", userDetails.contactInfo["phoneNumber"]);
    setValue(
      "permanentAddress",
      userDetails.contactInfo.address["permanentAddress"]
    );
    setValue(
      "temporaryAddress",
      userDetails.contactInfo.address["temporaryAddress"]
    );
  }, [userDetails]);

  const handleEditSubmit = async(data) => {
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

    await dispatch(EditUserDetails(userDetails._id, update));
    setEditOpen(false)
  };
  return (
    <>
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
        <TextField
          id="standard-basic"
          name="phone"
          label="Phone Number"
          variant="standard"
          {...editUser("phoneNumber")}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
    </>
  );
};

export default EditUser;

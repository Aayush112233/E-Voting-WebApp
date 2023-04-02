import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddUserValidationSchema } from "../../../Validation/formValidation";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { AddNewUser } from "../../../Services/adminServices";
const AddUser = () => {
  const dispatch = useDispatch();
  const {
    register: registration,
    handleSubmit: handleAddUser,
    formState: { errors: registrationError },
    setValue,
  } = useForm({
    resolver: yupResolver(AddUserValidationSchema),
  });

  const handleAddSubmit = (data) => {
    const add = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.password,
      contactInfo: {
        phoneNumber: data.phoneNumber,
        address: {
          permanentAddress: data.permanentAddress,
          temporaryAddress: data.temporaryAddress,
        },
      },
    };
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("email", "");
    setValue("password", "");
    setValue("phoneNumber", "");
    setValue("permanentAddress", "");
    setValue("temporaryAddress", "");
    dispatch(AddNewUser(add));
  };

  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        alignItems="center"
        spacing={2}
        width={1}
        minHeight="100%"
        overflow={"auto"}
        padding={1}
      >
        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
          <Typography
            sx={{
              fontSize: {
                xs: "1.5rem",
              },
            }}
            color={"gray"}
          >
            Add New User
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            error={!!registrationError.firstName}
            name="firstName"
            id="standard-basic"
            helperText={
              registrationError.firstName
                ? registrationError.firstName.message
                : ""
            }
            label="First Name"
            variant="standard"
            firstName
            {...registration("firstName")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            error={!!registrationError.lastName}
            name="lastName"
            id="standard-basic"
            label="Last Name"
            helperText={
              registrationError.lastName
                ? registrationError.lastName.message
                : ""
            }
            variant="standard"
            {...registration("lastName")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            id="standard-basic"
            name="email"
            error={!!registrationError.email}
            label="Email"
            helperText={
              registrationError.email ? registrationError.email.message : ""
            }
            variant="standard"
            {...registration("email")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            id="standard-basic"
            name="phone"
            label="Phone Number"
            variant="standard"
            {...registration("phoneNumber")}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            error={!!registrationError.permanentAddress}
            helperText={
              registrationError.permanentAddress
                ? registrationError.permanentAddress.message
                : ""
            }
            id="standard-basic"
            name="permanentAddress"
            label="Permanent Address"
            variant="standard"
            fullWidth
            {...registration("permanentAddress")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            error={!!registrationError.temporaryAddress}
            helperText={
              registrationError.temporaryAddress
                ? registrationError.temporaryAddress.message
                : ""
            }
            name="temporaryAddress"
            id="standard-basic"
            label="Temporary Address"
            variant="standard"
            fullWidth
            {...registration("temporaryAddress")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            error={!!registrationError.password}
            helperText={
              registrationError.password
                ? registrationError.password.message
                : ""
            }
            name="password"
            id="standard-basic"
            label="Password"
            variant="standard"
            fullWidth
            {...registration("password")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "25px",
              cursor: "pointer",
              mt: "10px",
              fontWeight: "bold",
            }}
            onClick={handleAddUser(handleAddSubmit)}
            fullWidth
          >
            Add +
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddUser;

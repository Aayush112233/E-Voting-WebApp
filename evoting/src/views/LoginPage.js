import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, RegisterSchema } from "../Validation/formValidation";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/images/loginAssets.jpg";
import registerImage from "../assets/images/registerAssests.jpg";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { removeCookies } from "../config/storageUtil";
import { useDispatch } from "react-redux";
import { loginOutService, loginService } from "../Services/authServices";
import { useSelector } from "react-redux";
import EmailReset from "../Reusables/EmailReset";

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogedIn } = useSelector((state) => state.loginState);
  const { formStatus, from } = location.state ? location.state : "";
  const [isSignIn, setIsSignIn] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(loginOutService());
  }, []);

  useEffect(() => {
    if (formStatus) {
      if (formStatus === "register") {
        setIsSignIn(false);
      }
    }
  }, [formStatus]);

  useEffect(() => {
    if (isLogedIn && from) {
      navigate(from);
    } else if (isLogedIn && !from) {
      navigate("/");
    }
  }, [isLogedIn]);

  const {
    register: registration,
    handleSubmit: handleRegistration,
    formState: { errors: registrationError },
  } = useForm({
    resolver: yupResolver(RegisterSchema),
  });

  const {
    register: login,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleRegistrationSubmit = (data) => {
    const register = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      contactInfo: {
        phoneNumber: data.phoneNumber,
        address: {
          permanentAddress: data.permanentAddress,
          temporaryAddress: data.temporaryAddress,
        },
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/user/register`, register)
      .then(async (res) => {
        toast.success("User Registered Successfully.");
        setTimeout(setIsSignIn(true), 5000);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };
  const onLoginSubmit = async (data) => {
    if (isLogedIn) {
      navigate(from);
    } else {
      dispatch(loginService(data));
    }
  };

  const mainContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#dae0f2",
  };

  return (
    <>
      <Box sx={mainContainer}>
        <Box
          sx={{
            width: { sm: "70%", xs: "90%" },
          }}
        >
          <Grid
            container
            sx={{
              height: "80vh",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          >
            <Grid
              item
              lg={6}
              sx={{
                display: {
                  xs: "none",
                  lg: "block",
                },
                // backgroundColor: "black",
                height: "100%",
              }}
            >
              {isSignIn ? (
                <Box sx={{ justifyContent: "center" }}>
                  <img
                    src={loginImage}
                    alt="EVoting"
                    style={{
                      maxWidth: "100%",
                      marginBottom: "2rem",
                      mixBlendMode: "multiply",
                    }}
                  />
                </Box>
              ) : (
                <Box sx={{ justifyContent: "center" }}>
                  <img
                    src={registerImage}
                    alt="EVoting"
                    style={{
                      maxWidth: "100%",
                      marginBottom: "2rem",
                      mixBlendMode: "multiply",
                    }}
                  />
                </Box>
              )}
            </Grid>
            <Grid
              item
              lg={6}
              xs={12}
              sx={{
                backgroundColor: "white",
                p: {
                  md: 7,
                  sm: 5,
                  xs: 3,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                  to="/"
                >
                  <IoIosArrowBack
                    size={"25px"}
                    style={{ position: "relative" }}
                  />
                  Go Back to Home
                </Link>
              </div>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100%",
                  overFlow: "auto",
                }}
              >
                {isSignIn ? (
                  <form>
                    <Grid
                      container
                      spacing={3}
                      justifyContent="center"
                      sx={{
                        width: {
                          md: "400px",
                        },
                      }}
                    >
                      <Grid item>
                        <Typography variant="h4" color={"gray"}>
                          Sign In
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          name="email"
                          error={!!loginError.email}
                          helperText={
                            loginError.email ? loginError.email.message : ""
                          }
                          {...login("email")}
                          variant="standard"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="standard-basic"
                          label="Password"
                          name="password"
                          error={!!loginError.password}
                          helperText={
                            loginError.password
                              ? loginError.password.message
                              : "Must be 8 characters at least"
                          }
                          variant="standard"
                          {...login("password")}
                          type="password"
                          fullWidth
                        />
                      </Grid>
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
                        justifyContent={"space-between"}
                        alignItems="center"
                      >
                        <div>
                          <a
                            style={{
                              textDecoration: "none",
                              fontFamily:"Arial",   
                              color: "black",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setOpen(true);
                            }}
                          >
                            Forgot Password ?
                          </a>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "black",
                            borderRadius: "25px",
                          }}
                          fullWidth
                          onClick={handleLoginSubmit(onLoginSubmit)}
                        >
                          Sign In
                        </Button>
                      </Grid>
                      <Grid item>
                        <Typography color={"black"}>
                          Don't Have an account?{" "}
                          <a
                            style={{
                              textDecoration: "none",
                              color: "black",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setIsSignIn(false);
                            }}
                          >
                            Sign Up
                          </a>
                        </Typography>
                      </Grid>
                    </Grid>
                  </form>
                ) : null}

                {!isSignIn ? (
                  <Grid
                    container
                    justifyContent={"center"}
                    spacing={2}
                    minHeight="100%"
                    overflow={"auto"}
                    padding={1}
                  >
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "1.5rem",
                          },
                        }}
                        color={"gray"}
                      >
                        Sign Up for an Account
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="standard-basic"
                        name="email"
                        error={!!registrationError.email}
                        label="Email"
                        helperText={
                          registrationError.email
                            ? registrationError.email.message
                            : ""
                        }
                        variant="standard"
                        {...registration("email")}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="standard-basic"
                        name="phone"
                        label="Phone Number"
                        variant="standard"
                        fullWidth
                        {...registration("phoneNumber")}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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
                        type={"password"}
                        {...registration("password")}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={!!registrationError.confirmPassword}
                        helperText={
                          registrationError.confirmPassword
                            ? registrationError.confirmPassword.message
                            : ""
                        }
                        name="confirmPassword"
                        id="standard-basic"
                        label="Confirm Password"
                        variant="standard"
                        type={"password"}
                        fullWidth
                        {...registration("confirmPassword")}
                      />
                    </Grid>
                    <Grid item>
                      <Typography color={"black"}>
                        Already Have an account?{" "}
                        <a
                          style={{
                            textDecoration: "none",
                            color: "black",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setIsSignIn(true);
                          }}
                        >
                          Sign In
                        </a>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "black",
                          borderRadius: "25px",
                          cursor: "pointer",
                        }}
                        fullWidth
                        onClick={handleRegistration(handleRegistrationSubmit)}
                      >
                        Sign Up
                      </Button>
                    </Grid>
                  </Grid>
                ) : null}
              </Box>
              <EmailReset open={open} setOpen={setOpen} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

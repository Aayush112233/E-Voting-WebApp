import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { CiUser } from "react-icons/ci";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";

import userImage from "../../../assets/images/dashboardUser.png";

const MainPage = ({ setSelectedLink, link }) => {
  const { userData } = useSelector((state) => state.userState);
  const [userDetails, setUserDetails] = useState();
  useEffect(() => {
    setUserDetails(userData.userInfo);
  }, [userData]);

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const CardCustom = styled(Card)(({ theme }) => ({
    height: "120px",
    margin: "auto",
    borderRadius: "10px",
    background: "white",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
  }));
  const CardCustom1 = styled(Card)(({ theme }) => ({
    borderRadius: "10px",
    minHeight: "100%",
    background: "white",
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
  }));

  const StyledSelection = styled(ListItem)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#e8e8e8",
    },
    // hide last border
  }));
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          w: 1,
          height: "100%",
        }}
      >
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          <Box sx={{ padding: "6px", mb: "10px" }}>
            <Typography fontSize={"30px"}>
              Hello {userDetails?.firstName} !
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid
              item
              md={3}
              sm={6}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
            >
              <CardCustom>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <img
                        src={userImage}
                        style={{
                          width: "70px",
                          height: "auto",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} textAlign={"end"}>
                      <Typography
                        variant="h5"
                        color={"black"}
                        fontWeight="bolder"
                      >
                        1,000,000
                      </Typography>
                      <Typography variant="h5" color={"gray"}>
                        Total Users
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid
              item
              md={3}
              sm={6}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
            >
              <CardCustom>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Grid container>
                    <Grid item xs={3}>
                      <CiUser
                        style={{
                          width: "100%",
                          color: "black",
                          position: "relative",
                          fontSize: "3.5rem",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} textAlign={"end"}>
                      <Typography
                        variant="h5"
                        color={"black"}
                        fontWeight="bolder"
                      >
                        1,000,000
                      </Typography>
                      <Typography variant="h5" color={"gray"}>
                        Total Election
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid
              item
              md={3}
              sm={6}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
            >
              <CardCustom>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Grid container>
                    <Grid item xs={3}>
                      <CiUser
                        style={{
                          width: "100%",
                          color: "black",
                          position: "relative",
                          fontSize: "3.5rem",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} textAlign={"end"}>
                      <Typography
                        variant="h5"
                        color={"black"}
                        fontWeight="bolder"
                      >
                        1,000,000
                      </Typography>
                      <Typography variant="h5" color={"gray"}>
                        Total Votes
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid
              item
              md={3}
              sm={6}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
            >
              <CardCustom>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Grid container>
                    <Grid item xs={3}>
                      <CiUser
                        style={{
                          width: "100%",
                          color: "black",
                          position: "relative",
                          fontSize: "3.5rem",
                        }}
                      />
                    </Grid>
                    <Grid item xs={8} textAlign={"end"}>
                      <Typography
                        variant="h5"
                        color={"black"}
                        fontWeight="bolder"
                      >
                        1,000,000
                      </Typography>
                      <Typography variant="h5" color={"gray"}>
                        Votes
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardCustom>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            mt={2}
            minHeight="60%"
            justifyContent={"flex-start"}
          >
            <Grid
              item
              sm={6}
              xs={12}
              spacing={3}
              flexDirection={"column"}
              justifyContent="center"
              minHeight={"100%"}
            >
              <CardCustom1>
                <CardContent
                  sx={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                ></CardContent>
              </CardCustom1>
            </Grid>
            <Grid
              item
              sm={3}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
              minHeight={"100%"}
            >
              <CardCustom1>
                <Typography variant="h6" align="center" mt={2}>
                  Recently Joined
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  <StyledSelection alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Aayush Neupane"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="gray"
                          >
                            2022-01-15
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </StyledSelection>
                  <StyledSelection alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Aayush Neupane"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="gray"
                          >
                            2022-01-15
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </StyledSelection>
                </List>
              </CardCustom1>
            </Grid>
            <Grid
              item
              sm={3}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
              minHeight={"100%"}
            >
              <CardCustom1>
                <Typography variant="h6" align="center" mt={2}>
                  Recent Election
                </Typography>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  <StyledSelection alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Aayush Neupane"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="gray"
                          >
                            2022-01-15
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </StyledSelection>
                  <StyledSelection alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Aayush Neupane"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="gray"
                          >
                            2022-01-15
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </StyledSelection>
                </List>
              </CardCustom1>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default MainPage;

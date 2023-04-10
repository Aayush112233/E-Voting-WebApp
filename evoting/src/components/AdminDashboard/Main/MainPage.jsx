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
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import CountUp from "react-countup";
import "chart.js/auto";
import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

import userImage from "../../../assets/images/dashboardUser.png";
import electionImage from "../../../assets/images/dashboardElection.png";
import totalVotes from "../../../assets/images/dashboardTotalVotes.png";
import views from "../../../assets/images/dashboardView.png";
import { API } from "../../../baseUrlProvider";
import { fetchAllUser } from "../../../Services/adminServices";
import DonutChart from "../../../Reusables/ChartDoughnut";

ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const MainPage = ({ setSelectedLink, link }) => {
  const { userData } = useSelector((state) => state.userState);
  const { allUser } = useSelector((state) => state.adminState);
  const [userDetails, setUserDetails] = useState();
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentElection, setRecentElection] = useState([]);
  const [totalElection, setTotalElection] = useState(0);
  const [totalVoteCount, setTotalVotes] = useState(0);
  const [recentlyJoined, setRecentlyJoined] = useState([]);
  const [pageViews, setPageViews] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    setUserDetails(userData.userInfo);
  }, [userData]);

  useEffect(() => {
    if (allUser && allUser.userInfo) {
      const recentUsers = allUser.userInfo.slice(0, 4);
      getRecentlyJoinedUsers(recentUsers);
    }
  }, [allUser]);

  useEffect(() => {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 5 && hours < 12) {
      setGreeting("Good morning");
    } else if (hours >= 12 && hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    setSelectedLink(link);
    getTotalsVotesByElection();
    dispatch(fetchAllUser());
    distinctDefinedVoters();
    getPageViews();
    getTotalNoofUsers();
    getTotalNoOfVotes();
    getRecentElection();
  }, []);

  const getPageViews = () => {
    API.get("/user/pageviews")
      .then((response) => {
        setPageViews(response.data.count);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getTotalNoofUsers = () => {
    API.get("/user/getTotalNoofUsers")
      .then((res) => {
        setTotalUsers(
          <CountUp
            start={0}
            end={res.data.totalUsers}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRecentElection = () => {
    API.get(`election/findAllElections`)
      .then((res) => {
        const recentElections = res.data.elections.slice(-5);
        setRecentElection(recentElections);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalsVotesByElection = () => {
    API.get("/election/getAllElectionVoteCount")
      .then((res) => {
        const labels = res.data.map((d) => d.electionName);
        const data = res.data.map((d) => (d.totalVotes));

        const newChartData = {
          labels: labels,
          datasets: [
            {
              label: "Total Votes",
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(75, 192, 192, 0.4)",
              hoverBorderColor: "rgba(75, 192, 192, 1)",
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                },
              },
            ],
          },
        };

        setChartData(newChartData);
        setChartOptions(chartOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const distinctDefinedVoters = () => {
    API.get("/election/getTotalNoOfElection")
      .then((res) => {
        setTotalElection(
          <CountUp
            start={0}
            end={res.data.totalElections}
            duration={2.5}
            separator=","
          />
        );
        const data = {
          PredefinedElections: res.data.voterDefined,
          openElections: res.data.openVoter,
        };
        setPieData(data);
      })
      .catch((e) => {
        console.log(e.response.data.message);
      });
  };

  const getTotalNoOfVotes = () => {
    API.get(`/election/getTotalNoOfVotes`)
      .then((res) => {
        setTotalVotes(
          <CountUp
            start={0}
            end={res.data.totalVotes}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {
        console.log("the error ", err);
      });
  };

  const getRecentlyJoinedUsers = (data) => {


    setRecentlyJoined(data);
  };

  const CardCustom = styled(Card)(({ theme }) => ({
    height: "140px",
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
        }}
      >
        <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          <Box sx={{ padding: "6px", mb: "10px" }}>
            <Typography fontSize={"25px"}>
              <span style={{ color: "red", fontSize: "25px" }}>{greeting}</span>{" "}
              {userDetails?.firstName} !
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid
                  item
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
                        background: "rgb(255,203,148)",
                        background:
                          "linear-gradient(101deg, rgba(255,203,148,1) 0%, rgba(205,75,0,1) 100%)",
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
                            color={"#fae6dc"}
                            fontWeight="bolder"
                          >
                            {totalUsers}
                          </Typography>
                          <Typography variant="h6" color={"#fae6dc"}>
                            Total Users
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardCustom>
                </Grid>
                <Grid
                  item
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
                        background: "rgb(148,255,169)",
                        background:
                          "linear-gradient(101deg, rgba(148,255,169,1) 0%, rgba(0,120,40,1) 100%)",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={3}>
                          <img
                            src={electionImage}
                            style={{
                              width: "70px",
                              height: "auto",
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} textAlign={"end"}>
                          <Typography
                            variant="h5"
                            color={"#e8fcec"}
                            fontWeight="bolder"
                          >
                            {totalElection}
                          </Typography>
                          <Typography variant="h6" color={"#e8fcec"}>
                            Total Election
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardCustom>
                </Grid>
                <Grid
                  item
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
                        background: "rgb(255,166,148)",
                        background:
                          "linear-gradient(101deg, rgba(255,166,148,1) 0%, rgba(205,0,0,1) 100%)",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={3}>
                          <img
                            src={totalVotes}
                            style={{
                              width: "70px",
                              height: "auto",
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} textAlign={"end"}>
                          <Typography
                            variant="h5"
                            color={"#ffe6e7"}
                            fontWeight="bolder"
                          >
                            {totalVoteCount}
                          </Typography>
                          <Typography variant="h6" color={"#ffe6e7"}>
                            Total Votes
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardCustom>
                </Grid>
                <Grid
                  item
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
                        background: "rgb(148,197,255)",
                        background:
                          "linear-gradient(101deg, rgba(148,197,255,1) 0%, rgba(3,0,205,1) 100%)",
                      }}
                    >
                      <Grid container>
                        <Grid item xs={3}>
                          <img
                            src={views}
                            style={{
                              width: "70px",
                              height: "auto",
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} textAlign={"end"}>
                          <Typography
                            variant="h5"
                            color={"#dcd9ff"}
                            fontWeight="bolder"
                          >
                            {pageViews ? pageViews : ""}
                          </Typography>
                          <Typography variant="h6" color={"#dcd9ff"}>
                            Views
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardCustom>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <div>
                <DonutChart data={pieData} />
              </div>
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
                >
                  {chartData ? (
                    <Line data={chartData} options={chartOptions} />
                  ) : (
                    "Loading......."
                  )}
                </CardContent>
              </CardCustom1>
            </Grid>
            <Grid
              item
              sm={3}
              xs={12}
              flexDirection={"column"}
              justifyContent="center"
              // minHeight={"100%"}
            >
              <CardCustom1>
                <Typography variant="h6" align="center" mt={2}>
                  Recently Joined
                </Typography>
                <List
                  sx={{
                    minWidth: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  {recentlyJoined?.map((item) => (
                    <StyledSelection
                      alignItems="flex-start"
                      sx={{
                        minWidth: "100%",
                        bgcolor: "background.paper",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={item.profileImage} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.firstName + " " + item.lastName}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="gray"
                            >
                              {item?.createdAt?.substring(0, 10)}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </StyledSelection>
                  ))}
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
                  {recentElection?.map((item) => {
                    return (
                      <>
                        <StyledSelection alignItems="flex-start">
                          <ListItemText
                            primary={item.electionName}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="gray"
                                >
                                  {item?.createdAt?.substring(0, 10)}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </StyledSelection>
                      </>
                    );
                  })}
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

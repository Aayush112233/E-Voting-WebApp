import {
  Avatar,
  Box,
  Card,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import electionParticipated from "../../../assets/images/election-participated.png";
import totalVoteCasted from "../../../assets/images/vote-casted.png";
import electionConducted from "../../../assets/images/election-conducted.png";
import electionMissed from "../../../assets/images/election-missed.png";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import CountUp from "react-countup";

import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { API } from "../../../baseUrlProvider";

ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Main = ({ setSelectedLink, link }) => {
  const [totalElectionParticipated, setTotalElectionParticipated] = useState(0);
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [totalParticipated, setTotalparticiapated] = useState(0);
  const [electionMissedCount, setElectionMissed] = useState(0);
  const [lastElectionDetail, setLastElectionDetail] = useState(null);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    setSelectedLink(link);
    getTotalElectionParticipated();
    getTotalVoteCasted();
    getElectionParticipateCount();
    getElectionMissedCount();
    getTotalVotesOfCreaterElection();
    lastElectionDetails();
  }, []);
  const cardStyle = {
    width: "100%",
    boxShadow: "none",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "20px",
    padding: "20px",
  };

  const avatarStyle = {
    borderRadius: "0",
    marginBottom: 2,
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [150, 230, 100, 290, 200, 300, 170],
        backgroundColor: [
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(75, 192, 192, 0.4)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [100, 150, 200, 180, 220, 150, 190],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: "Your Last Election with Total Votes",
          fontSize: 20,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const summaryCardStyle = {
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    height: "70px",
    padding: "10px",
  };

  const getTotalElectionParticipated = () => {
    API.get("/election/getTotalElectionByUser")
      .then((res) => {
        setTotalElectionParticipated(
          <CountUp
            start={0}
            end={res.data.electionCount}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTotalVoteCasted = () => {
    API.get("/election/getTotalVotesByUser")
      .then((res) => {
        setTotalVoteCount(
          <CountUp
            start={0}
            end={res.data.voteCount}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {});
  };
  const getElectionParticipateCount = () => {
    API.get("/election/getElectionParticipateCount")
      .then((res) => {
        setTotalparticiapated(
          <CountUp
            start={0}
            end={res.data.electionCount}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {});
  };
  const getElectionMissedCount = () => {
    API.get("/election/getElectionMissed")
      .then((res) => {
        setElectionMissed(
          <CountUp
            start={0}
            end={res.data.missedCount}
            duration={2.5}
            separator=","
          />
        );
      })
      .catch((err) => {});
  };

  const getTotalVotesOfCreaterElection = () => {
    API.get("/election/getAllElectionVoteCountByCreater")
      .then((res) => {
        preparebarGraph(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const lastElectionDetails = () => {
    API.get(`/election/getlastElectionDetailsForUser`)
      .then((res) => {
        setLastElectionDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const preparebarGraph = (data) => {
    const labels = data.map((election) => election.electionName);
    const votes = data.map((election) => election.totalVotes);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Total Votes",
          data: votes,
          backgroundColor: [
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
            "rgba(75, 192, 192, 0.4)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    setChartData(chartData);
  };
  return (
    <>
      <Box sx={{ padding: 2 }}>
        <h3>Hi, Welcome back</h3>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              style={{
                ...cardStyle,
                backgroundColor: "#c7facc",
              }}
            >
              <Avatar sx={avatarStyle} src={electionParticipated}></Avatar>
              <Typography variant="h5" fontWeight={"bold"} color={"#005223"}>
                {totalElectionParticipated}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color={"#005223"}>
                Election Participated
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              style={{
                ...cardStyle,
                backgroundColor: "#cff1fe",
              }}
            >
              <Avatar sx={avatarStyle} src={totalVoteCasted}></Avatar>
              <Typography variant="h5" fontWeight={"bold"} color={"#001952"}>
                {totalVoteCount}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color={"#001952"}>
                Total Vote Casted
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              style={{
                ...cardStyle,
                backgroundColor: "#fff6cc",
              }}
            >
              <Avatar sx={avatarStyle} src={electionConducted}></Avatar>
              <Typography variant="h5" fontWeight={"bold"} color={"#524600"}>
                {totalParticipated}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color={"#524600"}>
                Election Conducted
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              style={{
                ...cardStyle,
                backgroundColor: "#ffe7d8",
              }}
            >
              <Avatar sx={avatarStyle} src={electionMissed}></Avatar>
              <Typography variant="h5" fontWeight={"bold"} color={"#5c0301"}>
                {electionMissedCount}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color={"#5c0301"}>
                Election Missed
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={6}>
            {chartData ? (
              <Bar data={chartData} options={config.options} />
            ) : (
              "loading..."
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: {
                          sm: "20px",
                          xs: "18px",
                        },
                        fontWeight: "bold",
                        backgroundColor: "#f6f8fc",
                      }}
                    >
                      Last Election Summary
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lastElectionDetail ? (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography
                          sx={{
                            textAlign: "center",
                            mb: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {lastElectionDetail.electionName}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Card sx={summaryCardStyle}>
                              <Grid
                                container
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ fontSize: 19, fontWeight: "bold" }}
                                  >
                                    Most Votes Received
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography sx={{ fontSize: 16 }}>
                                    {lastElectionDetail.mostVotesReceived}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card sx={summaryCardStyle}>
                              <Grid
                                container
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ fontSize: 19, fontWeight: "bold" }}
                                  >
                                    Total No of Votes
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography sx={{ fontSize: 16 }}>
                                    {lastElectionDetail.totalVotes}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card sx={summaryCardStyle}>
                              <Grid
                                container
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ fontSize: 19, fontWeight: "bold" }}
                                  >
                                    Total Position
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography sx={{ fontSize: 16 }}>
                                    {lastElectionDetail.numPositions}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Card sx={summaryCardStyle}>
                              <Grid
                                container
                                justifyContent={"center"}
                                textAlign={"center"}
                              >
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{ fontSize: 19, fontWeight: "bold" }}
                                  >
                                    Total Candidates
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography sx={{ fontSize: 16 }}>
                                    {lastElectionDetail.numCandidates}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>Not Past Election</TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Main;

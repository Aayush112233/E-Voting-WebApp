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
import React, { useEffect } from "react";
import electionParticipated from "../../../assets/images/election-participated.png";
import totalVoteCasted from "../../../assets/images/vote-casted.png";
import electionConducted from "../../../assets/images/election-conducted.png";
import electionMissed from "../../../assets/images/election-missed.png";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJs,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJs.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const Main = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
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
    height: "100px",
    padding: "10px",
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
                1,00,2399
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
                1,00,2399
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
                1,00,2399
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
                1,00,2399
              </Typography>
              <Typography variant="h6" fontWeight={"bold"} color={"#5c0301"}>
                Election Missed
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={6}>
            <Bar data={config.data} options={config.options} />
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
                        Election Name
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Card sx={summaryCardStyle}>Most Vote Received</Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card sx={summaryCardStyle}>
                            Total Vote
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card sx={summaryCardStyle}>
                            No of Position
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card sx={summaryCardStyle}>
                            No of Candidate
                          </Card>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
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

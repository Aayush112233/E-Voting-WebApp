import { Box, Chip, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { API } from "../../../baseUrlProvider";

const ViewPage = () => {
  const params = useParams();
  const [result, setResult] = useState([]);
  const [election, setElection] = useState({});
  const [totalVotes, setTotalVotes] = useState("");

  useEffect(() => {
    API.get("election/getVoteCountByElection/" + params.id)
      .then((res) => {
        setResult(res.data.voteCounts);
        setElection(res.data.election);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    TotalVotes(result);
  }, [result]);

  const handleValidTime = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start == undefined) {
      return "Not Started";
    }

    if (now >= start && now <= end) {
      return "Ongoing";
    } else if (now < start) {
      return "Not Started";
    } else if (now > end) {
      return "Ended";
    } else {
      return "Not Started";
    }
  };

  const TotalVotes = (data) => {
    const totalVotes = data.reduce(
      (accumulator, currentCandidate) =>
        accumulator + currentCandidate.voteCount,
      0
    );
    setTotalVotes(totalVotes);
  };

  const groupedCandidates = result?.reduce((acc, curr) => {
    const position = curr.candidate.candidatePosition;
    if (!acc[position]) {
      acc[position] = [curr];
    } else {
      acc[position].push(curr);
    }

    return acc;
  }, {});

  return (
    <Box
      sx={{
        height: "100%",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFF4E0",
          borderRadius: "15px",
          maxWidth: {
            md: "80%",
            xs: "100%",
          },
          margin: "auto",
          padding: "15px",
        }}
      >
        <Grid container justifyContent={"center"}>
          <Typography variant="h4" fontWeight={"bold"} color={"#4D4D4D"}>
            {election?.electionName}
          </Typography>
        </Grid>
        <Grid container justifyContent={"space-between"} marginTop="10px">
          <Typography variant="body2" fontWeight={"bold"} color={"#4D4D4D"}>
            Status :{" "}
            <Chip
              label={handleValidTime(
                election.electionStartDate,
                election.electionEndDate
              )}
              color="success"
            />
          </Typography>
          <Typography variant="body2" fontWeight={"bold"} color={"#4D4D4D"}>
            Total Votes : {totalVotes}
          </Typography>
        </Grid>
        <Grid container mt={"20px"} justifyContent={"center"} gap={3}>
          {Object.keys(groupedCandidates).map((position) => {
            return (
              <Grid item xs={12} sm={8} md={6} lg={5}>
                <List
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      sx={{ textAlign: "center" }}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline", textAlign: "center" }}
                            component="span"
                            variant="h6"
                            color="text.primary"
                          >
                            {position}
                          </Typography>
                          {new Date() >= new Date(election.electionEndDate) ? (
                            <Typography variant="body1">Winner : {groupedCandidates[position][0].voteCount !== 0 ? groupedCandidates[position][0].candidate.candidateName : "No Winner(No Vote Casted)"}</Typography>
                          ) : null}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider
                    variant="inset"
                    component="li"
                    sx={{ width: "100%", marginLeft: 0 }}
                  />
                  <div style={{ maxHeight: "300px", overflow: "auto" }}>
                    {groupedCandidates[position].map((item) => {
                      return (
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt={item.candidate.candidateName}
                              src={item.candidate.candidateImage}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.candidate.candidateName}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {item.candidate.candidateDescription}
                                </Typography>
                                {" — Vote Count: "}
                                {item.voteCount}
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </div>
                </List>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ViewPage;

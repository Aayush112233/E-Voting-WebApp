import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import "../assets/customCss/customCard.css";
import feature1 from "../assets/images/CreateElectionFeature.png"
import feature2 from "../assets/images/Feature2.png"
import feature3 from "../assets/images/Feature3.png"


export const CustomCard = () => {
  return (
    <>
      <Box width={1}>
        <Grid
          container
          paddingX={4}
          spacing={8}
          justifyContent={"space-between"}
          alignContent={"center"}
          w={1}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Box minWidth={1}>
              <img
                src={feature1}
                alt="a Reuben sandwich on wax paper."
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
            <Box>
              <Box className="card_content">
                <Typography variant="h2" className="card_title">
                  Create an Election
                </Typography>
                <Box className="card_text">
                  <p>
                    Online Voting Application comes with very easy and proper validated
                    interface to create an election more accurately and easily.
                  </p>
                  <hr />
                  <p>
                    Also you can get the information of the previously created election as your current 
                    election.
                  </p>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box minWidth={1}>
              <img
                src={feature2}
                alt="a Reuben sandwich on wax paper."
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
            <Box>
              <Box className="card_content">
                <Typography variant="h2" className="card_title">
                  Safe Voting
                </Typography>
                <Box className="card_text">
                  <p>
                    Safe Voting can be customised during the election creation. Safe Votine means
                    election creater will be able to define the voter to ensure that no outsider is allowed 
                    to cast the vote in the election.
                  </p>
                  <hr />
                  <p>
                    This a very important feature to online voting app as you will be able the 
                    secure the vote and providing a proper outcome for the election
                  </p>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box minWidth={1}>
              <img
                src={feature3}
                alt="a Reuben sandwich on wax paper."
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </Box>
            <Box>
              <Box className="card_content">
                <Typography variant="h2" className="card_title">
                  Voter's Dashboard
                </Typography>
                <Box className="card_text">
                  <p>
                    The best thing is you can now view your activity done in your own dashboard.
                    It involes the elections you have particiapted, election you have conducted, etc.

                  </p>
                  <hr />
                  <p>
                    Also you are able to view what is going on or what happened in your past eleciton or
                    the last election you have joined.
                  </p>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

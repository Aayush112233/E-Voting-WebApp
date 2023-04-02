import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import "../assets/customCss/customCard.css";
import feature1 from "../assets/images/Features.png"


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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
                  </p>
                  <hr />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
                  </p>
                </Box>
              </Box>
            </Box>
          </Grid>
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
                  Safe Voting
                </Typography>
                <Box className="card_text">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
                  </p>
                  <hr />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
                  </p>
                </Box>
              </Box>
            </Box>
          </Grid>
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
                  Voter's Dashboard
                </Typography>
                <Box className="card_text">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
                  </p>
                  <hr />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Distinctio corporis eligendi nobis veritatis dignissimos
                    quasi quae dicta velit odit fuga, commodi quisquam
                    temporibus vero porro sequi rem labore doloribus maiores?
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

import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

const Notification = () => {
  return (
    <>
      <List
        sx={{
          width: "100%",
        //   maxWidth: "500px",
          backgroundColor: "gray",
          color: "white",
          borderRadius: "15px",
          ariaHidden:"true"
        }}
      >
        <Typography sx={{marginLeft:"15px"}} fontSize={"15px"}>Notifications</Typography>

        <ListItem>
          <ListItemAvatar>
            <Avatar>Image1</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Photos" secondary="Jan 9, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>Image2</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Work" secondary="Jan 7, 2014" />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>Image3</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Vacation" secondary="July 20, 2014" />
        </ListItem>
      </List>
    </>
  );
};

export default Notification;

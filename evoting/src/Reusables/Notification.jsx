import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { Circle } from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import { API } from "../baseUrlProvider";
import "../assets/customCss/customScroll.css"

const Notification = ({ getAllNotifications, notifications }) => {
  const navigate = useNavigate();
  console.log("THE NOTTIFICATION", notifications);

  const handleItemClick = async (item) => {
    await API.put(`/user/updateNotification/${item._id}`)
      .then((res) => {
        console.log(res);
        getAllNotifications();
      })
      .catch((err) => {
        console.log(err);
      });

    if (item.type === "Inquiry") {
      navigate("/admin/systemReport");
    } else {
      navigate("/admin/electionManagement");
    }
  };
  return (
    <>
      <List
      className="scrollDiv"
        sx={{
          width: "100%",
          //   maxWidth: "500px",
          backgroundColor: "white",
          color: "black",
          borderRadius: "15px",
          ariaHidden: "true",
          maxHeight: "500px",
          overflow: "auto",
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
        }}
      >
        <Typography sx={{ marginLeft: "15px" }} fontSize={"20px"}>
          Notifications
        </Typography>
        {notifications?.map((item, index) => (
          <>
            <ListItem
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
              onClick={() => {
                handleItemClick(item);
              }}
            >
              {!item.isSeen ? (
                <ListItemIcon
                  sx={{
                    minWidth: "32px",
                    fontSize: "10px",
                  }}
                >
                  <Circle
                    fontSize="1px"
                    sx={{ position: "relative", color: "blue" }}
                  />
                </ListItemIcon>
              ) : (
                <ListItemIcon
                  sx={{
                    minWidth: "32px",
                    fontSize: "15px",
                  }}
                >
                  <DoneAllIcon
                    fontSize="1px"
                    sx={{ position: "relative", color: "gray" }}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.notification}
                primaryTypographyProps={{
                  style: {
                    fontWeight: item.isSeen ? "normal" : "bold",
                    color: item.isSeen ? "gray" : "bold",
                  },
                }}
              />
            </ListItem>
            {index !== notifications.length - 1 && (
              <Divider sx={{ width: "100%" }} />
            )}
          </>
        ))}
      </List>
    </>
  );
};

export default Notification;

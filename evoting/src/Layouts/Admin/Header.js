import React, { useEffect } from "react";
import { Avatar, Badge, Box, Fade, Tooltip } from "@mui/material";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Notification from "../../Reusables/Notification";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { MdDarkMode } from "react-icons/md";
import { MdCircleNotifications } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginOutService } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";
import { API } from "../../baseUrlProvider";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Header = ({ setDark, setOpen, open, dark }) => {
  const [notification, setNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userState);
  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const getAllNotifications = () => {
    API.get("/user/getAdminNotification")
      .then((res) => {
        setNotifications(res.data.notifications);
        notificationCounts(res.data.notifications);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const notificationCounts = (data) => {
    const count = data?.filter((item) => item.isSeen == false);
    const number = count.length;
    setNotificationCount(number);
  };
  return (
    <AppBar position="fixed" open={open} sx={{ backgroundColor: "white" }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            color: "black",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <div
          style={{
            display: "flex",
            width: "150px",
            padding: "5px",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2, color: "black" }}
              aria-controls={menuOpen ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <Avatar src={userData.userInfo?.profileImage}></Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                borderRadius: "20px",
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 2,
                  right: 25,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ padding: "10px" }}>
              <Typography style={{ fontSize: "18px", fontWeight: "bolder" }}>
                Logged In as :
              </Typography>
              <Typography style={{ fontSize: "14px", fontWeight: "600" }}>
                {userData.userInfo?.firstName +
                  " " +
                  userData.userInfo?.lastName}
              </Typography>
              <Typography style={{ color: "GrayText" }}>
                {userData.userInfo?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => navigate("profile")}>
              <ListItemIcon>
                <Settings style={{ position: "relative" }} fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(loginOutService());
                navigate("/login");
              }}
            >
              <ListItemIcon>
                <Logout style={{ position: "relative" }} fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          <ClickAwayListener
            mouseEvent="onMouseDown"
            touchEvent="onTouchStart"
            onClickAway={() => {
              setNotification(false);
            }}
          >
            <div>
              <Badge badgeContent={notificationCount} color="secondary">
                <MdCircleNotifications
                  onClick={() => {
                    setNotification(!notification);
                  }}
                  style={{
                    position: "relative",
                    mt: "10px",
                    cursor: "pointer",
                    color: "black",
                  }}
                  size={"40px"}
                />
              </Badge>

              <Fade
                in={notification}
                style={{
                  width: 1,
                  transitionDelay: notification ? "100ms" : "0ms",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 65,
                    right: 70,
                    width: "180%",
                  }}
                >
                  <Notification
                    getAllNotifications={getAllNotifications}
                    notifications={notifications}
                  />
                </div>
              </Fade>
            </div>
          </ClickAwayListener>
          {/* <IconButton
            onClick={() => {
              dispatch(darkModeService());
            }}
          >
            {dark ? (
              <MdDarkMode
                style={{ position: "relative", mt: "10px" }}
                size={"30px"}
              />
            ) : (
              <MdOutlineDarkMode
                style={{ position: "relative", mt: "10px" }}
                size={"30px"}
              />
            )}
          </IconButton> */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

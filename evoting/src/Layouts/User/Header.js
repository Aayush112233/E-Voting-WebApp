import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { BsFillBellFill } from "react-icons/bs";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Alert, AlertTitle, Avatar, Badge, Box, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { loginOutService } from "../../Services/authServices";
import { API } from "../../baseUrlProvider";
import logo from "../../assets/images/Logo.png";

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

export const Header = ({ setOpen, open }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState(new Date());
  const [upcommingElection, setUpcommingElection] = useState("");
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
    getDate();
    getLatestAlert();
  }, []);

  const getLatestAlert = () => {
    API.get(`/election/getNearestElection`)
      .then((res) => {
        console.log("The data", res.data.upcomingElections[0].election_info[0]);
        setUpcommingElection(res.data.upcomingElections[0].election_info[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[time.getDay()];

  useEffect(() => {
    const timerID = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const getTimeLeft = (date) => {
    const now = new Date();
    const electionStartDate = new Date(date);
    const timeDiff = electionStartDate.getTime() - now.getTime();
    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${daysLeft} days, ${hoursLeft} hours, ${minutesLeft} minutes, ${secondsLeft} seconds`;
  };

  const getDate = () => {
    var today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    setDate(formattedDate);
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: "none",
        border: "none",
        boxShadow: "none",
        color: "black",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <div style={{ flexGrow: "1" }}>
          <Typography
            variant="body2"
            fontSize={"16px"}
            noWrap
            fontWeight={"bold"}
            component="div"
            color={"#212121"}
          >
            {date}
          </Typography>
          <Typography variant="body2" noWrap component="div" color={"gray"}>
            {time.toLocaleTimeString() + " " + dayOfWeek}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            minWidth: "80px",
            marginRight: "20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Alert
            sx={{
              position: "relative",
              "& .MuiAlert-icon": {
                position: "relative",
                top: 6,
                right: 10,
                marginRight: "20px",
              },
              borderRadius: "20px",
            }}
            severity="success"
            color="info"
          >
            {upcommingElection ? (
              <>
                Upcoming Election{" "}
                <span style={{ fontWeight: "bold" }}>
                  {upcommingElection.electionName}
                </span>{" "}
                — Starts in {getTimeLeft(upcommingElection.electionStartDate)}
              </>
            ) : (
              "No Upcoming Election"
            )}
          </Alert>
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

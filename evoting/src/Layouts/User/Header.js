import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { BsFillBellFill } from "react-icons/bs";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";

import IconButton from "@mui/material/IconButton";
import { Avatar, Badge } from "@mui/material";
import { useSelector } from "react-redux";

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
  const {userData} = useSelector((state)=> state.userState)
  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    getDate();
  }, []);

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

  useEffect(()=>{

  },[])

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
        color:"black"
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
        <div style={{ display: "flex", gap: "1rem", minWidth:"80px", marginRight:"20px",justifyContent:"space-between", alignItems:"center" }}>
          <Badge badgeContent={4} color="success"> 
          <IconButton sx={{marginRight:"10px"}}>
            <BsFillBellFill />
          </IconButton>
          </Badge>
          <Avatar alt="R" src={userData.userInfo?.profileImage} sx={{ width: 32, height: 32, cursor:"pointer" }}></Avatar>

        </div>
      </Toolbar>
    </AppBar>
  );
};

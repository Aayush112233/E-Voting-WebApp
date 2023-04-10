import React from "react";
import MuiDrawer from "@mui/material/Drawer";
import { removeCookies } from "../../config/storageUtil";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SiGoogleanalytics } from "react-icons/si";
import { FaMizuni } from "react-icons/fa";
import { FaGrinAlt } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { TbMessageReport } from "react-icons/tb";
import { BiLogOut } from "react-icons/bi";
import MainPage from "../../components/AdminDashboard/Main/MainPage";
import UserManagement from "../../components/AdminDashboard/UserManagement/UserManagement";
import ElectionManagement from "../../components/AdminDashboard/ElectionManagement/ElectionManagement";
import SystemReport from "../../components/AdminDashboard/SystemReport/SystemReport";
import {
  Box,
  Divider,
  styled,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Avatar,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo.png";

import { useMemo } from "react";
import { useState } from "react";
import Content from "./Content";
import ProfileManagement from "../../Reusables/ProfileManagement";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const StyledList = styled(List)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "#212a8f",
    "&, & .MuiListItemIcon-root": {
      color: "white",
      borderRadius: "30px 5px 5px 30px",
    },
  },
  // hover states
  "& .MuiListItemButton-root:hover": {
    backgroundColor: "#e6e6e6",
    "&, & .MuiListItemIcon-root": {
      color: "black",
    },
  },
});

export const SideList = ({ open, setOpen }) => {
  const NavList = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: <SiGoogleanalytics />,
        link: "",
        component: MainPage,
      },
      {
        title: "User Management",
        icon: <AiOutlineUser />,
        link: "users",
        component: UserManagement,
      },
      {
        title: "Election Management",
        icon: <FaMizuni />,
        link: "electionManagement",
        component: ElectionManagement,
      },
      {
        title: "Profile Management",
        icon: <FaGrinAlt />,
        link: "profile",
        component: ProfileManagement,
      },
      {
        title: "System Inquiries",
        icon: <TbMessageReport />,
        link: "systemReport",
        component: SystemReport,
      },
    ],
    []
  );
  const [selectedLink, setSelectedLink] = useState("");
  const navigate = useNavigate();
  const handleLogOut = async () => {
    removeCookies("token");
    navigate("/");
  };

  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            mt: 6,
          }}
        >
          {NavList.map((item) => (
            <>
              <StyledList key={item.title} disablePadding>
                <ListItemButton
                  sx={{
                    display: "flex",
                    alignContent: "center",
                  }}
                  onClick={() => navigate(item.link)}
                  selected={selectedLink === item.link}
                >
                  <ListItemIcon
                    sx={{ position: "relative", marginBottom: 1.5 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: selectedLink === item.link ? "white" : null,
                    }}
                  />
                </ListItemButton>
              </StyledList>
              
            </>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: "white"}}
      >
        <DrawerHeader />
        <Content setSelectedLink={setSelectedLink} />
      </Box>
    </>
  );
};

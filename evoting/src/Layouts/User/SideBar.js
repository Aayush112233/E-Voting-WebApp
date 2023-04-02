import { Avatar, Box, Card, styled, Toolbar, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import { SiGoogleanalytics } from "react-icons/si";
import { FaMizuni } from "react-icons/fa";
import { FaGrinAlt } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMemo } from "react";
import UserContent from "./UserContent";
import { useSelector } from "react-redux";
import { Api } from "@mui/icons-material";
const drawerWidth = 240;
const StyledList = styled(List)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "#ecf9f0",
    borderRight: "4px solid",
    "&, & .MuiListItemIcon-root": {
      borderRadius: "30px 5px 5px 30px",
      color: "green",
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
const SideBar = ({ mobileOpen, setMobileOpen }) => {
  const NavList = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: <SiGoogleanalytics />,
        link: "",
      },
      {
        title: "Join Election",
        icon: <AiOutlineUser />,
        link: "joinElection",
      },
      {
        title: "Create Election",
        icon: <FaMizuni />,
        link: "createElection",
      },
      {
        title: "Setting",
        icon: <FaGrinAlt />,
        link: "profile",
      },
      // {
      //   title: "System Reports",
      //   icon: <TbMessageReport />,
      //   link: "systemReport",
      // },
    ],
    []
  );
  const [selectedLink, setSelectedLink] = useState("");
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userState);
  const handleDrawerToggle = () => {
    setMobileOpen(false);
  };
  const DrawerInfo = () => {
    return (
      <>
        <Box sx={{ padding: "10px", marginX: "auto", mt: 2 }}>
          <img
            style={{
              height: "auto",
              width: "150px",
              mixBlendMode: "multiply",
            }}
            src="https://wevote.ng/wp-content/uploads/2021/02/We-Vote-webLogo2.png"
          ></img>
        </Box>
        <Box sx={{ padding: "10px", w: 1, mt: 2 }}>
          <Box
            sx={{
              backgroundColor: "#f5f6f8",
              padding: "10px",
              w: "100%",
              maxHeight: "100px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Avatar alt="Remy Sharp" src={userData.userInfo?.profileImage} />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {userData.userInfo?.firstName + " " + userData.userInfo?.lastName}
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  const drawer = (
    <div>
      <Toolbar />
      <DrawerInfo />      
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
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
                <ListItemIcon sx={{ position: "relative", marginBottom: 1.5 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    opacity: mobileOpen ? 1 : 0,
                    color: selectedLink === item.link ? "green" : null,
                  }}
                />
              </ListItemButton>
            </StyledList>
          </>
        ))}
      </List>
    </div>
  );
  return (
    <>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >          
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
        <DrawerInfo />
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
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
                        color: selectedLink === item.link ? "green" : null,
                      }}
                    />
                  </ListItemButton>
                </StyledList>
              </>
            ))}
          </List>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "92vh",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <UserContent setSelectedLink={setSelectedLink} />
      </Box>
    </>
  );
};

export default SideBar;

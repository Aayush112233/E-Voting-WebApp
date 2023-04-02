import { Grid, Typography, Box, Divider, styled } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { GrUserSettings } from "react-icons/gr";
import { MdStreetview } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import OverView from "../components/AdminDashboard/ProfileManagement/OverView";
import ChangePassword from "../components/AdminDashboard/ProfileManagement/ChangePassword";
import ManageInformation from "../components/AdminDashboard/ProfileManagement/ManageInformation";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { useNavigate } from "react-router-dom";
const ProfileManagement = ({ setSelectedLink, link }) => {
  useEffect(() => {
    setSelectedLink(link);
  }, []);
  
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(true);

  const navigate = useNavigate();
  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const IconStyle = { position: "relative", fontSize: "20px" };

  const drawer = (
    <div>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("")}>
            <ListItemIcon>
              <MdStreetview style={IconStyle} />
            </ListItemIcon>
            <ListItemText primary={"Overview"} />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ width: "100%" }}></Divider>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("manageInformation")}>
            <ListItemIcon>
              <GrUserSettings style={IconStyle} />
            </ListItemIcon>
            <ListItemText primary={"Manage Information"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("changePassword")}>
            <ListItemIcon>
              <RiLockPasswordLine style={IconStyle} />
            </ListItemIcon>
            <ListItemText primary={"Change Password"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        alignItems="center"
        spacing={2}
        width={1}
        overflow={"auto"}
        padding={1}
      >
        <Grid
          item
          xs={12}
          md={8}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
        >
          <Box
            sx={{
              padding: {
                sm: "20px",
                xs: "5px",
              },
              borderRadius: "10px",
              position: "relative",
              backgroundColor: "white",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  md: "2rem",
                },
                mb: 2,
              }}
              color={"gray"}
              align={"center"}
            >
              Manage Profile
            </Typography>
            <Box sx={{ display: "flex", minHeight: "500px" }}>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: "none", md: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                    minHeight: "50vh",
                    position: "relative",
                  },
                  "& .MuiDrawer-root": {
                    minHeight: "100%",
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
              <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, overflow: "auto" }}
              >
                {/* <DrawerHeader /> */}
                <Routes>
                  <Route path="" element={<OverView />} />
                  <Route path="changePassword" element={<ChangePassword />} />
                  <Route
                    path="manageInformation"
                    element={<ManageInformation />}
                  />
                </Routes>
              </Box>
            </Box>
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{
                position: "absolute",
                display: {
                  xs: "flex",
                  md: "none",
                },

                bottom: 0,
                right: 0,
              }}
              icon={
                <SpeedDialIcon sx={{ position: "absolute", left: "30%" }} />
              }
            >
              <SpeedDialAction
                icon={<MdStreetview style={IconStyle} />}
                tooltipTitle={"Overview"}
                onClick={() => {
                  navigate("");
                }}
              />
              <SpeedDialAction
                icon={<GrUserSettings style={IconStyle} />}
                tooltipTitle={"Profile Setting"}
                onClick={() => {
                  navigate("manageInformation");
                }}
              />
              <SpeedDialAction
                icon={<RiLockPasswordLine style={IconStyle} />}
                tooltipTitle={"Change Password"}
                onClick={() => {
                  navigate("changePassword");
                }}
              />
            </SpeedDial>
          </Box>
          
        </Grid>
      </Grid>
    </>
  );
};

export default ProfileManagement;

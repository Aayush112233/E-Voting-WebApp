import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import styled from "@emotion/styled";
import { Grid, Slide } from "@mui/material";
import { Link } from "react-router-dom";
import { isAuth, removeCookies } from "../config/storageUtil";
import { useNavigate } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { loginOutService } from "../Services/authServices";
import { useEffect } from "react";
import logo from "../assets/images/Logo.png";
const items = [
  {
    name: "Home",
    to: "home",
  },
  {
    name: "Features",
    to: "features",
  },
  {
    name: "About Us",
    to: "aboutUs",
  },
  {
    name: "Contact Us",
    to: "contactUs",
  },
];

export const NavigationBar = (props) => {
  const { scroll } = props;
  const dispatch = useDispatch();
  const appBarSytle = {
    background: "none",
    color: "black",
    boxShadow: "none",
    paddingTop: "10px",
    backdropFilter: "blur(8px)",
  };
  const ButtonCustom = styled(Button)(({ theme }) => ({
    background: "none",
    border: "1px solid black",
    borderRadius: "20px",
    color: "black",
    paddingLeft: "20px",
    paddingRight: "20px",
    "&:hover": {
      backgroundColor: "#ffffff",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#black",
      color: "white",
    },
  }));

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [role, setRole] = React.useState();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.userState);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  useEffect(() => {
    if (userData.userInfo) {
      setRole(userData.userInfo.role);
    }
  }, [userData]);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    removeCookies("token");
    navigate("/login");
  };

  const handleDashboard = () => {
    if (role === "user") {
      navigate("/users");
    } else {
      navigate("/admin");
    }
  };
  const handleProfileSetting = () => {
    if (role === "user") {
      navigate("users/profile/manageInformation");
    } else {
      navigate("admin/profile/manageInformation");
    }
  };

  return (
    <>
      <AppBar sx={appBarSytle}>
        <Container>
          <Toolbar disableGutters>
            <Avatar src={logo} sx={{ width: 70, height: 70, mr:2 }}></Avatar>

            <Box sx={{ flexGrow: 1.5, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {items.map((page) => (
                  <MenuItem
                    color="black"
                    key={page.name}
                    onClick={() => {
                      scroll(page.to);
                    }}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
                <MenuItem color="black">
                  <Link
                    to={"/login"}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <Typography textAlign="center">
                      Sign In / Sign Up
                    </Typography>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                textAlign: "end",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                justifyContent: "end",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {items.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => {
                    scroll(page.to);
                  }}
                  sx={{
                    my: 2,
                    color: "black",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            {isAuth() ? (
              <>
                <Box
                  sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginRight: "20px",
                    }}
                    to="/login"
                  >
                    <ButtonCustom
                      sx={{
                        display: { xs: "none", md: "flex", fontWeight: "bold" },
                        background: "white",
                      }}
                      onClick={() => {
                        dispatch(loginOutService());
                      }}
                    >
                      Logout
                    </ButtonCustom>
                  </Link>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <HiDotsVertical style={{ position: "relative" }} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    disableScrollLock={true}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleDashboard}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleProfileSetting}>
                      <Typography textAlign="center">
                        Profile Setting
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginRight: "20px",
                  }}
                  to="/login"
                  state={{ formStatus: "register" }}
                >
                  <ButtonCustom
                    sx={{
                      display: { xs: "none", md: "flex", fontWeight: "bold" },
                      background: "white",
                    }}
                  >
                    Sign Up
                  </ButtonCustom>
                </Link>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to="/login"
                  state={{ formStatus: "login" }}
                >
                  <Button
                    sx={{
                      display: { xs: "none", md: "flex", fontWeight: "bold" },
                      color: "black",
                      borderRadius: "20px",
                      border: "1px solid black",
                      backgroundColor: "white",
                      px: 4,
                    }}
                  >
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

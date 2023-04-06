import * as React from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { useState } from "react";
import { SideList } from "../Layouts/Admin/SideList";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserListService } from "../Services/authServices";
import { getCookie } from "../config/storageUtil";
import { Header } from "../Layouts/Admin/Header";
import axios from "axios";

export default function AdminDashboard({ children }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [userRole, setUserRole] = useState("");
  const { userData } = useSelector((state) => state.userState);
  const { darkTheme } = useSelector((state) => state.darkModeState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      setUserRole(userData.userInfo?.role);
    }
  }, [userData]);

  const darkStatus = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkTheme ? "light" : "dark",
        },
      }),
    [darkTheme]
  );

  useEffect(() => {
    dispatch(fetchUserListService());    
  }, []);

  return (
    <>
      <ThemeProvider theme={darkStatus}>
        {userRole == "admin" && userRole !== "" && userRole !== undefined ? (
          <Box sx={{ display: "flex", margin: 0, backgroundColor: "#e6e6e6" }}>
            <Header
              setDark={setDark}
              dark={dark}
              setOpen={setOpen}
              open={open}
            />
            <SideList {...{ open, setOpen, children }} />
          </Box>
        ) : null}
      </ThemeProvider>
      {userRole !== "admin" && userRole !== undefined && userRole !== "" ? (
        <Navigate to="/403" />
      ) : null}
    </>
  );
}

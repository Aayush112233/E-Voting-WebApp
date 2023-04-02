import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminRoute } from "./Private/AdminRoutes";
import { LandingPage } from "../views/LandingPage";
import { LoginPage } from "../views/LoginPage";
import AdminDashboard from "../views/AdminDashboard";
import ElectionManagement from "../components/AdminDashboard/ElectionManagement/ElectionManagement";
import { UnAuthorized } from "../Reusables/UnAuthorized";
import { UserRoutes } from "./Private/UserRoutes";
import UserDashboard from "../views/UserDashboard";
import NotFound from "../Reusables/NotFound";
import { fetchUserListService } from "../Services/authServices";
import { useDispatch } from "react-redux";
import { isAuth } from "../config/storageUtil";
import Reset from "../Reusables/Reset";
import VotePage from "../components/UserDashboard/JoinElection/VotePage";

export const MainRoutes = () => {
  const dispatch = useDispatch();
  if (isAuth()) {
    dispatch(fetchUserListService());
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          <Route element={<UserRoutes />}>
            <Route path="/users/*" element={<UserDashboard />} />
            <Route path="/vote/:id" element={<VotePage />} />
          </Route>
          <Route path="/403" element={<UnAuthorized />}></Route>
          <Route path="/reset/:id?/:token?" element={<Reset />}></Route>
          {/* <Route path="/reset" element={<Reset />}></Route> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

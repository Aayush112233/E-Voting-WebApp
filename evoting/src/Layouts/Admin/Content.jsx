import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "../../components/AdminDashboard/Main/MainPage";
import UserManagement from "../../components/AdminDashboard/UserManagement/UserManagement";
import ElectionManagement from "../../components/AdminDashboard/ElectionManagement/ElectionManagement";
import SystemReport from "../../components/AdminDashboard/SystemReport/SystemReport";
import ProfileManagement from "../../Reusables/ProfileManagement";


const Content = ({setSelectedLink}) => {
  return (
    <Routes>
      <Route
        path=""
        element={<MainPage {...{ setSelectedLink, link: "" }} />}
      />
      <Route
        path="electionManagement"
        element={
          <ElectionManagement
            {...{ setSelectedLink, link: "electionManagement" }}
          />
        }
      />
      <Route
        path="users"
        element={<UserManagement {...{ setSelectedLink, link: "users" }} />}
      />
      <Route
        path="profile/*"
        element={
          <ProfileManagement {...{ setSelectedLink, link: "profile" }} />
        }
      />
      <Route
        path="electionManagement"
        element={
          <ElectionManagement
            {...{ setSelectedLink, link: "electionManagement" }}
          />
        }
      />
      <Route
        path="systemReport"
        element={
          <SystemReport {...{ setSelectedLink, link: "systemReport" }} />
        }
      />
    </Routes>
  );
};

export default Content;

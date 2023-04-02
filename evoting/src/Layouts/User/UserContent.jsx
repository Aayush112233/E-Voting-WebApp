import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Main from "../../components/UserDashboard/Main/Main";
import JoinElection from "../../components/UserDashboard/JoinElection/JoinElection";
import StepForm from "../../components/UserDashboard/CreateElection/StepForm";
import ProfileManagement from "../../Reusables/ProfileManagement";
import VotePage from "../../components/UserDashboard/JoinElection/VotePage";
import ViewPage from "../../components/UserDashboard/JoinElection/ViewPage";
const UserContent = ({ setSelectedLink }) => {
  return (
    <Routes>
      <Route path="" element={<Main {...{ setSelectedLink, link: "" }} />} />
      <Route
        path="joinElection"
        element={
          <JoinElection {...{ setSelectedLink, link: "joinElection" }} />
        }
      />
      <Route
        path="createElection"
        element={<StepForm {...{ setSelectedLink, link: "createElection" }} />}
      />
      <Route
        path="profile/*"
        element={
          <ProfileManagement {...{ setSelectedLink, link: "profile" }} />
        }
      />
      <Route
        path="vote/:id?"
        element={
          <VotePage />
        }
      />
      <Route
        path="viewElection/:id?"
        element={
          <ViewPage />
        }
      />
    </Routes>
  );
};

export default UserContent;

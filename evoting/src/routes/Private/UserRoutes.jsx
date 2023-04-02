import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Navigate, Outlet, Route } from "react-router-dom";
import { isAuth } from "../../config/storageUtil";
import { fetchUserListService } from "../../Services/authServices";

export const UserRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");
  const { userData } = useSelector((state) => state.userState);

  useEffect(() => {
    if (isAuth()) {
      dispatch(fetchUserListService());
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setUserRole(userData.userInfo?.role);
    }
  }, [userData]);

  if (isAuth()) {
    if (Object.keys(userData).length > 0 && userRole) {
      if (userRole === "user") {
        return <Outlet />;
      } else if (userRole !== "user") {
        return <Navigate to="/403" replace state={{ from: location }} />;
      }
    }
  } else {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

import { useLocation } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { isAuth } from "../../config/storageUtil";

export const AdminRoute = () => {
  const location = useLocation();
  if (isAuth()) {   
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
};

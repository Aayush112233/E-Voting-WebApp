import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import SideBar from "../Layouts/User/SideBar";
import { Header } from "../Layouts/User/Header";

function UserDashboard() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Header setOpen={setMobileOpen} open={mobileOpen} />
      <SideBar {...{ mobileOpen, setMobileOpen }} />
    </Box>
  );
}

UserDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default UserDashboard;

import {styled} from "@mui/material";
import { Card, CardContent, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { useDispatch } from "react-redux";
import AddUser from "./AddUser";
import ManageUser from "./ManageUser";
import { fetchAllUser } from "../../../Services/adminServices";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserManagement = ({ setSelectedLink, link }) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    setSelectedLink(link);
    getAllUserData();
  }, []);
  const getAllUserData = () => {
    dispatch(fetchAllUser());
  };

  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    width: "100%",
  }));

  const CustomTab = styled(Tab)(({ theme }) => ({
    textTransform: "none",
   fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&.Mui-focusVisible": {
      backgroundColor: "rgba(100, 95, 228, 0.32)",
    },
  }));

  return (
    <CustomBox>
      <Box
        sx={{
          width: {
            lg: "80%",
            xs: "90%",
          },
          mt: 3,
        }}
      >
        <Card>
          <CardContent>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <CustomTab
                  style={{ textAlign: "center" }}
                  icon={
                    <FiUserPlus
                      style={{ position: "relative", fontSize: "20px" }}
                    />
                  }
                  label="Add User"
                  {...a11yProps(0)}
                />
                <CustomTab
                  icon={
                    <HiUserGroup
                      style={{ position: "relative", fontSize: "20px" }}
                    />
                  }
                  label="Manage User"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <AddUser />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ManageUser />
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </CustomBox>
  );
};

export default UserManagement;

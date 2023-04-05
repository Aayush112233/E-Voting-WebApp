import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, TextField, styled } from "@mui/material";
import { API } from "../../../baseUrlProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import PageviewIcon from "@mui/icons-material/Pageview";
import ViewInquiry from "./ViewInquiry";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "black",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const SystemReport = ({ setSelectedLink, link }) => {
  const [allInquiries, setAllInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setSelectedLink(link);
    getAllInquiries();
  }, []);

  const getAllInquiries = () => {
    API.get("/user/getAllInquiries")
      .then((res) => {
        setAllInquiries(res.data.inquiries);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const messageConifg = (message) => {
    if (message.length > 70) {
      const newMessage = message.split(0, 70) + "...";
      return newMessage;
    } else {
      return message;
    }
  };

  const handleView = (item) => {
    setSelectedInquiry(item);
    setOpen(true);
  };

  const NoRows = () => {
    if (allInquiries.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert
                sx={{
                  position: "relative",
                  "& .MuiAlert-icon": {
                    position: "relative",
                    top: 6,
                    right: 10,
                    marginRight: "20px",
                  },
                }}
                severity="info"
              >
                No Data
              </Alert>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <Box sx={{ maxHeight: "100%", overflow: "auto" }}>
      <Grid container justifyContent={"center"} mb={2}>
        <Typography variant="h4" textAlign={"center"}>
          System Inquiries
        </Typography>
      </Grid>
      <Grid container justifyContent={"center"}>
        <TableContainer
          component={Paper}
          sx={{
            width: {
              sm: "70%",
              xs: "95%",
            },
          }}
        >
          <Table sx={{ width: 1 }} aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
                >
                  S.N
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
                >
                  Full Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
                >
                  Message
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <>
                {allInquiries.map((item, index) => {
                  const SN = index + 1;
                  return (
                    <>
                      <StyledTableRow
                        // key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell
                          align="center"
                          sx={{ maxWidth: "60px" }}
                        >
                          {SN}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.fullName}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {item.email}
                        </StyledTableCell>
                        <StyledTableCell sx={{ minWidth: "150px" }}>
                          {messageConifg(item.message)}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <IconButton
                            onClick={() => {
                              handleView(item);
                            }}
                          >
                            <PageviewIcon style={{ position: "relative" }} />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  );
                })}
              </>
              <NoRows />
            </TableBody>
          </Table>
        </TableContainer>
        <ViewInquiry
          open={open}
          setOpen={setOpen}
          selectedInquiry={selectedInquiry}
        />
      </Grid>
    </Box>
  );
};

export default SystemReport;

import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DeleteUser, fetchAllUser } from "../../../Services/adminServices";
import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { AiTwotoneDelete } from "react-icons/ai";
import DeleteConfirm from "../../../Reusables/DeleteConfirm";
import EditUser from "./EditUser";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    md: "50%",
    xs: "90%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ManageUser = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteUserDetails, setDeleteUser] = useState(false);
  const [editUserDetails, setEditUser] = useState(false);
  const { allUser } = useSelector((state) => state.adminState);
  const { userAddedStatus } = useSelector((state) => state.adminState);
  const [filteredUser, setFilterdUser] = useState([])
  const dispatch = useDispatch();
  useEffect(() => {
    setUserDetails(allUser.userInfo);
    
  }, [allUser]);

  useEffect(() => {
    if (userAddedStatus) {
      dispatch(fetchAllUser());
    }
  }, [userAddedStatus]);

  const deleteUser = async (user) => {
    setDeleteOpen(true);
    setDeleteUser(user);
  };

  const editUser = async (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleDelete = async () => {
    dispatch(DeleteUser(deleteUserDetails._id));
    setDeleteOpen(false);
  };
  const handleClose = () => {
    setEditOpen(false);
  };

  return (
    <>
      <Typography variant="h4" textAlign={"center"}>
        User Information Table
      </Typography>
      <TextField
          label="Search"
          helperText="Type to search for a row"
          size="small"
          sx={{
            ml: 4,
            "& .MuiSvgIcon-root": {
              position: "relative",
            },
          }}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      <TableContainer component={Paper} sx={{ mt: 5, maxHeight: "500px" }}>
        <Table
          stickyHeader
          sx={{ minWidth: 700 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>S.N</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Phone Number</StyledTableCell>
              <StyledTableCell align="right">Permanent Address</StyledTableCell>
              <StyledTableCell align="right">Temporary Address</StyledTableCell>
              <StyledTableCell align="right">Role</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {userDetails &&
                userDetails
                  .filter((row) =>
                    row.firstName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((row, index) => {
              const SN = index + 1;
              return (
                <>
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {SN}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.firstName + " " + row.lastName}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.email}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.contactInfo.phoneNumber}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.contactInfo.address.permanentAddress}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.contactInfo.address.temporaryAddress}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.role}</StyledTableCell>
                    <StyledTableCell
                      align="right"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: "1rem",
                      }}
                    >
                      <AiTwotoneDelete
                        onClick={() => {
                          deleteUser(row);
                        }}
                        style={{
                          position: "relative",
                          fontSize: "1.5rem",
                          cursor: "pointer",
                        }}
                      />
                      <AiTwotoneEdit
                        onClick={() => {
                          editUser(row);
                        }}
                        style={{
                          position: "relative",
                          fontSize: "1.5rem",
                          cursor: "pointer",
                        }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirm
        open={deleteOpen}
        handleClose={() => {
          setDeleteOpen(false);
        }}
        handleConfirm={handleDelete}
        titleMessage={"Are you sure?"}
        bodyMessage={`Do you want to remove the user ${
          deleteUserDetails.firstName + " " + deleteUserDetails.lastName
        }`}
      />
      <Modal
        open={editOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            fontWeignt="bold"
          >
            Edit User
          </Typography>
          <Grid container spacing={2} padding={2}>
            <EditUser userDetails={editUserDetails} setEditOpen={setEditOpen} />
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ManageUser;

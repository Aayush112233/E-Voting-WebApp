import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, IconButton, TextField, styled } from "@mui/material";
import { useState } from "react";
import PageviewIcon from "@mui/icons-material/Pageview";
import ElectionView from "./ElectionView";

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

export default function ManageElection({ elections, refreshTable }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedElection, setSelectedElection] = useState({});
  const [open, setOpen] = useState(false);

  const handleView = (data) => {
    setOpen(true)
    setSelectedElection(data)
  };
  return (
    <>
      <Box width={1} marginY={1}>
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
      </Box>
      <TableContainer component={Paper} sx={{width:"100%"}}>
        <Table sx={{ width: 1 }} aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}>
                S.N
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
              >
                Election Name
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
              >
                Starting Date
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
              >
                Ending Date
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
              >
                Organization Name
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "#2b2b2b", color: "#fafafa" }}
              >
                Election Code
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
            {elections &&
              elections
                .filter((row) =>
                  row.electionName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((row, index) => {
                  const SN = index + 1;
                  return (
                    <>
                      <StyledTableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {SN}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.electionName}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.electionStartDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.electionEndDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.organizationName}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.code}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            onClick={() => {
                              handleView(row);
                            }}
                          >
                            <PageviewIcon style={{ position: "relative" }} />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <ElectionView open={open} setOpen={setOpen} election={selectedElection} refreshTable={refreshTable} />
    </>
  );
}

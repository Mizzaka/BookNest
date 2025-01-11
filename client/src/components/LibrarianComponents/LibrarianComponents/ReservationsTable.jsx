import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";

const Row = ({ row, columns, onMarkAsBorrowed }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        {columns.map((column) => (
          <TableCell key={column.field}>{row[column.field]}</TableCell>
        ))}
        <TableCell>
          {row.status === "active" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onMarkAsBorrowed(row)}
            >
              Mark as Borrowed
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={columns.length + 2}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body2">
                Additional details can go here.
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ReservationsTable = ({ data, columns, onMarkAsBorrowed }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((column) => (
              <TableCell key={column.field}>{column.title}</TableCell>
            ))}
            <TableCell>Manage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row
              key={row._id}
              row={row}
              columns={columns}
              onMarkAsBorrowed={onMarkAsBorrowed}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReservationsTable;

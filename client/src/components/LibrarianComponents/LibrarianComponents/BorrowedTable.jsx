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

const Row = ({ row, columns, onMakeActive, onDelete }) => {
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
          {row.status === "issued" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>  onMakeActive(row)}
            >
              Make Active
            </Button>
          ) : (
            <IconButton color="error" onClick={() => onDelete(row.id)}>
              <Delete />
            </IconButton>
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

const BorrowedTable = ({ data, columns, onMarkAsBorrowed }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Handle Delete Dialog
  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setSelectedRow(id);
  };

  const confirmDelete = () => {
    console.log("Delete confirmed for ID:", selectedRow);
    setDeleteDialogOpen(false);
    // Perform the delete logic here (e.g., update the state or call an API)
  };

  return (
    <>
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
                key={row.id}
                row={row}
                columns={columns}
                onMarkAsBorrowed={onMarkAsBorrowed}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reservation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BorrowedTable;

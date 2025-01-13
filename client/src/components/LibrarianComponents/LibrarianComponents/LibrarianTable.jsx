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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const Row = ({ row, columns, onEdit, onDelete }) => {
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
          <IconButton color="primary" onClick={() => onEdit(row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(row.id || row._id)}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="body2">Additional details can go here.</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const LibrarianTable = ({ data, columns, onEdit, onDeleteSuccess }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleOpenDeleteDialog = (id) => {
    setSelectedRowId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRowId) {
      console.error("No ID provided for deletion.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/librarians/${selectedRowId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Add token if required
      });
      console.log("Deleted librarian with ID:", selectedRowId);
      onDeleteSuccess(selectedRowId); // Notify parent to update state
      setDeleteDialogOpen(false);
      alert("Librarian deleted successfully!");
    } catch (error) {
      console.error("Error deleting librarian:", error.response?.data || error.message);
    }
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
                key={row.id || row._id}
                row={row}
                columns={columns}
                onEdit={onEdit}
                onDelete={handleOpenDeleteDialog}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this librarian? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LibrarianTable;

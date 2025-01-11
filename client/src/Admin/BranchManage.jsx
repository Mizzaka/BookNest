import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material"; // Add Dialog here
import AddIcon from "@mui/icons-material/Add";
import Adminnavbar from "../components/AdminNavbar";
import BranchTable from "../components/BranchComponents/BranchTable";
import TotalCard from "../components/TotalCard";
import BranchForm from "../components/BranchForm";
import UpdateBranchForm from "../components/UpdateBranchForm";
import axios from "axios"; // Import axios

const BranchManage = () => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]); // State to store branch data
  const [error, setError] = useState(null); // State to handle errors

  const branchColumns = [
    { field: "branchName", title: "Name" },
    { field: "location", title: "Location" },
    { field: "contactNumber", title: "Contact Number" },
    { 
      field: "librarians", 
      title: "Librarian(s)", 
      render: (rowData) => {
        console.log("Librarians Data:", rowData.librarians); // Debugging output
        return rowData.librarians.length > 0
          ? rowData.librarians.map(librarian => `${librarian.firstName} ${librarian.lastName}`).join(", ")
          : "No Librarians Assigned";
      }
    }
  ];
  

  // Fetch branches from the backend
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the JWT token
        console.log("Token:", token); // Log the token for debugging

        const response = await axios.get("http://localhost:5000/api/branches", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });

        console.log("Fetched branches data:", response.data); // Log the fetched data
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error); // Log the error details
        setError(error.response?.data?.message || "Error fetching branches");
      }
    };

    fetchBranches();
  }, []);

  const handleAddBranch = async (branchData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/branches", branchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("New Branch Created successfully!");
      // Add the new branch to the state to update the table
      setBranches([...branches, response.data]);
      setError(null);
    } catch (error) {
      console.error("Error adding branch:", error);
      setError(error.response?.data?.message || "Error adding branch");
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/branches/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Branch Updated successfully!");

      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch._id === response.data._id ? response.data : branch
        )
      );

      handleUpdateClose();
    } catch (error) {
      console.error("Error updating branch:", error);
    }
  };
  

  // Handlers for dialogs
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (branch) => {
    console.log("Branch selected for update:", branch); // Log the selected branch for update
    setSelectedBranch(branch);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const [adminName, setAdminName] = useState("");

  // Fetch admin name (simulate fetching from an API or localStorage)
  useEffect(() => {
    const storedAdminName = localStorage.getItem("adminName") || "Kasun";
    console.log("Admin name fetched:", storedAdminName); // Log the admin name
    setAdminName(storedAdminName);
  }, []);

  return (
    <>
      <Adminnavbar />

      <Box sx={{ padding: "40px" }}>
        <Typography variant="h4" sx={{ fontWeight: 500, marginBottom: 0, marginTop: 4 }}>
          Hello {adminName},
        </Typography>

        <Grid container spacing={3} sx={{ marginBottom: 4, marginLeft: 1 }}>
          <Grid item xs={12} sm={4}>
            <TotalCard title="Total Branch" value={branches.length} color="#34A853" />
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          sx={{ fontWeight: 800, marginBottom: 0, marginTop: 8, fontSize: 28 }}
        >
          Branch Manage
        </Typography>
        <div
          style={{
            textAlign: "right",
            marginBottom: "20px",
            marginRight: "30px",
          }}
        >
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Branch
          </Button>

          {/* Add Branch Dialog */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <BranchForm onClose={handleClose} onSubmit={handleAddBranch} />
          </Dialog>

          {/* Update Branch Dialog */}
          <Dialog open={updateOpen} onClose={handleUpdateClose} fullWidth maxWidth="sm">
            {selectedBranch && (
              <UpdateBranchForm
              initialData={selectedBranch}
              onSubmit={handleUpdateSubmit}
              onClose={handleUpdateClose}
            />
            )}
          </Dialog>
        </div>

        {/* Show error if any */}
        {error && <Typography color="error">{error}</Typography>}

        {/* Render branches in the table */}
        <BranchTable
  data={branches}
  columns={branchColumns}
  onEdit={(branch) => {
    setSelectedBranch(branch); // Pass selected branch to the update form
    setUpdateOpen(true); // Open the update modal
  }}
  onDeleteSuccess={(id) => {
    setBranches((prevBranches) => prevBranches.filter((branch) => branch._id !== id));
  }}
/>

      </Box>
    </>
  );
};

export default BranchManage;

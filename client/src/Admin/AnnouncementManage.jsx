import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Adminnavbar from "../components/AdminNavbar";
import AnnouncementTable from '../components/AnnounceComponents/AnnouncementTable'
import TotalCard from "../components/TotalCard";
import AnnouncementForm from "../components/AnnounceComponents/AnnouncementForm";
import UpdateAnnouncementForm from "../components/AnnounceComponents/UpdateAnnouncementForm";

import axios from "axios";

const AnnouncementManage = () => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);

  const announcementColumns = [
    { field: "title", title: "Title" },
    { field: "content", title: "Content" },
    { field: "date", title: "Date", render: (rowData) => new Date(rowData.date).toLocaleDateString() },
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/announcements", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching announcements");
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (announcementData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/announcements", announcementData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("New Announcement Created successfully!");
      setAnnouncements([...announcements, response.data]);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error adding announcement");
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/announcements/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Announcement Updated successfully!");

      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement._id === response.data._id ? response.data : announcement
        )
      );

      handleUpdateClose();
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const storedAdminName = localStorage.getItem("adminName") || "Kasun";
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
            <TotalCard title="Total Announcements" value={announcements.length} color="#34A853" />
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          sx={{ fontWeight: 800, marginBottom: 0, marginTop: 8, fontSize: 28 }}
        >
          Announcement Manage
        </Typography>
        <div
          style={{
            textAlign: "right",
            marginBottom: "20px",
            marginRight: "30px",
          }}
        >
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleOpen}>
            Add Announcement
          </Button>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <AnnouncementForm onClose={handleClose} onSubmit={handleAddAnnouncement} />
          </Dialog>

          <Dialog open={updateOpen} onClose={handleUpdateClose} fullWidth maxWidth="sm">
            {selectedAnnouncement && (
              <UpdateAnnouncementForm
                initialData={selectedAnnouncement}
                onSubmit={handleUpdateSubmit}
                onClose={handleUpdateClose}
              />
            )}
          </Dialog>
        </div>

        {error && <Typography color="error">{error}</Typography>}

        <AnnouncementTable
          data={announcements}
          columns={announcementColumns}
          onEdit={(announcement) => {
            setSelectedAnnouncement(announcement);
            setUpdateOpen(true);
          }}
          onDeleteSuccess={(id) => {
            setAnnouncements((prevAnnouncements) =>
              prevAnnouncements.filter((announcement) => announcement._id !== id)
            );
          }}
        />
      </Box>
    </>
  );
};

export default AnnouncementManage;

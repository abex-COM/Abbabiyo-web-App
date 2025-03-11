import { Box, IconButton, Modal, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Fetch admins from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, []);

  // Handle edit admin
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  // Handle delete admin
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((admin) => admin._id !== id));
      toast.success("Admin deleted successfully!");
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin.");
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "fullName", headerName: "Full Name", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Title */}
      <Header title="MANAGE ADMINS" subtitle="Managing the Admins" />

      {/* DataGrid for Admins */}
      <Box height="75vh">
        <DataGrid rows={admins} columns={columns} getRowId={(row) => row._id} />
      </Box>

      {/* Edit Admin Modal */}
      {selectedAdmin && (
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle save logic here
              setEditModalOpen(false);
            }}>
              <TextField
                fullWidth
                label="Full Name"
                value={selectedAdmin.fullName}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Username"
                value={selectedAdmin.username}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={selectedAdmin.email}
                margin="normal"
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setEditModalOpen(false)} sx={{ mr: 2 }} variant="contained">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ManageAdmins;
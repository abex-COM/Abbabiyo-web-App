import { Box, Typography, TextField, Button, useTheme, IconButton, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Edit Admin Modal Component
const EditAdminModal = ({ open, onClose, admin, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: admin?.fullName || "",
    username: admin?.username || "",
    email: admin?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 2 }} variant="contained">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Main ManageAdmins Component
const ManageAdmins = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
        console.log("Fetched Admins:", response.data); // Log the fetched data
        setAdmins(response.data);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Failed to fetch admins.");
      }
    };

    fetchAdmins();
  }, []);

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

  // Handle edit admin
  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  // Handle save edited admin
  const handleSave = async (updatedAdmin) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/admin/admins/${selectedAdmin._id}`,
        updatedAdmin,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the admins list with the updated admin
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === selectedAdmin._id ? response.data.admin : admin
        )
      );

      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin.");
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
      <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" sx={{ mb: "20px" }}>
        Manage Admins
      </Typography>

      {/* DataGrid for Admins */}
      <Box height="75vh">
        <DataGrid
          rows={admins}
          columns={columns}
          getRowId={(row) => row._id} // Use _id as the unique identifier
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </Box>

      {/* Edit Admin Modal */}
      {selectedAdmin && (
        <EditAdminModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default ManageAdmins;
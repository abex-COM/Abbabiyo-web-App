import { Box, useTheme, IconButton, Modal, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
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
  const colors = tokens(theme.palette.mode); // Using 'colors' for styling
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
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      cellClassName: "name-column--cell", // Apply custom class for styling
    },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            sx={{ color: colors.greenAccent[500] }} // Use colors for styling
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            sx={{ color: colors.redAccent[500] }} // Use colors for styling
          >
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
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300], // Use colors for styling
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700], // Use colors for styling
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400], // Use colors for styling
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700], // Use colors for styling
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`, // Use colors for styling
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={admins}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10]}
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
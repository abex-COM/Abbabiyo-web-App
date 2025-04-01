import { Box, useTheme, IconButton, Modal, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

// Edit Farmer Modal Component
const EditFarmerModal = ({ open, onClose, farmer, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    farmName: "",
    location: "",
    crops: [],
    ...farmer, // Spread the farmer object to override defaults
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
          <TextField
            fullWidth
            label="Farm Name"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Crops"
            name="crops"
            value={formData.crops?.join(", ")} // Convert array to comma-separated string
            onChange={(e) =>
              setFormData({ ...formData, crops: e.target.value.split(", ") }) // Convert string back to array
            }
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={onClose}
              sx={{ mr: 2 }}
              variant="contained"
              color="primary" // Same color as Save button
            >
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

// Main Component
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [farmers, setFarmers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Fetch farmer data from the backend
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/farmers/farmers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Normalize the data: Ensure every farmer has a `crops` field
        const normalizedFarmers = response.data.map((farmer) => ({
          ...farmer,
          crops: farmer.crops || [], // Default to an empty array if `crops` is missing
        }));

        console.log("Normalized farmers data:", normalizedFarmers); // Log the normalized data
        setFarmers(normalizedFarmers); // Update state with normalized farmer data
      } catch (error) {
        console.error("Error fetching farmers:", error);
        if (error.response) {
          console.error("Error details:", error.response.data); // Log the full error response
        }
      }
    };

    fetchFarmers();
  }, []);

  // Handle delete farmer
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/farmers/farmers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(farmers.filter((farmer) => farmer._id !== id)); // Remove the deleted farmer from the list
      toast.success("Farmer deleted successfully!");
    } catch (error) {
      console.error("Error deleting farmer:", error);
      if (error.response) {
        console.error("Error details:", error.response.data); // Log the full error response
      }
      toast.error("Failed to delete farmer. Please try again.");
    }
  };

  // Handle edit farmer
  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  // Handle save edited farmer
  const handleSave = async (updatedFarmer) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/farmers/farmers/${updatedFarmer._id}`,
        updatedFarmer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the farmers list with the updated farmer
      setFarmers((prevFarmers) =>
        prevFarmers.map((farmer) =>
          farmer._id === updatedFarmer._id ? response.data.farmer : farmer
        )
      );

      toast.success("Farmer updated successfully!");
    } catch (error) {
      console.error("Error updating farmer:", error);
      if (error.response) {
        console.error("Error details:", error.response.data); // Log the full error response
      }
      toast.error("Failed to update farmer. Please try again.");
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 }, // Use _id as the unique identifier
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "farmName",
      headerName: "Farm Name",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "crops",
      headerName: "Crops",
      flex: 1,
      valueGetter: (params) => {
        const crops = params.row?.crops || []; // Ensure `crops` is always an array
        return crops.join(", ") || "No crops"; // Join crops or display "No crops"
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          {/* Edit Button */}
          <IconButton
            onClick={() => handleEdit(params.row)}
            sx={{ color: colors.greenAccent[500] }}
          >
            <EditIcon />
          </IconButton>

          {/* Delete Button */}
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            sx={{ color: colors.redAccent[500] }}
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
      <Header title="FARMERS" subtitle="Managing the Farmers" />
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
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={farmers}
          columns={columns}
          getRowId={(row) => row._id} // Use _id as the unique identifier
        />
      </Box>

      {/* Render EditFarmerModal only if selectedFarmer is not null */}
      {selectedFarmer && (
        <EditFarmerModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedFarmer(null); // Reset selectedFarmer
          }}
          farmer={selectedFarmer}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default Team;
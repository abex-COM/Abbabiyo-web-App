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
import { useLanguage } from "../../LanguageContext";

// Translation dictionary
const teamTranslations = {
  en: {
    title: "FARMERS",
    subtitle: "Managing the Farmers",
    id: "ID",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    farmName: "Farm Name",
    location: "Location",
    crops: "Crops",
    actions: "Actions",
    noCrops: "No crops",
    edit: "Edit",
    delete: "Delete",
    deleteSuccess: "Farmer deleted successfully!",
    deleteError: "Failed to delete farmer. Please try again.",
    updateSuccess: "Farmer updated successfully!",
    updateError: "Failed to update farmer. Please try again.",
    cancel: "Cancel",
    save: "Save",
    fullNameLabel: "Full Name",
    usernameLabel: "Username",
    emailLabel: "Email",
    farmNameLabel: "Farm Name",
    locationLabel: "Location",
    cropsLabel: "Crops (comma separated)"
  },
  am: {
    title: "ገበሬዎች",
    subtitle: "ገበሬዎችን ማስተዳደር",
    id: "መለያ",
    fullName: "ሙሉ ስም",
    username: "የተጠቃሚ ስም",
    email: "ኢሜይል",
    farmName: "የግብርና ስም",
    location: "ቦታ",
    crops: "የተለማመዱ እምቦታዎች",
    actions: "ድርጊቶች",
    noCrops: "እምቦታዎች የሉም",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    deleteSuccess: "ገበሬ በተሳካ ሁኔታ ተሰርዟል!",
    deleteError: "ገበሬን ማስወገድ አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    updateSuccess: "ገበሬ በተሳካ ሁኔታ ተዘምኗል!",
    updateError: "ገበሬን ማዘመን አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    cancel: "ሰርዝ",
    save: "አስቀምጥ",
    fullNameLabel: "ሙሉ ስም",
    usernameLabel: "የተጠቃሚ ስም",
    emailLabel: "ኢሜይል",
    farmNameLabel: "የግብርና ስም",
    locationLabel: "ቦታ",
    cropsLabel: "የተለማመዱ እምቦታዎች (በነጠላ ሰረዝ የተለዩ)"
  },
  om: {
    title: "QEERANSOOTA",
    subtitle: "Qeeransoota bulchuu",
    id: "ID",
    fullName: "Maqaa Guutuu",
    username: "Maqaa Fayyadamaa",
    email: "Imeelii",
    farmName: "Maqaa Qonnaa",
    location: "Bakka",
    crops: "Mala Qonnaa",
    actions: "Hojiiwwan",
    noCrops: "Mala Qonnaa hin jiru",
    edit: "Sirreessuu",
    delete: "Haquu",
    deleteSuccess: "Qeeransichii muuxannoo ta'een haqame!",
    deleteError: "Qeeransichii haquu hindandeenye. Irra deebi'ii yaali.",
    updateSuccess: "Qeeransichii muuxannoo ta'een sirreeffame!",
    updateError: "Qeeransichii sirreessuu hindandeenye. Irra deebi'ii yaali.",
    cancel: "Haquu",
    save: "Qabachuu",
    fullNameLabel: "Maqaa Guutuu",
    usernameLabel: "Maqaa Fayyadamaa",
    emailLabel: "Imeelii",
    farmNameLabel: "Maqaa Qonnaa",
    locationLabel: "Bakka",
    cropsLabel: "Mala Qonnaa (walitti qoodaman)"
  },
  ti: {
    title: "ገበራውያን",
    subtitle: "ገበራውያን ምሕደራ",
    id: "መታወቂያ",
    fullName: "ምሉእ ስም",
    username: "ስም ተጠቃሚ",
    email: "ኢመይል",
    farmName: "ስም ሕርሻ",
    location: "ቦታ",
    crops: "ዝራውቲ",
    actions: "ተግባራት",
    noCrops: "ዝራውቲ የለን",
    edit: "ምሕዳስ",
    delete: "ምስራይ",
    deleteSuccess: "ገበራዊ ብትኽክል ተሰሪዙ!",
    deleteError: "ገበራዊ ምስራይ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    updateSuccess: "ገበራዊ ብትኽክል ተሓዲሱ!",
    updateError: "ገበራዊ ምሕዳስ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    cancel: "ምስራይ",
    save: "ምዝገባ",
    fullNameLabel: "ምሉእ ስም",
    usernameLabel: "ስም ተጠቃሚ",
    emailLabel: "ኢመይል",
    farmNameLabel: "ስም ሕርሻ",
    locationLabel: "ቦታ",
    cropsLabel: "ዝራውቲ (ብነጠላ ሰረዝ ዝተፈላለዩ)"
  }
};

// Edit Farmer Modal Component
const EditFarmerModal = ({ open, onClose, farmer, onSave, language }) => {
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
            label={teamTranslations[language].fullNameLabel}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={teamTranslations[language].usernameLabel}
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={teamTranslations[language].emailLabel}
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={teamTranslations[language].farmNameLabel}
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={teamTranslations[language].locationLabel}
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={teamTranslations[language].cropsLabel}
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
              color="primary"
            >
              {teamTranslations[language].cancel}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {teamTranslations[language].save}
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
  const { language } = useLanguage();

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

        console.log("Normalized farmers data:", normalizedFarmers);
        setFarmers(normalizedFarmers);
      } catch (error) {
        console.error("Error fetching farmers:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
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
      setFarmers(farmers.filter((farmer) => farmer._id !== id));
      toast.success(teamTranslations[language].deleteSuccess);
    } catch (error) {
      console.error("Error deleting farmer:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      toast.error(teamTranslations[language].deleteError);
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

      toast.success(teamTranslations[language].updateSuccess);
    } catch (error) {
      console.error("Error updating farmer:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      toast.error(teamTranslations[language].updateError);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "_id", headerName: teamTranslations[language].id, flex: 1 },
    {
      field: "fullName",
      headerName: teamTranslations[language].fullName,
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "username",
      headerName: teamTranslations[language].username,
      flex: 1,
    },
    {
      field: "email",
      headerName: teamTranslations[language].email,
      flex: 1,
    },
    {
      field: "farmName",
      headerName: teamTranslations[language].farmName,
      flex: 1,
    },
    {
      field: "location",
      headerName: teamTranslations[language].location,
      flex: 1,
    },
    {
      field: "crops",
      headerName: teamTranslations[language].crops,
      flex: 1,
      valueGetter: (params) => {
        const crops = params.row?.crops || [];
        return crops.join(", ") || teamTranslations[language].noCrops;
      },
    },
    {
      field: "actions",
      headerName: teamTranslations[language].actions,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            sx={{ color: colors.greenAccent[500] }}
            title={teamTranslations[language].edit}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={() => handleDelete(params.row._id)}
            sx={{ color: colors.redAccent[500] }}
            title={teamTranslations[language].delete}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
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
      <Header 
        title={teamTranslations[language].title} 
        subtitle={teamTranslations[language].subtitle} 
      />
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
          getRowId={(row) => row._id}
        />
      </Box>

      {selectedFarmer && (
        <EditFarmerModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedFarmer(null);
          }}
          farmer={selectedFarmer}
          onSave={handleSave}
          language={language}
        />
      )}
    </Box>
  );
};

export default Team;
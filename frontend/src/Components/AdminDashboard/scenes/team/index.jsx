import {
  Box,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../LanguageContext";
import { MenuItem } from "@mui/material"; // Make sure this import exists
import ethiopianRegions, {
  ethiopianWoredas,
  ethiopianZones,
} from "../../../../constants/ethiopianData";
import baseUrl from "../../../../baseUrl/baseUrl";

// Translation dictionary
export const teamTranslations = {
  en: {
    title: "FARMERS",
    subtitle: "Managing the Farmers",
    id: "ID",
    name: "Full Name",
    email: "Email",
    phoneNumber: "Phone Number",
    farmName: "Farm Name",
    region: "Region",
    zone: "Zone",
    woreda: "Woreda",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    deleteSuccess: "Farmer deleted successfully!",
    deleteError: "Failed to delete farmer. Please try again.",
    updateSuccess: "Farmer updated successfully!",
    updateError: "Failed to update farmer. Please try again.",
    cancel: "Cancel",
    save: "Save",
    nameLabel: "Full Name",
    phoneNumberLabel: "Phone Number",
    emailLabel: "Email",
    farmNameLabel: "Farm Name",
    regionLabel: "Region",
    zoneLabel: "Zone",
    woredaLabel: "Woreda",
  },
  am: {
    title: "ገበሬዎች",
    subtitle: "ገበሬዎችን ማስተዳደር",
    id: "መለያ",
    name: "ሙሉ ስም",
    email: "ኢሜይል",
    phoneNumber: "ስልክ ቁጥር",
    farmName: "የግብርና ስም",
    region: "ክልል",
    zone: "ዞን",
    woreda: "ወረዳ",
    actions: "ድርጊቶች",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    deleteSuccess: "ገበሬ በተሳካ ሁኔታ ተሰርዟል!",
    deleteError: "ገበሬን ማስወገድ አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    updateSuccess: "ገበሬ በተሳካ ሁኔታ ተዘምኗል!",
    updateError: "ገበሬን ማዘመን አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    cancel: "ሰርዝ",
    save: "አስቀምጥ",
    nameLabel: "ሙሉ ስም",
    phoneNumberLabel: "ስልክ ቁጥር",
    emailLabel: "ኢሜይል",
    farmNameLabel: "የግብርና ስም",
    regionLabel: "ክልል",
    zoneLabel: "ዞን",
    woredaLabel: "ወረዳ",
  },
  om: {
    title: "QONNAAWAN",
    subtitle: "Qonnaawwan To'achuuf",
    id: "ID",
    name: "Maqaa Guutuu",
    email: "Imeelii",
    phoneNumber: "Lakkoofsa Bilbilaa",
    farmName: "Maqaa Qonnaa",
    region: "Naannoo",
    zone: "Godina",
    woreda: "Aanaa",
    actions: "Hojiiwwan",
    edit: "Sirreessi",
    delete: "Haqi",
    deleteSuccess: "Qonnaan bultichi milkaa’inaan haquame!",
    deleteError: "Qonnaan bulticha haquu hin dandeenye. Irra deebi'i yaali.",
    updateSuccess: "Qonnaan bultichi milkaa’inaan haaromsame!",
    updateError:
      "Qonnaan bulticha haaromsuu hin dandeenye. Irra deebi’i yaali.",
    cancel: "Haquu",
    save: "Olkaa’i",
    nameLabel: "Maqaa Guutuu",
    phoneNumberLabel: "Lakkoofsa Bilbilaa",
    emailLabel: "Imeelii",
    farmNameLabel: "Maqaa Qonnaa",
    regionLabel: "Naannoo",
    zoneLabel: "Godina",
    woredaLabel: "Aanaa",
  },
  ti: {
    title: "ገበራውያን",
    subtitle: "ገበራውያን ምሕደራ",
    id: "መታወቂያ",
    name: "ምሉእ ስም",
    email: "ኢመይል",
    phoneNumber: "ቁፅሪ ስልኪ",
    farmName: "ስም ሕርሻ",
    region: "ክልል",
    zone: "ዞባ",
    woreda: "ወረዳ",
    actions: "ተግባራት",
    edit: "ምሕዳስ",
    delete: "ምስራይ",
    deleteSuccess: "ገበራዊ ብትኽክል ተሰሪዙ!",
    deleteError: "ገበራዊ ምስራይ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    updateSuccess: "ገበራዊ ብትኽክል ተሓዲሱ!",
    updateError: "ገበራዊ ምሕዳስ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    cancel: "ምስራይ",
    save: "ምዝገባ",
    nameLabel: "ምሉእ ስም",
    phoneNumberLabel: "ቁፅሪ ስልኪ",
    emailLabel: "ኢመይል",
    farmNameLabel: "ስም ሕርሻ",
    regionLabel: "ክልል",
    zoneLabel: "ዞባ",
    woredaLabel: "ወረዳ",
  },
};

const EditFarmerModal = ({ open, onClose, farmer, onSave, language }) => {
  const [availableWoredas, setAvailableWoredas] = useState([]);

  const [formData, setFormData] = useState({
    name: farmer?.name || "",
    phoneNumber: farmer?.phoneNumber || "",
    region: farmer?.location?.region || "",
    zone: farmer?.location?.zone || "",
    woreda: farmer?.location?.woreda || "",
    _id: farmer?._id,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "region") {
      // Reset both zone and woreda when region changes
      updatedFormData.zone = "";
      updatedFormData.woreda = "";
      setAvailableWoredas([]);
    } else if (name === "zone") {
      // Reset woreda and update available woredas when zone changes
      updatedFormData.woreda = "";
      const zoneWoredas = ethiopianWoredas[value] || [];
      setAvailableWoredas(zoneWoredas);
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      location: {
        region: formData.region,
        zone: formData.zone,
        woreda: formData.woreda,
      },
    };
    delete updatedData.region;
    delete updatedData.zone;
    delete updatedData.woreda;

    onSave(updatedData);
    onClose();
  };
  useEffect(() => {
    if (farmer?.location?.zone) {
      const zoneWoredas = ethiopianWoredas[farmer.location.zone] || [];
      setAvailableWoredas(zoneWoredas);
    }
  }, [farmer]);

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
            label={teamTranslations[language].nameLabel}
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label={teamTranslations[language].phoneNumberLabel}
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{teamTranslations[language].regionLabel}</InputLabel>
            <Select
              name="region"
              value={formData.region}
              onChange={handleChange}
              label={teamTranslations[language].regionLabel}
            >
              {ethiopianRegions.map((zone) => (
                <MenuItem key={zone.value} value={zone.value}>
                  {zone.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>{teamTranslations[language].zoneLabel}</InputLabel>
            <Select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              label={teamTranslations[language].zoneLabel}
            >
              {ethiopianZones["Oromia"].map((zone) => (
                <MenuItem key={zone.value} value={zone.value}>
                  {zone.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>{teamTranslations[language].woredaLabel}</InputLabel>
            <Select
              name="woreda"
              value={formData.woreda}
              onChange={handleChange}
              label={teamTranslations[language].woredaLabel}
            >
              {availableWoredas.map((woreda) => (
                <MenuItem key={woreda.value} value={woreda.value}>
                  {woreda.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

const Farmers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [farmers, setFarmers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchFarmers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/users/get-all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data || [];

        // Preprocess and flatten the data
        const processedFarmers = data
          .filter((farmer) => farmer && farmer._id) // Filter out null/undefined farmers and those without _id
          .map((farmer) => ({
            ...farmer,
            region: farmer?.location?.region || "",
            zone: farmer?.location?.zone || "",
            woreda: farmer?.location?.woreda || "",
          }));

        setFarmers(processedFarmers);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };
    fetchFarmers();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(farmers.filter((farmer) => farmer?._id !== id));
      toast.success(teamTranslations[language].deleteSuccess);
    } catch (error) {
      console.error("Error deleting farmer:", error);
      toast.error(teamTranslations[language].deleteError);
    }
  };

  const handleEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setEditModalOpen(true);
  };

  const handleSave = async (updatedFarmer) => {
    if (!updatedFarmer) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${baseUrl}/api/users/update-user/${updatedFarmer?._id}`,
        updatedFarmer,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFarmers((prevFarmers) =>
        prevFarmers.map((farmer) =>
          farmer?._id === updatedFarmer?._id ? response.data?.farmer : farmer
        )
      );
      toast.success(teamTranslations[language].updateSuccess);
    } catch (error) {
      console.error("Error updating farmer:", error);
      toast.error(teamTranslations[language].updateError);
    }
  };

  const columns = [
    { field: "_id", headerName: teamTranslations[language].id, flex: 1 },
    {
      field: "name",
      headerName: teamTranslations[language].name,
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "phoneNumber",
      headerName: teamTranslations[language].phoneNumber,
      flex: 1,
    },
    {
      field: "region",
      headerName: "Region",
      flex: 1,
    },
    {
      field: "zone",
      headerName: teamTranslations[language].zone,
      flex: 1,
    },
    {
      field: "woreda",
      headerName: teamTranslations[language].woreda,
      flex: 1,
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
            onClick={() => handleDelete(params.row?._id)} // Improved check
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
      <ToastContainer />
      <Header
        title={teamTranslations[language].title}
        subtitle={teamTranslations[language].subtitle}
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
          getRowId={(row) => row?._id}
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

export default Farmers;

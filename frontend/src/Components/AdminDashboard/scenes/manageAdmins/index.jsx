import {
  Box,
  useTheme,
  IconButton,
  Modal,
  TextField,
  Button,
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

// Translation dictionary
const adminTranslations = {
  en: {
    title: "ADMINS",
    subtitle: "Managing the Admins",
    id: "ID",
    fullName: "Full Name",
    username: "Username",
    email: "Email",
    role: "Role",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    deleteSuccess: "Admin deleted successfully!",
    deleteError: "Failed to delete admin. Please try again.",
    updateSuccess: "Admin updated successfully!",
    updateError: "Failed to update admin. Please try again.",
    cancel: "Cancel",
    save: "Save",
    fullNameLabel: "Full Name",
    usernameLabel: "Username",
    emailLabel: "Email",
    unauthorized: "You are not authorized. Please log in.",
    fetchError: "Failed to fetch admins. Please check your permissions.",
    networkError: "Network error. Please try again.",
  },
  am: {
    title: "አስተዳዳሪዎች",
    subtitle: "አስተዳዳሪዎችን ማስተዳደር",
    id: "መለያ",
    fullName: "ሙሉ ስም",
    username: "የተጠቃሚ ስም",
    email: "ኢሜይል",
    role: "የስራ መደብ",
    actions: "ድርጊቶች",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    deleteSuccess: "አስተዳዳሪ በተሳካ ሁኔታ ተሰርዟል!",
    deleteError: "አስተዳዳሪን ማስወገድ አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    updateSuccess: "አስተዳዳሪ በተሳካ ሁኔታ ተዘምኗል!",
    updateError: "አስተዳዳሪን ማዘመን አልተቻለም። እባክዎ ደግመው ይሞክሩ።",
    cancel: "ሰርዝ",
    save: "አስቀምጥ",
    fullNameLabel: "ሙሉ �ም",
    usernameLabel: "የተጠቃሚ ስም",
    emailLabel: "ኢሜይል",
    unauthorized: "የማስፈቀድ መብት የለዎትም። እባክዎ ይግቡ።",
    fetchError: "አስተዳዳሪዎችን ማግኘት አልተቻለም። ፈቃዶችዎን ያረጋግጡ።",
    networkError: "የኔትወርክ ስህተት። እባክዎ እንደገና ይሞክሩ።",
  },
  om: {
    title: "ADMINISTRAATORAA",
    subtitle: "Administraatoraa bulchuu",
    id: "ID",
    fullName: "Maqaa Guutuu",
    username: "Maqaa Fayyadamaa",
    email: "Imeelii",
    role: "Dhuunfaa",
    actions: "Hojiiwwan",
    edit: "Sirreessuu",
    delete: "Haquu",
    deleteSuccess: "Administraatoriin muuxannoo ta'een haqame!",
    deleteError: "Administraatorii haquu hindandeenye. Irra deebi'ii yaali.",
    updateSuccess: "Administraatorii muuxannoo ta'een sirreeffame!",
    updateError:
      "Administraatorii sirreessuu hindandeenye. Irra deebi'ii yaali.",
    cancel: "Haquu",
    save: "Qabachuu",
    fullNameLabel: "Maqaa Guutuu",
    usernameLabel: "Maqaa Fayyadamaa",
    emailLabel: "Imeelii",
    unauthorized: "Hayyoomina hin qabdu. Maaloo seenaa.",
    fetchError:
      "Administraatorota argachuu hindandeenye. Hayyoomina keessan mirkaneessaa.",
    networkError: "Dhiibbaa netwoorkii. Irra deebi'ii yaali.",
  },
  ti: {
    title: "ኣስተዳደርቲ",
    subtitle: "ኣስተዳደርቲ ምሕደራ",
    id: "መታወቂያ",
    fullName: "ምሉእ ስም",
    username: "ስም ተጠቃሚ",
    email: "ኢመይል",
    role: "ሓላፍነት",
    actions: "ተግባራት",
    edit: "ምሕዳስ",
    delete: "ምስራይ",
    deleteSuccess: "ኣስተዳደርቲ ብትኽክል ተሰሪዙ!",
    deleteError: "ኣስተዳደርቲ ምስራይ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    updateSuccess: "ኣስተዳደርቲ ብትኽክል ተሓዲሱ!",
    updateError: "ኣስተዳደርቲ ምሕዳስ ኣይተኻእለን። በጃኹም ደጊምኩም ፈትኑ።",
    cancel: "ምስራይ",
    save: "ምዝገባ",
    fullNameLabel: "ምሉእ ስም",
    usernameLabel: "ስም ተጠቃሚ",
    emailLabel: "ኢመይል",
    unauthorized: "ስልጣን የብርኩን። በጃኹም ብጽኑ።",
    fetchError: "ኣስተዳደርቲ ምርካብ ኣይተኻእለን። ፍቓድኩም ኣረጋግጹ።",
    networkError: "ሽቅብላል ጸገም። በጃኹም ደጊምኩም ፈትኑ።",
  },
};

// Edit Admin Modal Component
const EditAdminModal = ({ open, onClose, admin, onSave, language }) => {
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
            label={adminTranslations[language].fullNameLabel}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={adminTranslations[language].usernameLabel}
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label={adminTranslations[language].emailLabel}
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={onClose}
              sx={{ mr: 2 }}
              variant="contained"
              color="primary"
            >
              {adminTranslations[language].cancel}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {adminTranslations[language].save}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

// Main Component
const ManageAdmins = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [admins, setAdmins] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { language } = useLanguage();

  // Fetch admin data from the backend
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(adminTranslations[language].unauthorized);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/get-all-admin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Normalize the data: Ensure every admin has a `role` field
        const normalizedAdmins = response.data.map((admin) => ({
          ...admin,
          role: admin.role || "admin", // Default to "admin" if `role` is missing
        }));

        console.log("Normalized admins data:", normalizedAdmins);
        setAdmins(normalizedAdmins);
      } catch (error) {
        console.error("Error fetching admins:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
          toast.error(adminTranslations[language].fetchError);
        } else {
          toast.error(adminTranslations[language].networkError);
        }
      }
    };

    fetchAdmins();
  }, [language]);

  // Handle delete admin
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((admin) => admin._id !== id));
      toast.success(adminTranslations[language].deleteSuccess);
    } catch (error) {
      console.error("Error deleting admin:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      toast.error(adminTranslations[language].deleteError);
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
        `http://localhost:5000/api/admin/update/${selectedAdmin._id}`,
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

      toast.success(adminTranslations[language].updateSuccess);
    } catch (error) {
      console.error("Error updating admin:", error);
      if (error.response) {
        console.error("Error details:", error.response.data);
      }
      toast.error(adminTranslations[language].updateError);
    }
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "_id", headerName: adminTranslations[language].id, flex: 1 },
    {
      field: "fullName",
      headerName: adminTranslations[language].fullName,
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "username",
      headerName: adminTranslations[language].username,
      flex: 1,
    },
    {
      field: "email",
      headerName: adminTranslations[language].email,
      flex: 1,
    },
    {
      field: "role",
      headerName: adminTranslations[language].role,
      flex: 1,
    },
    {
      field: "actions",
      headerName: adminTranslations[language].actions,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            sx={{ color: colors.greenAccent[500] }}
            title={adminTranslations[language].edit}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={() => handleDelete(params.row._id)}
            sx={{ color: colors.redAccent[500] }}
            title={adminTranslations[language].delete}
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
        title={adminTranslations[language].title}
        subtitle={adminTranslations[language].subtitle}
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
          rows={admins}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>

      {selectedAdmin && (
        <EditAdminModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
          onSave={handleSave}
          language={language}
        />
      )}
    </Box>
  );
};

export default ManageAdmins;

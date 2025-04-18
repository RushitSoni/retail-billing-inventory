import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, updateUserName } from "../../../Redux/Slices/userSlice";
import { TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import "./Profile.css";
import {addAuditLog} from "../../../Redux/Slices/auditLogSlice"
import Toast from "../Toast/Toast"
import { Pencil } from "lucide-react";

export default function Profile() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.users.currentUser);
  const { userId } = useParams();

  const [name, setName] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = (msg, type) => {
    setToast({ open: true, message: msg, type });
  };




  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    try{
      if (name && selectedUser?._id) {
        await  dispatch(updateUserName({ userId: selectedUser._id, name })).unwrap();

        await  dispatch(
          addAuditLog({
            user: selectedUser.name,
            operation: "UPDATE",
            module: "User",
            message: `User name updated.`,
          })
        );
      }
      showToast("User name updated successfully!", "success")
    }
    catch(err){
      showToast("Updation Failed!", "error")
      console.log("Error during updating userName : ",err)
    }
    
  };

  const textFieldStyle = {
    mb: 2,
    "& label": { color: "gray" }, // Default label color
    "& label.Mui-focused": { color: "gray" }, // Focused label color
    "& .MuiInputBase-input": { color: "gray" }, // Input text color
    "& .MuiFilledInput-root": { backgroundColor: "transparent" }, // Remove background
    "& .MuiFilledInput-underline:before": {
      borderBottomColor: "gray",
    }, // Default underline
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: "gray",
    }, // Focused underline
  };

  return (
    <div className={`profile-wrapper ${darkMode ? "dark" : "light"}`}>
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
          User Profile :
        </Typography>

        <div className="profile-row name-row">
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
            required
            margin="dense"
            name="name"
            type="text"
            variant="filled"
            className="input-field"
            sx={textFieldStyle}
          />
       
          <button
            className="details-btn"
            onClick={handleUpdate}
          >
            <Pencil size={20} />
          </button>
        </div>

        <div className="profile-row">
          <TextField
            label="Email"
            value={selectedUser?.email}
            disabled
            fullWidth
            margin="dense"
            variant="filled"
            className="input-field"
            sx={textFieldStyle}
          />
        </div>

        <div className="profile-row">
          <TextField
            label="Created At"
            value={new Date(selectedUser.createdAt).toLocaleString()}
            disabled
            fullWidth
            margin="dense"
            type="text"
            variant="filled"
            className="input-field"
            sx={textFieldStyle}
          />
        </div>

        <div className="profile-row">
          <TextField
            label="Updated At"
            value={new Date(selectedUser.updatedAt).toLocaleString()}
            disabled
            fullWidth
            margin="dense"
            type="text"
            variant="filled"
            className="input-field"
            sx={textFieldStyle}
          />
        </div>

        {selectedUser.role === "admin"? <div className="profile-row">
          <TextField
            label="Role"
            value="Admin"
            disabled
            fullWidth
            margin="dense"
            type="text"
            variant="filled"
            className="input-field"
            sx={textFieldStyle}
          />
        </div> : <></>}

        
      </motion.div>
      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />


    </div>
  );
}

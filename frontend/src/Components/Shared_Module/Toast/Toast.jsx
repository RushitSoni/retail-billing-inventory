import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={10} ref={ref} variant="filled" {...props} />;
});

const Toast = ({ open, message, type, onClose }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={3000} 
      onClose={onClose} 
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: "auto",minWidth:"20rem", height:"2.4rem",gap:"5px"}}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

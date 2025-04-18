import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user} = useSelector((state) => state.auth);

  
    if (!user) {
        return <Navigate to="/login" />;
    }
   

    console.log(allowedRoles, user)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return  <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;

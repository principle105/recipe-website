import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const RequireAuth = ({ children }) => {
    const { user, fetched } = useContext(LoginContext);

    if (!user && fetched) {
        toast.error("You are not logged in");
        return <Navigate to="/" />;
    }

    return children;
};

export default RequireAuth;

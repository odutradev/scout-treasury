import { Navigate } from "react-router-dom";

const InitialRoute = () => localStorage.getItem("token") != null ? <Navigate to="/home" replace/> : <Navigate to="/signin" />;

export default InitialRoute
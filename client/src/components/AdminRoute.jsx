import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../redux/slices/authSlice";

export default function AdminRoute() {
  const isAdmin = useSelector(selectIsAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

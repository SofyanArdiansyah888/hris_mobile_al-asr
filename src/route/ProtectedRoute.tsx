import { Redirect } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  
  if (!user) {
    // user is not authenticated
    // window.location.reload();
    return <Redirect push to="/login" />;
  }
  return children;
};

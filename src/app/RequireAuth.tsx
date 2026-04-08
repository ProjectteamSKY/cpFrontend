// src/routes/RequireAuth.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../app/context/AuthContext";

interface Props {
  allowedRoles?: string[];
}

const RequireAuth = ({ allowedRoles }: Props) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait until auth state is ready
  if (loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in → redirect to login
//   if (!isAuthenticated) {
//     return (
//       <Navigate
//         to="/login"
//         state={{ from: location }} // ✅ for redirect after login
//         replace
//       />
//     );
//   }

  // ❌ Role not allowed
  if (
    allowedRoles &&
    (!user?.roles ||
      !allowedRoles.some((role) => user.roles.includes(role)))
  ) {
    return <Navigate to="/" replace />;
  }

  // ✅ Access granted
  return <Outlet />;
};

export default RequireAuth;
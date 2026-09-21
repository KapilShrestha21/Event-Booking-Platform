import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  // 1. Show loading state while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  // 2. Redirect unauthenticated users to Sign In (saving current location for redirect after login)
  if (!isAuthenticated && !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // console.log('ProtectedRoute evaluation:', {
  //   storedRole: user?.role,
  //   allowedRoles,
  //   hasMatch: allowedRoles?.includes(user?.role)
  // });

  // 3. Optional: Check for specific user roles (e.g., 'organizer' vs 'customer')
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Render child routes if authorized
  return <Outlet />;
};

export default ProtectedRoute;
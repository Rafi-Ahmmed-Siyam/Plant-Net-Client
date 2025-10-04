import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const AdminRoute = ({ children }) => {
   const { user, loading } = useAuth();
   const { role, isLoading, isPending } = useRole();

   if (loading || isLoading || isPending) return <LoadingSpinner />;

   if (user && role === 'Admin') return children;
   return <Navigate to={'/'} replace />;
};

export default AdminRoute;

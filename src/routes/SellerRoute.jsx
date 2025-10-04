import React from 'react';
import useAuth from '../hooks/useAuth';
import useRole from '../hooks/useRole';
import LoadingSpinner from '../components/Shared/LoadingSpinner';
import { Navigate } from 'react-router-dom';

const SellerRoute = ({ children }) => {
   const { user, loading } = useAuth();
   const { role, isLoading, isPending } = useRole();

   if (loading || isLoading || isPending) return <LoadingSpinner />;

   if (user && role === 'Seller') return children;
   return <Navigate to={'/'} replace />;
};

export default SellerRoute;

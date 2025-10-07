import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useRole = () => {
   const axiosSecure = useAxiosSecure();
   const { user, loading } = useAuth();
   const {
      data: role = [],
      isPending,
      isLoading,
      refetch,
   } = useQuery({
      enabled: !loading && !!user?.email,
      queryKey: ['role', user?.email],
      queryFn: async () => {
         const { data } = await axiosSecure.get(`/users/role/${user.email}`);
         return data.role;
      },
   });
   // console.role(role);
   return { role, isLoading, isPending, refetch };
};

export default useRole;

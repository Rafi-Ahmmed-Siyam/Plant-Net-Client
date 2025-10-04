import axios from 'axios';
import useAuth from './useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const axiosSecure = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   withCredentials: true,
});

const useAxiosSecure = () => {
   const navigate = useNavigate();
   const { logOut } = useAuth();
   useEffect(() => {
      const resInterceptor = axiosSecure.interceptors.response.use(
         (res) => {
            return res;
         },
         async (error) => {
            console.log(
               'Error caught from axios interceptor-->',
               error.response.data.message
            );
            // toast.error(error.response.data.message);
            if (
               error.response.status === 401 ||
               error.response.status === 403
            ) {
               // logout
               logOut();
               // navigate to login
               navigate('/login');
            }
            return Promise.reject(error);
         }
      );
      return () => axiosSecure.interceptors.response.eject(resInterceptor);
   }, [logOut, navigate]);
   return axiosSecure;
};

export default useAxiosSecure;

import { useState } from 'react';
import UpdateUserModal from '../../Modal/UpdateUserModal';
import PropTypes from 'prop-types';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
const UserDataRow = ({ userData, refetch }) => {
   const [isOpen, setIsOpen] = useState(false);
   const { _id, timestamp, status, role, image, email } = userData || {};
   const axiosSecure = useAxiosSecure();
   const { user } = useAuth();

   const updateRole = async (selectedRole) => {
      if (role === selectedRole) {
         setIsOpen(false);
         return toast.error('Select a Different Role');
      }
      console.log(selectedRole);

      try {
         // Send req to Database
         const { data } = await axiosSecure.patch(`/user/role/${email}`, {
            role: selectedRole,
         });
         refetch();
         console.log(data);
         if (data.modifiedCount > 0) {
            toast.success('Role updated successful');
         }
      } catch (err) {
         console.log(err);
      } finally {
         setIsOpen(false);
      }
   };

   return (
      <tr>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{email}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{role}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p
               className={`${
                  status
                     ? status === 'Requested'
                        ? 'text-yellow-500'
                        : 'text-green-500'
                     : 'text-red-500 whitespace-no-wrap'
               } text-red-500 whitespace-no-wrap`}
            >
               {status || 'Unavailable'}
            </p>
         </td>

         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span
               onClick={() => setIsOpen(true)}
               className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
               <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
               ></span>
               <span className="relative">Update Role</span>
            </span>
            {/* Modal */}
            <UpdateUserModal
               role={role}
               isOpen={isOpen}
               setIsOpen={setIsOpen}
               updateRole={updateRole}
            />
         </td>
      </tr>
   );
};

UserDataRow.propTypes = {
   user: PropTypes.object,
   refetch: PropTypes.func,
};

export default UserDataRow;

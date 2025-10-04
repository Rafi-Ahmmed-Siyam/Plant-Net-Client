import PropTypes from 'prop-types';
import { useState } from 'react';
import DeleteModal from '../../Modal/DeleteModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
const CustomerOrderDataRow = ({ order, refetch }) => {
   let [isOpen, setIsOpen] = useState(false);
   const closeModal = () => setIsOpen(false);
   const axiosSecure = useAxiosSecure();
   const {
      plantImage,
      plantName,
      plantCategory,
      price,
      quantity,
      status,
      _id,
      plantId,
   } = order || {};
   // console.log(order);

   const handleDelete = async () => {
      // console.log(_id);

      try {
         // Sent del req in DB
         const { data } = await axiosSecure.delete(`/orders/${_id}`);
         console.log(data);

         // Update plant Quantity
         const { data: updateQuantityResult } = await axiosSecure.patch(
            '/plants/quantity',
            {
               id: plantId,
               quantity: quantity,
               status: 'increase',
            }
         );
         console.log(updateQuantityResult);

         refetch();
      } catch (err) {
         console.log(err);
         toast.error(err.response.data);
      } finally {
         closeModal();
      }
   };

   return (
      <tr>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <div className="flex items-center">
               <div className="flex-shrink-0">
                  <div className="block relative">
                     <img
                        alt="profile"
                        src={plantImage}
                        className="mx-auto object-cover rounded h-10 w-15 "
                     />
                  </div>
               </div>
            </div>
         </td>

         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{plantName}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{plantCategory}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">${price}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {/* <p className="text-gray-900 whitespace-no-wrap">{status}</p> */}
            <div className="badge badge-primary">{status}</div>
         </td>

         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <button
               onClick={() => setIsOpen(true)}
               className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-lime-900 leading-tight"
            >
               <span className="absolute cursor-pointer inset-0 bg-red-500 opacity-50 rounded-full"></span>
               <span className="relative cursor-pointer">Cancel</span>
            </button>

            <DeleteModal
               handleDelete={handleDelete}
               isOpen={isOpen}
               closeModal={closeModal}
            />
         </td>
      </tr>
   );
};

CustomerOrderDataRow.propTypes = {
   order: PropTypes.object,
   refetch: PropTypes.func,
};

export default CustomerOrderDataRow;

import PropTypes from 'prop-types';
import { useState } from 'react';
import DeleteModal from '../../Modal/DeleteModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
const SellerOrderDataRow = ({ order, refetch }) => {
   let [isOpen, setIsOpen] = useState(false);
   const closeModal = () => setIsOpen(false);

   const { _id, customer, status, quantity, price, plantName, address } =
      order || {};
   const axiosSecure = useAxiosSecure();

   //  Handle Delete Order
   const handleDelete = async () => {
      // console.log(_id);
      try {
         // Sent del req in DB
         const { data } = await axiosSecure.delete(`/orders/seller/${_id}`);
         console.log(data);
         toast.success('Order Canceled Successful');
      } catch (err) {
         console.log(err);
      } finally {
         refetch();
         closeModal();
      }
   };

   //  Handle update order status or update status
   const handleUpdateOrderStatus = async (newStatus) => {
      console.log(newStatus);
      if (status === newStatus) return;
      try {
         // Send patch req
         const { data } = await axiosSecure.patch(`/orders/seller/${_id}`, {
            status: newStatus,
         });
         toast.success('Order Status Updated Successful');
      } catch (err) {
         console.log(err);
      } finally {
         refetch();
      }
   };

   return (
      <tr>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{plantName}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">
               {customer?.email}
            </p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">${price}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{address}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{status}</p>
         </td>

         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <div className="flex items-center gap-2">
               <select
                  disabled={status === 'Delivered'}
                  onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                  defaultValue={status}
                  required
                  className="p-1 border-2 border-lime-300 focus:outline-lime-500 rounded-md text-gray-900 whitespace-no-wrap bg-white"
                  name="category"
               >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">Start Processing</option>
                  <option value="Delivered">Deliver</option>
               </select>
               <button
                  onClick={() => setIsOpen(true)}
                  className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
               >
                  <span
                     aria-hidden="true"
                     className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                  ></span>
                  <span className="relative">Cancel</span>
               </button>
            </div>
            <DeleteModal
               handleDelete={handleDelete}
               isOpen={isOpen}
               closeModal={closeModal}
            />
         </td>
      </tr>
   );
};

SellerOrderDataRow.propTypes = {
   order: PropTypes.object,
   refetch: PropTypes.func,
};

export default SellerOrderDataRow;

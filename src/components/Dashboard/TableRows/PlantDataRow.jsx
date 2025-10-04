import { useState } from 'react';
import DeleteModal from '../../Modal/DeleteModal';
import UpdatePlantModal from '../../Modal/UpdatePlantModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const PlantDataRow = ({ sellerPlant, refetch }) => {
   // Delete modal
   let [isOpen, setIsOpen] = useState(false);
   //  Update Modal
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   function openModal() {
      setIsOpen(true);
   }
   function closeModal() {
      setIsOpen(false);
   }
   const axiosSecure = useAxiosSecure();
   const { _id, quantity, price, plantName, image, category } =
      sellerPlant || {};

   const handleDeletePlant = async () => {
      try {
         // Send del req
         const { data } = await axiosSecure.delete(`/plants/${_id}`);
         console.log(data);
         toast.success('Plant Deleted Successful');
         refetch();
      } catch (err) {
         console.log(err);
      } finally {
         closeModal();
         refetch();
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
                        src={
                           image ||
                           'https://i.ibb.co.com/rMHmQP2/money-plant-in-feng-shui-brings-luck.jpg'
                        }
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
            <p className="text-gray-900 whitespace-no-wrap">{category}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">${price}</p>
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap">{quantity}</p>
         </td>

         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span
               onClick={openModal}
               className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
               <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
               ></span>
               <span className="relative">Delete</span>
            </span>
            <DeleteModal
               handleDelete={handleDeletePlant}
               isOpen={isOpen}
               closeModal={closeModal}
            />
         </td>
         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span
               onClick={() => setIsEditModalOpen(true)}
               className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
               <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
               ></span>
               <span className="relative">Update</span>
            </span>
            <UpdatePlantModal
               isOpen={isEditModalOpen}
               setIsEditModalOpen={setIsEditModalOpen}
               sellerPlant={sellerPlant}
               refetch={refetch}
            />
         </td>
      </tr>
   );
};

export default PlantDataRow;

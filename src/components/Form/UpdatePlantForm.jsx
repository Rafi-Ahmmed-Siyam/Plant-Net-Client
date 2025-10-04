import { useState } from 'react';
import { imageBBUpload } from '../../API/utils';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';

const UpdatePlantForm = ({ sellerPlant, refetch, setIsEditModalOpen }) => {
   const axiosSecure = useAxiosSecure();
   const {
      _id,
      quantity,
      price,
      plantName,
      image,
      category,
      description,
      seller,
   } = sellerPlant || {};

   const [imageData, setImageData] = useState({});
   const [loading, setLoading] = useState(false);

   const handleUpdatePlant = async (e) => {
      e.preventDefault();
      setLoading(true);
      const form = e.target;
      const plantName = form.name.value;
      const category = form.category.value;
      const description = form.description.value;
      const price = parseFloat(form.price.value);
      const quantity = parseInt(form.quantity.value);
      const imageFile = form.image.files;

      let imageUrl = image;
      if (imageFile.length > 0) {
         const url = await imageBBUpload(imageFile);
         imageUrl = url;
      }

      const updatePlantData = {
         plantName,
         category,
         description,
         price,
         quantity,
         image: imageUrl,
         seller,
      };
      // console.log(updatePlantData);

      try {
         // Send put req in DB
         const { data } = await axiosSecure.put(
            `/plants/${_id}`,
            updatePlantData
         );
         console.log(data);
         refetch();

         toast.success('Plant Updated Successful');
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
         setIsEditModalOpen(false);
      }
   };
   return (
      <div className="w-full flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
         <form onSubmit={handleUpdatePlant}>
            <div className="grid grid-cols-1 gap-10">
               <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-1 text-sm">
                     <label htmlFor="name" className="block text-gray-600">
                        Name
                     </label>
                     <input
                        className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                        defaultValue={plantName}
                        name="name"
                        id="name"
                        type="text"
                        placeholder="Plant Name"
                        required
                     />
                  </div>
                  {/* Category */}
                  <div className="space-y-1 text-sm">
                     <label htmlFor="category" className="block text-gray-600 ">
                        Category
                     </label>
                     <select
                        required
                        defaultValue={category}
                        className="w-full px-4 py-3 border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                        name="category"
                     >
                        <option value="" disabled>
                           Select a Option
                        </option>
                        <option defaultValue="Indoor">Indoor</option>
                        <option defaultValue="Outdoor">Outdoor</option>
                        <option defaultValue="Succulent">Succulent</option>
                        <option defaultValue="Flowering">Flowering</option>
                     </select>
                  </div>
                  {/* Description */}
                  <div className="space-y-1 text-sm">
                     <label
                        htmlFor="description"
                        className="block text-gray-600"
                     >
                        Description
                     </label>

                     <textarea
                        id="description"
                        defaultValue={description}
                        placeholder="Write plant description here..."
                        className="block rounded-md focus:lime-300 w-full h-32 px-4 py-3 text-gray-800  border border-lime-300 bg-white focus:outline-lime-500 "
                        name="description"
                     ></textarea>
                  </div>
               </div>
               <div className="space-y-6 flex flex-col">
                  {/* Price & Quantity */}
                  <div className="flex justify-between gap-2">
                     {/* Price */}
                     <div className="space-y-1 text-sm">
                        <label htmlFor="price" className="block text-gray-600 ">
                           Price
                        </label>
                        <input
                           className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                           defaultValue={price}
                           name="price"
                           id="price"
                           type="number"
                           placeholder="Price per unit"
                           required
                        />
                     </div>

                     {/* Quantity */}
                     <div className="space-y-1 text-sm">
                        <label
                           htmlFor="quantity"
                           className="block text-gray-600"
                        >
                           Quantity
                        </label>
                        <input
                           className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                           defaultValue={quantity}
                           name="quantity"
                           id="quantity"
                           type="number"
                           placeholder="Available quantity"
                           required
                        />
                     </div>
                  </div>
                  {/* Image */}
                  <div className=" p-4  w-full  m-auto rounded-lg flex-grow">
                     <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                        <div className="flex flex-col w-max mx-auto text-center">
                           <label>
                              <input
                                 onChange={(e) =>
                                    setImageData(e.target.files[0])
                                 }
                                 className="text-sm cursor-pointer w-36 hidden"
                                 type="file"
                                 name="image"
                                 id="image"
                                 accept="image/*"
                                 hidden
                              />
                              <div className="bg-lime-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-lime-500">
                                 {imageData?.name
                                    ? imageData.name.slice(0, 30) + '...'
                                    : 'Upload Image'}
                              </div>
                           </label>
                        </div>
                     </div>
                  </div>

                  {/* Submit Button */}
                  <button
                     type="submit"
                     className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-lime-500 "
                  >
                     {loading ? (
                        <TbFidgetSpinner className="animate-spin m-auto" />
                     ) : (
                        'Update Plant'
                     )}
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default UpdatePlantForm;

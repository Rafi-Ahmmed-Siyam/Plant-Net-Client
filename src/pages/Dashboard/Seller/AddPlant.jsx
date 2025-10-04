import { Helmet } from 'react-helmet-async';
import AddPlantForm from '../../../components/Form/AddPlantForm';

import useAuth from '../../../hooks/useAuth';
import { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { imageBBUpload } from '../../../API/utils';
import { useNavigate } from 'react-router-dom';

const AddPlant = () => {
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();
   const [uploadImage, setUploadImage] = useState({
      name: 'Upload Image',
   });
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   //  console.log(user);
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const form = e.target;
      const plantName = form.name.value;
      const category = form.category.value;
      const description = form.description.value;
      const price = parseFloat(form.price.value);
      const quantity = parseInt(form.quantity.value);
      const plantImage = form.image.files;

      const image = await imageBBUpload(plantImage);
      const seller = {
         name: user?.displayName,
         email: user?.email,
         image: user?.photoURL,
      };
      const plantData = {
         plantName,
         category,
         description,
         price,
         quantity,
         image,
         seller,
      };

      // console.log(plantData);
      try {
         //post req in DB
         const { data } = await axiosSecure.post('/plants', plantData);
         console.log(data);
         if (data?.insertedId) {
            navigate('/dashboard/my-inventory');
            toast.success('Data Added Successfully!');
            form.reset();
         }
      } catch (err) {
         console.log(err);
      } finally {
         setLoading(false);
         form.reset();
      }
   };
   return (
      <div>
         <Helmet>
            <title>Add Plant | Dashboard</title>
         </Helmet>

         {/* Form */}
         <AddPlantForm
            handleSubmit={handleSubmit}
            uploadImage={uploadImage}
            setUploadImage={setUploadImage}
            loading={loading}
         />
      </div>
   );
};

export default AddPlant;

import axios from 'axios';

export const imageBBUpload = async (image) => {
   const img = image[0];
   const formData = new FormData();
   formData.append('image', img);

   const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
         import.meta.env.VITE_IMGBB_API_KEY
      }`,
      formData
   );

   return data.data.url;
};

// Save user to dataBase
export const saveUser = async (user) => {
   await axios.post(`${import.meta.env.VITE_API_URL}/users/${user.email}`, {
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
      role: 'Customer',
   });
};

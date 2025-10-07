export const sortImageName = (image, length = 10) => {
   // console.log(image?.name.substring(0, length));
   if (!image || typeof image?.name !== 'string') return 'Choose an image';
   if (image?.name.length <= 15) return image?.name;

   return image?.name
      .substring(0, length)
      .concat(`...${image?.type.split('/')[1]}`);
};

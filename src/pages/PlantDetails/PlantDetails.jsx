import Container from '../../components/Shared/Container';
import { Helmet } from 'react-helmet-async';
import Heading from '../../components/Shared/Heading';
import Button from '../../components/Shared/Button/Button';
import PurchaseModal from '../../components/Modal/PurchaseModal';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';

const PlantDetails = () => {
   let [isOpen, setIsOpen] = useState(false);
   const closeModal = () => {
      setIsOpen(false);
   };

   const { id } = useParams();
   const { role } = useRole();
   const { user } = useAuth();
   const {
      data: plantDetails = [],
      refetch,
      isLoading,
      isPending,
   } = useQuery({
      queryKey: ['plantDetails', id],
      queryFn: async () => {
         const { data } = await axios(
            `${import.meta.env.VITE_API_URL}/plants/${id}`
         );
         // console.log(data);
         return data;
      },
   });
   const {
      _id,
      category,
      description,
      image,
      plantName,
      price,
      quantity,
      seller,
   } = plantDetails;

   if (isLoading && isPending) return <LoadingSpinner />;

   return (
      <Container>
         <Helmet>
            <title>{plantName || 'Details'}</title>
         </Helmet>
         <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
            {/* Header */}
            <div className="flex flex-col gap-6 flex-1">
               <div>
                  <div className="w-full overflow-hidden rounded-xl">
                     <img
                        className="object-cover w-full"
                        src={
                           image ||
                           'https://i.ibb.co/DDnw6j9/1738597899-golden-money-plant.jpg'
                        }
                        alt="header image"
                     />
                  </div>
               </div>
            </div>
            <div className="md:gap-10 flex-1">
               {/* Plant Info */}
               <Heading
                  title={plantName || 'Money Plant'}
                  subtitle={`Category: ${category || 'Succulent'}`}
               />
               <hr className="my-6" />
               <div
                  className="
          text-lg font-light text-neutral-500"
               >
                  {description}
               </div>
               <hr className="my-6" />

               <div
                  className="
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              "
               >
                  <div>Seller: {seller?.name || 'Seller Name'}</div>

                  <img
                     className="rounded-full"
                     height="30"
                     width="30"
                     alt="Avatar"
                     referrerPolicy="no-referrer"
                     src={
                        seller?.image ||
                        'https://lh3.googleusercontent.com/a/ACg8ocKUMU3XIX-JSUB80Gj_bYIWfYudpibgdwZE1xqmAGxHASgdvCZZ=s96-c'
                     }
                  />
               </div>
               <hr className="my-6" />
               <div>
                  <p
                     className="
                gap-4 
                font-light
                text-neutral-500
              "
                  >
                     Quantity: {quantity || 0} Units Left Only!
                  </p>
               </div>
               <hr className="my-6" />
               <div className="flex justify-between">
                  <p className="font-bold text-3xl text-gray-500">
                     Price: {price || 0}$
                  </p>
                  <div>
                     <Button
                        disabled={
                           !quantity ||
                           role === 'Seller' ||
                           role === 'Admin' ||
                           seller?.email === user?.email
                        }
                        onClick={() => setIsOpen(true)}
                        label={!quantity ? 'Out Of Stock' : 'Purchase'}
                     />
                  </div>
               </div>
               <hr className="my-6" />

               <PurchaseModal
                  plantDetails={plantDetails}
                  refetch={refetch}
                  closeModal={closeModal}
                  isOpen={isOpen}
                  plantId={_id}
               />
            </div>
         </div>
      </Container>
   );
};

export default PlantDetails;

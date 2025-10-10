/* eslint-disable react/prop-types */
import {
   Dialog,
   Transition,
   TransitionChild,
   DialogPanel,
   DialogTitle,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import Button from '../Shared/Button/Button';

import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../Form/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
// console.log(stripePromise);

const PurchaseModal = ({
   closeModal,
   isOpen,
   plantDetails,
   refetch,
   plantId,
}) => {
   // console.log('this id', plantId);
   // Total Price Calculation
   const { user } = useAuth();
   const axiosSecure = useAxiosSecure();
   const navigate = useNavigate();
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
   const [totalQuantity, setTotalQuantity] = useState(1);
   const [totalPrice, setTotalPrice] = useState(price);
   const [customerAddress, setCustomerAddress] = useState('');

   const handleQuantity = (value) => {
      if (value > quantity) {
         setTotalQuantity(quantity);
         toast.error('Sorry, you cannot buy more than available stock!');
      }
      if (value < 0) {
         setTotalQuantity(1);
         toast.error('Please select at least 1 unit!');
         setTotalPrice(price);
      }

      setTotalQuantity(value);
      setTotalPrice(value * price);

      // console.log(totalQuantity);
   };

   const purchaseInfo = {
      customer: {
         name: user?.displayName,
         email: user?.email,
         image: user?.photoURL,
      },
      plantId: _id,
      price: totalPrice,
      quantity: totalQuantity < 1 ? 1 : totalQuantity,
      address: customerAddress,
      seller: seller.email,
      status: 'Pending',
   };

   return (
      <Transition appear show={isOpen} as={Fragment}>
         <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <TransitionChild
               as={Fragment}
               enter="ease-out duration-300"
               enterFrom="opacity-0"
               enterTo="opacity-100"
               leave="ease-in duration-200"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
            >
               <div className="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
               <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <TransitionChild
                     as={Fragment}
                     enter="ease-out duration-300"
                     enterFrom="opacity-0 scale-95"
                     enterTo="opacity-100 scale-100"
                     leave="ease-in duration-200"
                     leaveFrom="opacity-100 scale-100"
                     leaveTo="opacity-0 scale-95"
                  >
                     <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <DialogTitle
                           as="h3"
                           className="text-lg font-medium text-center leading-6 text-gray-900"
                        >
                           Review Info Before Purchase
                        </DialogTitle>
                        <div className="mt-2">
                           <p className="text-sm text-gray-500">
                              Plant: {plantName || 'name'}
                           </p>
                        </div>
                        <div className="mt-2">
                           <p className="text-sm text-gray-500">
                              Category: {category || 'Category'}
                           </p>
                        </div>
                        <div className="mt-2">
                           <p className="text-sm text-gray-500">
                              Customer: {user?.displayName}
                           </p>
                        </div>

                        <div className="mt-2">
                           <p className="text-sm text-gray-500">
                              Price: $ {price || 0}
                           </p>
                        </div>
                        <div className="mt-2">
                           <p className="text-sm text-gray-500">
                              Available Quantity: {quantity || 0}
                           </p>
                        </div>
                        {/* Quantity Feald */}
                        <div className="space-x-2 text-sm mt-3">
                           <label htmlFor="name" className=" text-gray-600">
                              Quantity :
                           </label>

                           <input
                              // max={quantity}
                              value={totalQuantity}
                              onChange={(e) =>
                                 handleQuantity(parseInt(e.target.value))
                              }
                              className=" p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                              name="quantity"
                              id="quantity"
                              type="number"
                              placeholder="Quantity"
                              required
                           />
                        </div>

                        {/* Address Feald */}
                        <div className="space-x-2 text-sm mt-3 mb-5">
                           <label htmlFor="name" className=" text-gray-600">
                              Address :
                           </label>

                           <input
                              onChange={(e) =>
                                 setCustomerAddress(e.target.value)
                              }
                              className={`p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white `}
                              name="address"
                              id="address"
                              type="text"
                              placeholder="Shipping Address"
                              required
                           />
                        </div>

                        {/* Checkout Form */}
                        <Elements stripe={stripePromise}>
                           {/* Checkout Form */}
                           <CheckoutForm
                              purchaseInfo={purchaseInfo}
                              totalQuantity={totalQuantity}
                              setTotalQuantity={setTotalQuantity}
                              totalPrice={totalPrice}
                              customerAddress={customerAddress}
                              setCustomerAddress={setCustomerAddress}
                              closeModal={closeModal}
                              refetch={refetch}
                              plantId={plantId}
                           />
                        </Elements>
                     </DialogPanel>
                  </TransitionChild>
               </div>
            </div>
         </Dialog>
      </Transition>
   );
};

export default PurchaseModal;

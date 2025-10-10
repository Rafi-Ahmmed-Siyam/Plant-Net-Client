import {
   CardElement,
   Elements,
   useElements,
   useStripe,
} from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import Button from '../Shared/Button/Button';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutForm = ({
   totalQuantity,
   setTotalQuantity,
   totalPrice,
   customerAddress,
   setCustomerAddress,
   closeModal,
   refetch,
   plantId,
   purchaseInfo,
}) => {
   // console.log('plant id from form', plantId);
   const AxiosSecure = useAxiosSecure();
   const { user } = useAuth();
   const [clientSecret, setClientSecret] = useState('');
   const [payLoading, setPayLoading] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      getPaymentIntent();
   }, [totalQuantity]);

   const getPaymentIntent = async () => {
      try {
         const { data } = await AxiosSecure.post('/create-payment-intent', {
            quantity: totalQuantity,
            plantId: plantId,
         });

         setClientSecret(data.clientSecret);
      } catch (err) {
         console.log(err);
      }
   };

   const stripe = useStripe();
   const elements = useElements();

   const handleSubmit = async (event) => {
      event.preventDefault();
      setPayLoading(true);
      if (!stripe || !elements) {
         return;
      }

      // Get card element
      const card = elements.getElement(CardElement);
      if (card == null) {
         return;
      }
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: 'card',
         card,
      });

      if (error) {
         console.log('[error]', error);
      } else {
         console.log('[PaymentMethod]', paymentMethod);
      }

      // Confirm payment
      const { paymentIntent, error: intentError } =
         await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
               card: card,
               billing_details: {
                  email: user?.email || 'anonymous',
                  name: user?.displayName || 'anonymous',
               },
            },
         });

      if (intentError) {
         setPayLoading(false);
         console.log(intentError);
      } else {
         if (paymentIntent?.status === 'succeeded') {
            // Store Order data in database and send patch request ----------------
            try {
               const { data: insertResult } = await AxiosSecure.post(
                  '/orders',
                  { ...purchaseInfo, transactionID: paymentIntent.id }
               );
               // Update plant Quantity
               const { data: updateQuantityResult } = await AxiosSecure.patch(
                  '/plants/quantity',
                  {
                     id: plantId,
                     quantity: totalQuantity,
                  }
               );
               console.log(updateQuantityResult);
               console.log(insertResult);
               if (
                  insertResult?.insertedId &&
                  updateQuantityResult.modifiedCount > 0
               ) {
                  toast.success(
                     `Order Successful. Your transaction Id: ${paymentIntent?.id}`
                  );
                  card.clear();
                  setTotalQuantity(1);
                  setCustomerAddress('');
                  refetch();
                  console.log(paymentIntent.id);
                  setTimeout(() => {
                     setPayLoading(false);
                     closeModal();
                     navigate('/dashboard/my-orders');
                  }, 100);
               }
            } catch (err) {
               setPayLoading(false);
               console.log(err);
               toast.error(err?.message || 'Something went wrong! Try again');
            }
            // ------------------------
         }
      }
   };

   return (
      <form onSubmit={handleSubmit}>
         <CardElement
            options={{
               style: {
                  base: {
                     fontSize: '16px',
                     color: '#424770',
                     '::placeholder': {
                        color: '#aab7c4',
                     },
                  },
                  invalid: {
                     color: '#9e2146',
                  },
               },
            }}
         />
         <div className="flex justify-around gap-5 items-center">
            <Button
               label={`Pay $${!totalQuantity ? 0 : totalPrice}`}
               disabled={!stripe || payLoading}
               type="submit"
            />
            <Button outline={true} label={'Cancel'} onClick={closeModal} />
         </div>
      </form>
   );
};

export default CheckoutForm;

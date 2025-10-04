import { Link } from 'react-router-dom';

const Card = ({ plant }) => {
   const { _id, category, description, image, plantName, price, quantity } =
      plant || {};
   return (
      <Link
         to={`/plant/${_id}`}
         className="col-span-1 cursor-pointer group shadow-xl p-3 rounded-xl"
      >
         <div className="flex flex-col gap-2 w-full">
            <div
               className="
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            "
            >
               <img
                  className="
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              "
                  src={
                     image ||
                     'https://i.ibb.co.com/rMHmQP2/money-plant-in-feng-shui-brings-luck.jpg'
                  }
                  alt="Plant Image"
               />
               <div
                  className="
              absolute
              top-3
              right-3
            "
               ></div>
            </div>
            <div className="font-semibold text-lg">
               {plantName || 'Money Plant'}
            </div>
            <div className="font-semibold text-lg">
               Category: {category || 'Indoor'}
            </div>
            <div className="font-semibold text-lg">
               Quantity: {quantity || 0}
            </div>
            <div className="flex flex-row items-center gap-1">
               <div className="font-semibold"> Price:{price || 0}$</div>
            </div>
         </div>
      </Link>
   );
};



export default Card;

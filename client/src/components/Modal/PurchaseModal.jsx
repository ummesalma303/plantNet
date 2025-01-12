/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import Button from "../Shared/Button/Button";
import toast from "react-hot-toast";
import { AuthContext } from "../../providers/AuthProvider";
// import useAxiosPublic, { axiosPublic } from '../../hooks/useAxiosPublic'
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PurchaseModal = ({ closeModal, isOpen, plant,refetch }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  // console.log(user);
  // Total Price Calculation
  const [disable,setDisable] = useState(false)
  const [address, setAddress] = useState("");
  // console.log( address  )
  const [totalQuantity, setTotalQuantity] = useState(1);
  const { _id, seller, category, name,image, price, quantity } = plant || {};
  const [totalPrice, setTotalPrice] = useState(price);

  const handleQuantity = (value) => {
    let min = 0 
    let max = quantity
    let val= Math.max(min,Math.min(max,value))
    // console.log(val)
    setTotalQuantity(val);
    // console.log(totalQuantity)
    if (value > quantity || value < 0) {

      // console.log(value);
      
      // setDisable(true)
      return toast.error("Quantity exceeds available stock!");
    }
    setTotalPrice(value * parseInt(price));
    // console.log(totalPrice);
  };


  const handlePurchase = async (id,quantity) => {
    
  if (quantity<=0) {
    setDisable(true)
    return
  }
    const purchaseInfo = {
      customer: {
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      },
      image,
      plantId: _id,
      price: totalPrice,
      category,
      quantity: parseInt(totalQuantity),
      seller: seller?.email,
      address: address,
      status: "Pending",
    };
    // const address = e.target.address
    // console.log(purchaseInfo)
   await axiosSecure
      .post("/order", purchaseInfo)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
      

   await axiosSecure
      .patch(`/plants/quantity/${id}`,{ quantityToUpdate:totalQuantity,status: 'decrease'})
      .then((res) => {
        console.log(res.data)
      
        refetch()
      })
      .catch((err) => console.log(err));

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
                  <p className="text-sm text-gray-500">Plant: {name}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Category: {category}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Customer:{seller?.name}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">Price: $ {price}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Available Quantity: {quantity}
                  </p>
                </div>
                {/* quantity */}
                <div className="space-y-1 text-sm flex items-center">
                  <label htmlFor="name" className="block text-gray-600">
                    Quantity
                  </label>
                  <input value={totalQuantity}
                    onChange={(e) => handleQuantity(parseInt(e.target.value))}
                    className="p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                    name="quantity"
                    id="quantity"
                    type="number"
                    placeholder="Available quantity"
                    required
                  />
                </div>
                {/* Address input field */}
                <div className="space-x-2 mt-2 text-sm">
                  <label htmlFor="address" className=" text-gray-600">
                    Address:
                  </label>
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    className="p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white"
                    name="address"
                    id="address"
                    type="text"
                    placeholder="Shipping Address.."
                    required
                  />
                </div>
                <div className="mt-3">
                  <Button disabled={disable}
                    onClick={()=>handlePurchase(_id,quantity)}
                    label={`Purchase ${totalPrice}`}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PurchaseModal;

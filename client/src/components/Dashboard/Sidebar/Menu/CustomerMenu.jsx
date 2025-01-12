import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from './MenuItem'
import { useContext, useState } from 'react'
import BecomeSellerModal from '../../../Modal/BecomeSellerModal'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import { AuthContext } from '../../../../providers/AuthProvider'
import toast from 'react-hot-toast'


const CustomerMenu = () => {
  const {user} = useContext(AuthContext)
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleReqStatus = () =>{
     axiosSecure.patch(`/users/${user?.email}`)
     .then(res=>{
       closeModal()
       toast.success('Successfully Applied to become a seller👍')
       console.log(res.data)
    })
     .catch(err=>{
       closeModal()
       toast.error(err.response.data + '👊')
    })
  }
  return (
    <>
      <MenuItem icon={BsFingerprint} label='My Orders' address='my-orders' />

      <div
        onClick={() => setIsOpen(true)}
        className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'
      >
        <GrUserAdmin className='w-5 h-5' />

        <span className='mx-4 font-medium'>Become A Seller</span>
      </div>

      <BecomeSellerModal handleReqStatus={handleReqStatus} closeModal={closeModal} isOpen={isOpen} />
    </>
  )
}

export default CustomerMenu

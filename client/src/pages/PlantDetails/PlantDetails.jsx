import Container from '../../components/Shared/Container'
import { Helmet } from 'react-helmet-async'
import Heading from '../../components/Shared/Heading'
import Button from '../../components/Shared/Button/Button'
import PurchaseModal from '../../components/Modal/PurchaseModal'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
import useAxiosPublic from '../../hooks/useAxiosPublic'

const PlantDetails = () => {
  let [isOpen, setIsOpen] = useState(false);
  const axiosPublic = useAxiosPublic()
  const {id} = useParams()
  // console.log(id)
  const {data:plant = {}} = useQuery({
    queryKey:['plant',id],
    queryFn: async () => {
      const res = await axiosPublic.get(`http://localhost:9000/plants/${id}`)
      // console.log(res)
      return res.data
    }
  })
// console.log(plant)
  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <Container>
      <Helmet>
        <title>Money Plant</title>
      </Helmet>
      <div className='mx-auto flex flex-col lg:flex-row justify-between w-full gap-12'>
        {/* Header */}
        <div className='flex flex-col gap-6 flex-1'>
          <div>
            <div className='w-full overflow-hidden rounded-xl'>
              <img
                className='object-cover w-full'
                src={plant?.image}
                alt='header image'
              />
            </div>
          </div>
        </div>
        <div className='md:gap-10 flex-1'>
          {/* Plant Info */}
          <Heading
            title={''}
            subtitle={`Category: ${plant?.category}`}
          />
          <hr className='my-6' />
          <div
            className='
          text-lg font-light text-neutral-500'
          >
            {plant?.description}
          </div>
          <hr className='my-6' />

          <div
            className='
                text-xl 
                font-semibold 
                flex 
                flex-row 
                items-center
                gap-2
              '
          >
            <div>Seller: {plant?.seller?.name}</div>

            <img
              className='rounded-full'
              height='30'
              width='30'
              alt='Avatar'
              referrerPolicy='no-referrer'
              src={plant?.seller?.image}
            />
          </div>
          <hr className='my-6' />
          <div>
            <p
              className='
                gap-4 
                font-light
                text-neutral-500
              '
            >
              Quantity: {plant?.quantity} Units Left Only!
            </p>
          </div>
          <hr className='my-6' />
          <div className='flex justify-between'>
            <p className='font-bold text-3xl text-gray-500'>Price: {plant?.price}$</p>
            <div>
              <Button onClick={()=>setIsOpen(true)} label='Purchase' />
            </div>
          </div>
          <hr className='my-6' />

          <PurchaseModal closeModal={closeModal} isOpen={isOpen} plant={plant} />

          <div className='md:col-span-3 order-first md:order-last mb-10'>
            {/* RoomReservation */}
            {/* <RoomReservation room={room} /> */}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default PlantDetails

import Card from './Card'
import Container from '../Shared/Container'
// import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import axios from 'axios'

const Plants = () => {
  const {data:plants,isLoading} = useQuery({ queryKey: ['plants'], 
    queryFn: async () => {
      const { data } = await axios(`http://localhost:9000/plant`)
      return data
    },})
    if (isLoading) {
      return <h2>Loading......</h2>
    }
    // console.log(plants)
  return (
    <Container>
      <div className='pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {
          plants?.map(plant=> <Card  key={plant._id} plant={plant} />)
        }
      </div>
    </Container>
  )
}

export default Plants

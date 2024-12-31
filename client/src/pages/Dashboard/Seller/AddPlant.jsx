import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { uploadImage } from '../../../api/utils'
import axios from 'axios'

const AddPlant = () => {
  const handleSubmit=async e=>{
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const category = form.category.value
    const description = form.description.value
    const price = form.price.value
    const quantity = form.quantity.value
    const image = form.image.files[0]
    const imageUrl = await uploadImage(image)
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
      seller,
    }
    console.log(plantData)
    axios.post(`${import.meta.env.VITE_API_URL}/plants`)
    .then(res=>console.log(res.data))
  }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit}/>
    </div>
  )
}

export default AddPlant

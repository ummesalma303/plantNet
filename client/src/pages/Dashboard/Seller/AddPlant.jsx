import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { uploadImage } from '../../../api/utils'
import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from '../../../providers/AuthProvider'

const AddPlant = () => {
  const [uploadButtonImage, setUploadImage] = useState({
    image: { name: 'Upload Button' },
  })
 
  const {user} =useContext(AuthContext);
  const handleSubmit=async e=>{
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const category = form.category.value
    const description = form.description.value
    const price = form.price.value
    const quantity = form.quantity.value
    const image = form.image.files[0]
    const imageUrl = await uploadImage(image);
    // console.log(imageUrl)
    const seller ={
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }
    const plantData = {
      name,
      category,
      description,
      price:parseInt(price),
      quantity:parseInt(quantity),
      image: imageUrl,
      seller,
    }
    console.log(plantData)
    axios.post(`${import.meta.env.VITE_API_URL}/plants`,plantData)
    .then(res=>console.log(res.data))
  }
  // const handlePhoto=(v)=>{
    // console.log(v)
  // }
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm handleSubmit={handleSubmit} uploadButtonImage={uploadButtonImage} setUploadImage={setUploadImage}/>
    </div>
  )
}

export default AddPlant

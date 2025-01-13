require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')

const port = process.env.PORT || 9000
const app = express()
// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ot76b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = 'mongodb://localhost:27017/'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {

    const db = client.db('plantNet-session')
    const usersCollection = db.collection('users')
    const plantsCollection = db.collection('plants')
    const orderCollection = db.collection('orders')
    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      // console.log('line 55 ====>',email)
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })


    //users
    app.post('/users/:email',async(req,res)=>{
      const users = req.body
      const email = req.params.email
      const query = {email}
      const isExist = await usersCollection.findOne(query)
      
       if (isExist) {
        return res.send(isExist)
      }
      const result = await usersCollection.insertOne({
        ...users,
        role: 'customer',
        timestamp:Date.now()
      })

      res.send(result)
    })
    
// admin and seller and users
app.patch('/users/:email',async(req,res) =>{
  const email = req.params.email
  const query = {email}
  const user = await usersCollection.findOne(query);
  console.log('178---->',user)
  if (user?.status === 'Requested') {
    return res
    .status(400)
    .send('You have already requested, wait for some time.')
  }
  const updateDoc = {
    $set: {
      status: 'Requested',
    },
  }
  const result = await usersCollection.updateOne(query,updateDoc);
  res.send(result)
})


app.get('/users/:email',async (req,res)=>{
  const email = req.params.email
  const query = {email:{$ne:email}}
  const result = await usersCollection.find(query).toArray()
  // console.log(result)
  res.send(result)
})


app.get('/users/role/:email',async (req,res)=>{
  const email = req.params.email
  // const query = {email:{$ne:email}}
  const result = await usersCollection.findOne({email})
  // console.log(result)
  res.send({role: result?.role })
})

// plants
app.get('/plants/:id',async(req,res)=>{
  const id = req.params.id
  console.log(id)
  const query = ({_id: new ObjectId(id)})
  const result = await plantsCollection.findOne(query)
  console.log(result)
  res.send(result)
})

    app.get('/plant',async (req,res)=>{
      const result = await plantsCollection.find().toArray()
      // console.log(result)
      res.send(result)
    })

    app.post('/plants',async(req,res)=>{
      const plant = req.body
      const result = await plantsCollection.insertOne(plant)
      res.send(result)
    })



// orders
app.get('/order/:email',async (req,res)=>{
  const email = req.params.email
  const filter = {'customer.email':email} 
  const result = await orderCollection.find(filter).toArray()
  res.send(result)
})

app.post('/order',async(req,res)=>{
  const order = req.body
  const result = await orderCollection.insertOne(order);
  console.log(result)
  res.send(result)
})

app.delete('/orders/:id',async (req,res)=>{
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const result = await orderCollection.deleteOne(query)
  res.send(result)
})

app.patch('/plants/quantity/:id',async (req,res) =>{
  const id = req.params.id
  // console.log('158------>',id)
  const {quantityToUpdate, status} = req.body
  const filter = {_id: new ObjectId(id)};
  console.log(filter)
  let updateDoc = {
    $inc: {quantity: -quantityToUpdate}
  }

  if (status === 'increase') {
    updateDoc = {
      $inc: {quantity: quantityToUpdate}
    }
  }
  const result = await plantsCollection.updateOne(filter,updateDoc)
  console.log(result)
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from plantNet Server..')
})

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`)
})

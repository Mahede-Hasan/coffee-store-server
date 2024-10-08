const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

// admin
// nhbyrLniFVFOrpTU



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1ici.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const coffeeCollection = client.db('coffeeDB').collection('coffee');


    app.post('/coffee', async(req,res)=>{
        const cursor = req.body;
        const result = await coffeeCollection.insertOne(cursor)
        res.send(result)
    })

    app.get('/coffee', async(req,res)=>{
       const cursor = coffeeCollection.find();
       const result = await cursor.toArray()
       res.send(result)
    })

    app.get('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })

    app.put('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const coffee = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const UpdateCoffee = {
            $set:{
                name: coffee.name,
                photo: coffee.photo,
                chef: coffee.chef,
                price: coffee.price
            }
        }
        const result = coffeeCollection.updateOne(filter,UpdateCoffee,options)
        res.send(result)
    })

    app.delete('/coffee/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)

    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('coffee server is on')
})

app.listen(port,()=>{
    console.log(`server is running on the port ${port}`)
})
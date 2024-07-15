const express = require('express')
const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da6po2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db('research-and-development');
    const userCollection = database.collection("users");


    app.post('/users', async (req, res) => {
      const userData = req.body;
    
      try {
        if (userData._id) {
          // Update operation
          const userId = userData._id;
          delete userData._id; // Remove _id from the userData to prevent overriding it
    
          const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: userData }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
          }
    
          res.send(result);
        } else {
          // Create operation
          const result = await userCollection.insertOne(userData);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to create or update user' });
      }
    });

    app.get('/users', async(req, res) => {
      const getUser = userCollection.find();
      const result = await getUser.toArray();
      res.send(result);
    });


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('R & D Server Running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
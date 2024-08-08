const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const employeeCollection = database.collection("employee");
    const studentCollection = database.collection("student-info");
    const studentRecordCollection = database.collection("student-record");


    app.post('/employees', async (req, res) => {
      const empData = req.body;
    
      try {
        if (empData._id) {
          // Update operation
          const userId = empData._id;
          delete empData._id; // Remove _id from the userData to prevent overriding it
    
          const result = await employeeCollection.updateOne(
            { 
              _id: new ObjectId(userId) 
            },
            { 
              $set: empData 
            }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
          }
          res.send(result);
        } else {
          // Create operation
          const result = await employeeCollection.insertOne(empData);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to create or update user' });
      }
    });

    app.post('/student-info', async (req, res) => {
      const studentData = req.body;
    
      try {
        if (studentData._id) {
          // Update operation
          const studentId = studentData._id;
          delete studentData._id; // Remove _id from the userData to prevent overriding it
    
          const result = await studentCollection.updateOne(
            { 
              _id: new ObjectId(studentId) 
            },
            { 
              $set: studentData 
            }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
          }
    
          res.send(result);
        } else {
          // Create operation
          const result = await studentCollection.insertOne(studentData);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to create or update user' });
      }
    });
    app.post('/student-record', async (req, res) => {
      const studentData = req.body;
    
      try {
        if (studentData._id) {
          // Update operation
          const studentId = studentData._id;
          delete studentData._id; // Remove _id from the userData to prevent overriding it
    
          const result = await studentRecordCollection.updateOne(
            { 
              _id: new ObjectId(studentId) 
            },
            { 
              $set: studentData 
            }
          );
    
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
          }
    
          res.send(result);
        } else {
          // Create operation
          const result = await studentRecordCollection.insertOne(studentData);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to create or update user' });
      }
    });

    app.get('/employees', async(req, res) => {
      const getUser = employeeCollection.find();
      const result = await getUser.toArray();
      res.send(result);
    });

    app.get('/student-info', async(req, res) => {
      const getStudentInfo = studentCollection.find();
      const result = await getStudentInfo.toArray();
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
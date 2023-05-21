const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// actionToyDb
// cOKGiTMwXY5siWU8

// middlewere
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhijgnu.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db("toyDb").collection("products");

    app.get('/products', async (req, res) => {
      try {
        const result = await toyCollection.find().toArray()
        res.send(result)
      } catch (error) {
        res.send(error)
      }

    })

    app.get('/product', async (req, res) => {

      try {
        let query = {}
        if (req.query?.sellerEmail) {
          query = { sellerEmail: req.query?.sellerEmail }
        }
        const result = await toyCollection.find(query).toArray()
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })
    app.get('/update/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.findOne(query)
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })

    app.get('/products/:text', async (req, res) => {
      try {
        const result = await toyCollection.find({ sub_category: req.params.text }).toArray()
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })

    app.post('/products', async (req, res) => {
      try {
        const newToy = req.body;
        const result = await toyCollection.insertOne(newToy)
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })

    app.put('/update/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updateToy = req.body;
        const toy = {
          $set: {
            price: updateToy.price,
            quantity: updateToy.quantity,
            description: updateToy.description
          },
        };
        const result = await toyCollection.updateOne(filter, toy, options);
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })

    app.delete('/products/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.deleteOne(query)
        res.send(result)
      } catch (error) {
        res.send(error)
      }
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`)
})
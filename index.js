const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

// database
// user: mongodbUser2
//pass: gs7iS3WzepkzM1za
const uri = "mongodb+srv://mongodbUser2:gs7iS3WzepkzM1za@cluster0.nn9d9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
     try {
          await client.connect();
          const database = client.db("product-management");
          const userCollection = database.collection("product");

          // post api / create operation
          app.post('/products', async (req, res) => {
               const user = req.body;
               const result = await userCollection.insertOne(user);
               console.log('new product add', req.body)
               res.send(result)
          })
          // get api / read operation
          app.get('/products', async (req, res) => {
               const cursor = userCollection.find({});
               const result = await cursor.toArray();

               res.send(result)
          })

          // get api single 
          app.get('/products/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await userCollection.findOne(query);
               res.send(result);
          })
          // get api for single /delete operation
          app.delete('/products/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await userCollection.deleteOne(query);
               console.log('delete proccess', req.body);
               res.json(result);
          })

          // get api / update operation
          app.put('/products/:id', async (req, res) => {
               const id = req.params.id;
               const updateProduct = req.body;
               const filter = { _id: ObjectId(id) };
               const options = { upsert: true };
               const updateDc = {
                    $set: {
                         name: updateProduct.name,
                         price: updateProduct.price,
                         quantity: updateProduct.quantity
                    }
               }
               const result = await userCollection.updateOne(filter, updateDc, options);
               res.send(result);

          })

     } finally {
          // await client.close();
     }
}
run().catch(console.dir);

app.get('/', (req, res) => {
     res.send('res send');
})

app.listen(port, () => {
     console.log("listing this port", port);
})
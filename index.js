const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config();
const port = process.env.PORT || 3000

const URI = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.jedwi9k.mongodb.net/?retryWrites=true&w=majority`

//middleware 
app.use(cors())
app.use(express.json());

// create route 

app.get("/addidas",(req,res)=>{
       res.json(addidas)  
})

const { MongoClient, ServerApiVersion } = require('mongodb');


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(URI, {
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
  } finally {
    
  }
}
run().catch(console.dir);




app.listen(port,()=>{
     console.log(`app is listening on port ${port}`)
})
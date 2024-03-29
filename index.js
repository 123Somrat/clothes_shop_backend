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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
    const database = client.db("clothesDb");
    const clothes = database.collection("clothes");
    const cartDb = client.db("cartDb")
    const addedProduct = cartDb.collection("addedProduct");
    
    // get product as a brand wise
    app.get("/brands/:brand_name",async(req,res)=>{
        const search = req.params.brand_name;
         const query = { brandName : search};
         const data =  await clothes.find(query).toArray();  
          res.send(data)

    }),

     // get single products
    app.get("/viewdetails/:_id",async(req,res)=>{
       const id = req.params._id
       const query = {_id: new ObjectId(id)}
       const product = await clothes.findOne(query)
         res.send(product)
    })
    
    // get item for update 
    app.get("/update/:id",async(req,res)=>{
       const id = req.params.id
       console.log(id)
       const query = {_id:new ObjectId(id)}
        const product = await clothes.findOne(query)
         res.send(product)
    })


   // create cart collection for cart item
    app.get("/cartItems",async(req,res)=>{
      const CartItem = await addedProduct.find().toArray();
      res.send(CartItem)
     
 })
    



     // add cart item in db
     app.post("/addToCart",async(req,res)=>{
         const addedItem = req.body;
         const id = req.body._id;
         const query = {_id: id}
         // checking item already exiest in db
         const alreadyExeistInDB = await addedProduct.findOne(query)

         // if item already in db we retun from here otherwise we insert in db
         if(alreadyExeistInDB){
             return res.send("Item already in cart")
         } else{
             const cartItem = await addedProduct.insertOne(addedItem);
             res.send(cartItem)

         }
        
       
     })

 // add items on collection
  app.post("/cartItems/:id",async(req,res)=>{
    const id = req.params.id
     const data = req.body.item;
     const query = {_id :id}
     console.log(query)
     const options = { "upsert": false };
     const updatedData = await addedProduct.updateOne(query,{$set : {item : data}},options)
      res.status(200).send(updatedData)
  })





    // add a clothes
    app.post("/products",async(req,res)=>{
        const clothe = req.body;
        const insertedClothe = await clothes.insertOne(clothe);
         res.send(insertedClothe)
    })

 // deleteItems from cart
    app.delete("/deleteitem/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id:id}
      const data = await addedProduct.deleteOne(query)
      res.send(data)
       
     
   })


   app.delete("/deleteAllCartItems",async(req,res)=>{
       const deletedCartItems =await addedProduct.deleteMany({})
       res.send(deletedCartItems)
   })

   // update product route
 app.put("/products/:id",async(req,res)=>{
      const id = req.params.id;
      const updatedDocs = req.body
      const filter = {_id:new ObjectId(id)}
      const options = {upsert : true};
      const updatedProduct = {
        $set: {
          productName : updatedDocs .productName,
          brandName :  updatedDocs .brandName,
          imageUrl : updatedDocs .imageUrl,
          productType :  updatedDocs .productType,
          price : updatedDocs .price,
          description : updatedDocs .description,
          ratings :  updatedDocs .ratings 
        },
      };
      const result = await clothes.updateOne(filter, updatedProduct, options);
        res.send(result)
 })



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
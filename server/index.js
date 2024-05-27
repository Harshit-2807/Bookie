const express=require('express')
const app=express()
const port=process.env.PORT || 5000
const cors=require('cors')
const allowedOrigins = ["https://bookie1.onrender.com"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
  },
  methods: 'GET,POST,PUT,DELETE,HEAD,PATCH',
  allowedHeaders: 'Content-Type',
  credentials: true,
  
}));
app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Hi readers")
})



const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://main_user:1dIPE5nH1xMjwofR@cluster0.uqv1coj.mongodb.net/BookInventory";

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
    
    //creating a collection of documents
    const booksCollections= client.db("BookInventory").collection("books");
        
    //inserting book into database:post the book to the collection
    app.post("/upload-book",async(req,res)=>{
      const data=req.body;
      const result=await booksCollections.insertOne(data);
      res.send(result);
    })

    //get all books from database
    // app.get("/all-books",async(req,res)=>{
    //   const books= booksCollections.find();
    //   const result=await books.toArray();
    //   res.send(result);
    // })

    //update a book data:patch or update method
    app.patch("/book/:id",async(req,res)=>{
      const id=req.params.id;
     // console.log(id);
     const updateBookData=req.body;
     const filter={_id:new ObjectId(id)};
     const options={upsert:true};
     const updateDoc={
      $set:{
        ...updateBookData
      }
     }
     //update
     const result=await booksCollections.updateOne(filter,updateDoc,options);
     res.send(result);
    })

    //delete a book data:patch
    app.delete("/book/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const result=await booksCollections.deleteOne(filter);
      res.send(result);
    })
    //find by category
    app.get("/all-books",async(req,res) =>{
       let query={};
       if(req.query?.category){
          query={category:req.query.category}
       }
       const result=await booksCollections.find(query).toArray();
       res.send(result);
    })

      // to get single book data 
      app.get("/book/:id",async(req,res)=>{
        const id=req.params.id;
        const filter={_id:new ObjectId(id)};
        const result=await booksCollections.findOne(filter);
        res.send(result);
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



app.listen(port,()=>{
    console.log(`app running at port ${port}`)
})

// kahi aur bhi project chal raha kya? 
// 5000 port pe kuch to chal raha hai port yahn change krde
// client side har jagah 5000 se call hua hairuk ja ek min
// win key click kar
// ek kaam kar   pc restart kar merko lgra desktop pr jo bookie hai vo 
// chal gaya yayyyy, you there????yeeeeeeeaaaaah
//chalio ek baar complete dekhe jra
// arre sunoo bolo maine dusri images lga rkhi hain to kaise hi chaega ek kaam kar
// jo tu bana rahi thi client tab jo images tune lagai hai unhe bhi assests me hi rakhi hogi na?? images store kaha ho rahi sari??images maine download nhi ki thi directly link dala tha post krte time to unhe fetch kyon nahi kar raha fir?? hellooo
//kya fayda 
const express= require('express');
const cors= require('cors');
const app=express();
const port= process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://todouser:0K160ZkfU3uy1SvX@cluster0.cfuzedb.mongodb.net/?retryWrites=true&w=majority";

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
    //await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const tasks= client.db('todoDB').collection('tasks');

    app.post('/addTask', async (req,res)=>{
        const data= req.body;
        const result= await tasks.insertOne(data);
        res.send(result);
    })

    app.get('/allTasks', async (req, res)=>{
        const result= await tasks.find().toArray();
        res.send(result);
    })

    app.get('/allTasks/low', async (req, res)=>{
        const query= {priority:'low'}
        const result= await tasks.find(query).toArray();
        res.send(result);
    })

    app.get('/allTasks/high', async (req, res)=>{
        const query= {priority:'high'}
        const result= await tasks.find(query).toArray();
        res.send(result);
    })

    app.get('/allTasks/moderate', async (req, res)=>{
        const query= {priority:'moderate'}
        const result= await tasks.find(query).toArray();
        res.send(result);
    })

    app.delete('/tasks/delete/:id', async(req, res)=>{
        const id= req.params.id; 
        const query= {_id: new ObjectId(id)}
        const result= await tasks.deleteOne(query);
        res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req,res)=>{
    await res.send('Bookshelf Server is running');
})

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`)
})
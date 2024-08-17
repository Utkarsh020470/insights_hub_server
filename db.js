import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config(); // reading .env file

const uri = `mongodb+srv://utkarsh2807saxena:${process.env.MONGODB_PASSWORD}@cluster0.p7n41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export let collection;

export const connectToDB = async (cb) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('blogsDB').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const db = client.db('blogsDB');
    collection = db.collection('blogs');
    console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`
    );
    cb(null);
  } catch (err) {
    cb(err);
  }
};

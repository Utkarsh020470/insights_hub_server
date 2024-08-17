import express, { response } from 'express';
import { connectToDB, collection } from './db.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // reading .env file

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json()); // use -> middleware
app.use(cors());
// app.get('/test', (req, res) => {
//   console.log(req.query);
//   res.json({ abc: '123' });
// });

app.get('/getAllBlogs', async (req, res) => {
  try {
    const allBlogs = await collection.find({}).toArray();
    res.status(200).json(allBlogs);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: 'could not find all blogs', err: error });
  }
});

app.get('/getSingleBlog/:id', async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const id = req.params.id;
    try {
      const singleBlog = await collection.findOne({ _id: new ObjectId(id) });
      console.log(singleBlog);
      res.status(200).json(singleBlog);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: 'could not find single blog', err: error });
    }
  } else {
    console.error('Object Id is not valid');
  }
});

app.get('/getPublisherBlogs/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  try {
    const allBlogs = await collection.find({ authorId: authorId }).toArray();
    res.status(200).json(allBlogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: 'could not find all blogs for publisher',
      err: error,
    });
  }
});

app.post('/createSingleBlog', async (req, res) => {
  const blogBody = req.body;

  //   const newBlog = {
  //     title: blogBody.title,
  //     content: blogBody.content,
  //     createDateTime: Date.now(),
  //     category: blogBody.category,
  //   };

  const newBlog = { ...blogBody, createdDateTime: Date.now() };

  try {
    const createdBlog = await collection.insertOne(newBlog);
    res.status(200).json(createdBlog);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: 'could not create a blog', err: error });
  }
});

app.patch('/updateBlog/:id', (req, res) => {
  const blogId = req.params.id;
  console.log(blogId);
  try {
    const updatedBlog = collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, lastUpdated: Date.now() } }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err1: 'could not delete a blog', err: error });
  }
});

app.delete('/deleteBlog/:id', async (req, res) => {
  try {
    const deletedBlog = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json(deletedBlog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err1: 'could not delete a blog', err: error });
  }
});

const callbackFn = (err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log('Server running at port', PORT);
    });
  } else {
    console.log({ error: err });
  }
};

connectToDB(callbackFn);

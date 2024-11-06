// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// create schema
const PostSchema=new mongoose.Schema({
 course:{ type:String, required:true},
  description: { type:String, required:true}
});
// create model/collection
const Post=mongoose.model('Post', PostSchema);

// Create a new post method
app.post('/api/post', async (req, res) => {
  const newPost = new Post({
    course: req.body.course,
    description: req.body.description
  })
// Display the new post in json format (postman)
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
});

// get method (usin limit)
app.get("/api/post/:id", async (req, res) => {
  try {
    const GetPost = await Post.findById(req.params.id);
    if (GetPost) {
      res.status(200).json(GetPost);
    } else {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
    }
    
  }
  catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
})
app.get("/api/post", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const posts = limit?await Post.find().limit(limit):await Post.find();
    res.status(200).json(posts);
  }
  catch (err) {
    res.status(400).json({ message: "Something went wrong", err });
  }
})

app.put("/api/post/:id", async (req, res) => {
  try {
    const UpdatePost = await Post.findByIdAndUpdate(req.params.id, req.body,{new:true});
    if (UpdatePost) {
    
      res.status(200).json(UpdatePost);
    } else {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
})

app.delete("/api/post/:id", async (req, res) => {
  try {
    const DeletePost = await Post.findByIdAndDelete(req.params.id);
    if (DeletePost) {
      res.status(200).json(DeletePost);
    } else {
      res.status(404).json({ message: `Post with id ${req.params.id} not found` });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
})
// const movieSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
// });
// mongoose.model('Movie', movieSchema);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






const express = require("express");
const router = express.Router();
const Blogs = require("../models/blogs.model.js");
const { jwtAuthMiddleware, generateToken } = require("../jwt/jwt");

router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const newBlog = new Blogs(data);
    const response = await newBlog.save();
    console.log("Response Data Saved");

    // Generate token
    const token = generateToken({ email: response.email });
    console.log("Token:", token);

    // Send a single response
    res.status(201).json({ response: response, token: token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error Saving Data" });
  }
});

router.post("/login", async (req, res) => {
    try {
      const {email, password} = req.body;

      const user = await Blogs.findOne({email});

      if (!password || !(await user.comparePassword(password))) {
        return res.status(401).json({message:"Invalid username password"})
      }

      const payload = {
        id: user._id,
        email: user.email,
      }

      const token = generateToken(payload);

      res.json({token})

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    // Find the blog by ID
    const blog = await Blogs.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Respond with the blog details
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//GET 
router.get("/",jwtAuthMiddleware ,async (req, res) => {
  try {
    const data = await Blogs.find();
    console.log("Getting the response");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT for update
router.put("/:id", async (req, res) => {
  try {
    const BlogsId = req.params.id;
    const updatePersonData = req.body;

    const response = await Person.findByIdAndUpdate(BlogsId, updatePersonData, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({ message: "Person not found" });
    }

    console.log("Data Updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//
router.delete("/:id", async (req, res) => {
  try {
    const BlogsId = req.params.id;
    const response = await Person.findByIdAndDelete(BlogsId);

    if (!response) {
      return res.status(404).json({ message: "Person not found" });
    }
    console.log("Data Deleted");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

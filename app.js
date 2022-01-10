require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const User = require("./models/user");
const auth = require("./middleware/auth");
app.use(express.json());

app.get("/", async (req, res) => {
  res.send(`Hello from Authentication API !!`);
});

app.post("/api/v1/register", async (req, res) => {
  try {
    // Get data from body
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName);
    // Checking all fields are present
    if (!(firstName && lastName && email && password)) {
      res.status(400).send(`<h1>All Fields are Required</h1>`);
    }
    // Finding If user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send(`User Already Exists Try Login or Check Profile`);
    } else {
      // Encrypt Password with bcrypt hash
      const encPassword = await bcrypt.hash(password, 10);
      // Create user model and pass data in it
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: encPassword,
      });
      // Create Token
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "3h",
        }
      );
      // Send Success Message and ask to login
      res
        .status(201)
        .send(`<h1>User Created Succesfully :)</h1><h2>Now you can Login</h2>`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/login", async (req, res) => {
  try {
    // Get email and password from body

    const { email, password } = req.body;
    // Check if email and password are present
    if (!(email && password)) {
      res.status(400).send(`<h1>Please provide Email and Password`);
    }
    // Check if user is created
    const user = await User.findOne({ email });
    // Check user and compare password
    if (user && bcrypt.compare(password, user.password)) {
      // Create token and send to browser
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "3h",
        }
      );
      res
        .status(200)
        .send(
          `<h1>User Found</h1><h2>Your Token ${token}. <br><h1>Keep it SAFE</h1><br>`
        );
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/v1/profile", auth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userData = await User.find({ email: userEmail });
    userData.password = undefined;
    res.send(
      `<h1>You are Authenticated !! Here is your profile</h1><br>${userData}</br>`
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;

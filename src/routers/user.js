const express = require("express");
const User = require("../models/User.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

const app = express();

app.use(express.urlencoded());

var request = require("request");

router.post("/users", async (req, res) => {
  // Create a new user
  const newuser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  try {
    const user = new User(newuser);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send("success");
  } catch (error) {
    res.status(400).send("error");
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    var options = { method: 'GET',
      url: 'http://soyab-mongodb-auth.glitch.me/users/me',
        headers: 
         { Authorization: `Bearer ${token}` } };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      res.send("Hello " + body);
    });

    //res.send("You have successfully logged in");
  } catch (error) {
    res.status(400).send("error");
  }
});

router.get("/users/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user.name);
});

module.exports = router;

const app = require("express");
const router = app.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



router.post("/register", async (req, res) => {
  const body = req.body;
  if (!body.email || !body.password || !body.username) {
    res.status(400).json({ message: "You have not entered required fields" });
  }
  const checkUser = await User.findOne({ email: body.email });
  if (checkUser) {
    res.status(401).json({ message: "User with this email already exists" });
    return;
  }
  const hashPassword = await bcrypt.hash(body.password, 10);
  const CreatedUser = await User.create({
    email: body.email,
    password: hashPassword,
    username: body.username,
    role: body.role,
  });

  const token = jwt.sign(
    {
      user: {
        email:CreatedUser.email,
        username:CreatedUser.username,
        role:CreatedUser.role
      },
    },
    process.env.HASH_KEY
  );
  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const body = req.body;
  if (!body.email || !body.password) {
    res.status(400).json({ message: "You have not entered required fields" });
  }
  const findUser = await User.findOne({ email: body.email });
  if (!findUser) {
    res.status(401).json({ message: "Invalid login credentials" });
    return;
  }
  const compareUserPassword = await bcrypt.compare(body.password,findUser.password)
  if(compareUserPassword === false){
    res.status(400).json({ message: "Invalid login credentials" });
    return;
  }
  const token = jwt.sign(
    {
      user: {
        email: findUser.email,
        username: findUser.username,
        role:findUser.role
      },
    },
    process.env.HASH_KEY
  );
  res.status(201).json({ token });
});

module.exports = router;
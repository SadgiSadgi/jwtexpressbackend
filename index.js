// index.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const users = [{ username: "Admin", password: "Admin" }]; // This will hold our users in memory

// Register endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send("User registered");
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).send("User not found");

  //   const isPasswordValid = await bcrypt.compare(password, user.password);
  const isPasswordValid = user.password === password;
  if (!isPasswordValid) return res.status(401).send("Invalid password");

  const token = jwt.sign({ username: user.username }, "your_jwt_secret", {
    expiresIn: "1h",
  });

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

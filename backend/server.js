require("dotenv").config()

const Review = require("./models/Review");


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ MongoDB Connect */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));
/* fake companies */
let companies = [
  { id: 1, name: "Amazon" },
  { id: 2, name: "Google" },
];


/* GET companies */
app.get("/companies", (req, res) => {
  res.json(companies);
});

/* GET reviews */
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* POST review */
app.post("/reviews", async (req, res) => {
  try {

console.log("BODY:", req.body); 
    const review = new Review(req.body);
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
require("dotenv").config();
import express from "express";

const { PORT } = process.env;

const app = express();

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "ok :)"
  })
});

app.listen(PORT, () => {
  console.log(`App is now running on port ${PORT}`);
});

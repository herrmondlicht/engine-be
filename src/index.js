require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import appRoutes from './index.routes'

const { PORT } = process.env;

const app = express();

app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({
  extended: true
}))


//load routes
app.use("/api", appRoutes);

app.use(function errorHandler (err, req, res, next) {
  console.log(err)
  res.status(500).json({
    "status":500,
    "message":"something went wrong"
  })
})


app.listen(PORT, () => {
  console.log(`App is now running on port ${PORT}`);
});

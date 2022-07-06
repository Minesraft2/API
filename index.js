/* COMMIT TO HERKOU
git add .
git commit -m "<commit message>"
git push heroku master */

require('dotenv').config();
const express = require("express");

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT, () => console.log("Connected to DB!"))


const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });
app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
require('dotenv').config();
const express = require("express");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

//test
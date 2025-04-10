const express = require("express");
const pool = require("./database.js");

const port = 3000;
const app = express();
app.use(express.json());

app.listen(port, () => console.log(`Server is listening in port ${port}`));

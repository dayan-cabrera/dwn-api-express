const express = require("express");
require("dotenv").config();
const port = process.env.PORT;

const app = express();

// Servir contenido estatico
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("*", (req, res) => {
  res.send("404 | page not found");
});

app.listen(port);

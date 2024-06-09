const express = require("express");
const cors = require("cors");
const { decodeURI } = require("url");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        headers: ["Content-Type", "Accept"],
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.static("public")); // Servir archivos estáticos desde la carpeta "public"
  }

  routes() {
    this.app.use("/api", require("../routes/dwn.routes"));
  }

  listen() {
    this.app.listen(this.port);
  }
}

module.exports = Server;

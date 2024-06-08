const { Router } = require("express");
const { DownloadController } = require("../controllers/dwn.controller");

const router = Router();
const downloadController = new DownloadController();

router.get("/download", downloadController.download);

router.get("/proxy/:url", (req, res) => {
  const url = req.params.url;
  const proxyUrl = `https://visuales.uclv.cu/${url}`;

  axios
    .get(proxyUrl, {
      responseType: "stream",
    })
    .then((response) => {
      res.header("Content-Type", response.headers["content-type"]);
      res.header("Content-Disposition", `attachment; filename="${url}"`);
      response.data.pipe(res);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error al descargar el archivo");
    });
});

module.exports = router;

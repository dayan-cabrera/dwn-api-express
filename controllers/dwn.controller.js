const express = require("express");
const { Router, response } = express;
const { DownloadService } = require("../services/dwn.service");

class DownloadController {
  download = async (req = express.request, res = response) => {
    const { url } = req.query;
    console.log(decodeURIComponent(url));
    const dwnService = new DownloadService(decodeURIComponent(url));
    const files = await dwnService.getFiles();

    res.status(200).json({ files: files });
  };
}

module.exports = { DownloadController };

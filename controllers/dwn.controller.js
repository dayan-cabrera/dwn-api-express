const express = require("express");
const { Router, response } = express;
const { DonwloadService } = require("../services/dwn.service");

class DownloadController {
  download = async (req = express.request, res = response) => {
    const { url } = req.query;
    const dwnService = new DonwloadService(decodeURIComponent(url));
    const files = await dwnService.getFiles();

    res.status(200).json({ files: files });
  };
}

module.exports = { DownloadController };

const axios = require("axios");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");

const path = require("path");
const os = require("os");
const fs = require("fs");

class DonwloadService {
  constructor(folderUrl) {
    this.folderUrl = folderUrl;
    this.axios = axios;
  }

  async getHtml() {
    try {
      const { data: html } = await this.axios.get(`${this.folderUrl}`);
      return html;
    } catch (err) {
      throw new Error(`Failed to fetch HTML: ${err}`);
    }
  }

  getFileNameFromUrl(url) {
    let fileName = decodeURI(url).replace(/%20|%5d/g, " ");
    return fileName;
  }

  async getFiles() {
    try {
      const imagesUrl = [];
      await this.getHtml().then((res) => {
        const $ = cheerio.load(res);

        $("a[href$='.jpg']").each((index, element) => {
          const link = $(element).attr("href") || "";
          if (link) {
            imagesUrl.push({
              name: this.getFileNameFromUrl(link),
              url: `${this.folderUrl}${link}`,
            });
          }
        });
      });
      for (const file of imagesUrl) {
        await this.downloadElement(file);
      }
      return imagesUrl;
    } catch (error) {
      console.error(`Error fetching image names: ${error}`);
      return false;
    }
  }
  async downloadElement(file) {
    try {
      const response = await this.axios.get(file.url, {
        responseType: "arraybuffer",
      });

      // Obtener el directorio de descargas predeterminado
      const downloadsDir = os.homedir() + "/Downloads";

      // Crear un archivo local para la descarga
      const filePath = path.join(downloadsDir, file.name);
      fs.writeFileSync(filePath, response.data);

      console.log(`Archivo descargado correctamente: ${filePath}`);
    } catch (error) {
      console.error("Error al descargar el elemento:", error);
    }
  }
}

module.exports = { DonwloadService };

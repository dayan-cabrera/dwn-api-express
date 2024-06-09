const axios = require("axios");
const cheerio = require("cheerio");
const { saveAs } = require("file-saver");

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
      return error;
    }
  }

  async downloadElement(file) {
    try {
      const response = await this.axios.get(file.url, {
        responseType: "arraybuffer",
      });

      // Descargar el archivo directamente en el navegador
      saveAs(new Blob([response.data], { type: "image/jpeg" }), file.name);
    } catch (error) {
      console.error("Error al descargar el elemento:", error);
    }
  }
}

module.exports = { DonwloadService };

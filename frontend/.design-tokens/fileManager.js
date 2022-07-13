const fs = require("fs");

class FileManager {
  getJson(path = "") {
    try {
      return JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch (error) {
      console.error(error);
      return;
    }
  }

  write(path = "", data = "") {
    try {
      fs.writeFileSync(path, data, "utf-8");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

module.exports = new FileManager();

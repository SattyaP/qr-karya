import QRCode from "qrcode";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const outputDir = "qrcodes";

function generateByFile(files) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const workbook = xlsx.readFile(files);
  const nameOfSheets = workbook.SheetNames;

  nameOfSheets.forEach((name) => {
    const sheet = workbook.Sheets[name];
    const data = xlsx.utils.sheet_to_json(sheet);

    const categoryDir = path.join(outputDir, name);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir);
    }

    data.forEach((item) => {
      const link = item["Link Folder"].trim();
      let name = sanitizeFileName(item["Judul"].trim());

      if (name.length === 0) {
        console.error("Invalid file name after sanitization. Skipping entry.");
        return;
      }

      const filePath = path.join(categoryDir, `${name}.png`);

      const options = {
        width: 400,
        errorCorrectionLevel: "Q",
      };

      QRCode.toFile(filePath, link, options, (err) => {
        if (err) {
          console.error("Error generating QR code:", err);
        } else {
          console.log("QR code saved successfully");
        }
      });
    });
  });
}

function sanitizeFileName(fileName) {
  fileName = fileName.replace(/[()":]/g, "");
  const maxFileNameLength = 225;

  if (fileName.length > maxFileNameLength) {
    fileName = fileName.substring(0, maxFileNameLength);
  }

  return fileName.trim();
}

generateByFile("Karya Approved.xlsx");


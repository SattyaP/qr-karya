import QRCode from "qrcode";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";

const outputDir = "qrcodes";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const workbook = xlsx.readFile("Karya Approved.xlsx");
const nameOfSheets = workbook.SheetNames;

nameOfSheets.forEach((name) => {
  const sheet = workbook.Sheets[name];
  const data = xlsx.utils.sheet_to_json(sheet);

  const categoryDir = path.join(outputDir, name);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir);
  }

  data.forEach((item) => {
    const link = item["Link Foto"].trim();
    const name = item["Nama"].trim();

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
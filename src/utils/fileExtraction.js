const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const mammoth = require("mammoth");
const textract = require("textract");
const { exec } = require("child_process");

const extractDocText = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`antiword "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(stdout);
    });
  });
};


const extractTextFromFile = async (filePath, mimeType) => {
  try {
    // ---------- TEXT FILE ----------
    if (mimeType === "text/plain") {
      return fs.readFileSync(filePath, "utf8");
    }

    // ---------- PDF ----------
    if (mimeType === "application/pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }

    // ---------- IMAGE (OCR) ----------
    if (mimeType.startsWith("image/")) {
      const {
        data: { text },
      } = await Tesseract.recognize(filePath, "eng");

      return text;
    }

    // ---------- DOCX ----------
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    // ---------- DOC ----------
    if (mimeType === "application/msword") {
        const text = await extractDocText(filePath);
        return text;
    }

    return null;
  } catch (error) {
    console.error("Text extraction failed:", error);
    return null;
  }
};

module.exports = extractTextFromFile;
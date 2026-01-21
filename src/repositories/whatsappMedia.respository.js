const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const GRAPH_URL = "https://graph.facebook.com/v19.0";

const downloadWhatsAppMedia = async (mediaId, mimeType) => {
  const { v4: uuidv4 } = await import("uuid");
  // 1. Get media URL
  const metaRes = await axios.get(`${GRAPH_URL}/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  const mediaUrl = metaRes.data.url;
  if (!mediaUrl) throw new Error("Media URL not found");

  const ext = mimeType?.split("/")[1] || "bin";
  const fileName = `${uuidv4()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "uploads", "whatsapp");
  fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  const fileRes = await axios.get(mediaUrl, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    responseType: "stream",
  });

  let size = 0;

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);

    fileRes.data.on("data", (chunk) => {
      size += chunk.length; 
    });

    fileRes.data.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    fileRes.data.pipe(writeStream);
  });

  return {
    fileName,
    url: `${process.env.BASE_URL}/uploads/whatsapp/${fileName}`,
    size,       
    mimeType,
  };
};

module.exports = { downloadWhatsAppMedia };

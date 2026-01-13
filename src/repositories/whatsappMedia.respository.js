import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const GRAPH_URL = "https://graph.facebook.com/v19.0";

export const downloadWhatsAppMedia = async (mediaId, mimeType) => {
  const metaRes = await axios.get(`${GRAPH_URL}/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  const mediaUrl = metaRes.data.url;

  const ext = mimeType?.split("/")[1] || "jpg";
  const fileName = `${uuidv4()}.${ext}`;

  const uploadDir = path.join(process.cwd(), "uploads/whatsapp");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  const fileRes = await axios.get(mediaUrl, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);
    fileRes.data.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return {
    fileName,
    url: `${process.env.BASE_URL}/uploads/whatsapp/${fileName}`,
  };
};

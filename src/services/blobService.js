// const { BlobServiceClient } = require("@azure/storage-blob");
// const fs = require("fs");

// const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
// const containerName = process.env.AZURE_BLOB_CONTAINER;

// const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const uploadFile = async ({ filePath, blobName, contentType }) => {

//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   await blockBlobClient.uploadFile(filePath, {
//     blobHTTPHeaders: {
//       blobContentType: contentType
//     }
//   });

//   const blobUrl = blockBlobClient.url;

//   // remove local file
//   fs.unlinkSync(filePath);

//   return {
//     blobName,
//     blobUrl
//   };
// };

// module.exports = {
//   uploadFile
// };
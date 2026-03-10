const { decrypt, encrypt} = require("./crypto.util");

// const result = encrypt("+917736053206");
// console.log("Encrypted Text:", result);

const original = decrypt("NqAPAXGBxO4nJTY3rMKjcg==");
console.log("Decrypted Text:", original);


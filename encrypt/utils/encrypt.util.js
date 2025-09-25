
import crypto from "crypto";
import fs from "fs";

const algorithm = "aes-256-gcm";
const iterations = 100000;
const keyLength = 32;
const ivLength = 12;

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, iterations, keyLength, "sha256");
}

export function encryptFile(filePath, password) {
  try {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(ivLength);
    const key = deriveKey(password, salt);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const fileData = fs.readFileSync(filePath);

    const encryptedData = Buffer.concat([
      cipher.update(fileData),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    const output = Buffer.concat([salt, iv, authTag, encryptedData]);
    fs.writeFileSync(filePath + ".enc", output);

    console.log("File encrypted successfully");
  } catch (err) {
    console.error("Encryption failed:", err.message);
  }
}

export function decryptFile(filePath, password) {
  try {
    const fileData = fs.readFileSync(filePath);

    const salt = fileData.slice(0, 16);
    const iv = fileData.slice(16, 28);
    const authTag = fileData.slice(28, 44);
    const encryptedData = fileData.slice(44);

    const key = deriveKey(password, salt);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decryptedData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const outPath = filePath.replace(".enc", ".dec");
    fs.writeFileSync(outPath, decryptedData);

    console.log("File decrypted successfully ->", outPath);
  } catch (err) {
    console.error("Decryption failed:", err.message);
  }
}

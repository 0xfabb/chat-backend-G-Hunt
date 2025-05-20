import CryptoJS from "crypto-js";

const SECRET_KEY : string = process.env.SECRET ?? "";

export const handleUrl = async (url: string): Promise<string> => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(url, SECRET_KEY).toString();
    console.log(encodeURIComponent(ciphertext));
    return encodeURIComponent(ciphertext);
  } catch (err) {
    console.error("Error encrypting URL:", err);
    throw err;
  }
};


export const resolveUrl = (encrypted: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encrypted), SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Error decrypting URL:", err);
    throw err;
  }
};

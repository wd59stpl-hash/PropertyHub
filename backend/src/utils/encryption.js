const CryptoJS = require('crypto-js');
const SECRET_KEY = process.env.CHAT_ENCRYPTION_KEY || 'PropertyHub_Secret_Secure_Key_99';

const encrypt = (text) => {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decrypt = (cipherText) => {
    try {
        if (!cipherText) return "";
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (err) {
        return "Decryption Error";
    }
};

module.exports = { encrypt, decrypt };
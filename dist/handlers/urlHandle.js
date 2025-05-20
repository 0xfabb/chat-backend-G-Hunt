"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUrl = exports.handleUrl = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const SECRET_KEY = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "";
const handleUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ciphertext = crypto_js_1.default.AES.encrypt(url, SECRET_KEY).toString();
        console.log(encodeURIComponent(ciphertext));
        return encodeURIComponent(ciphertext);
    }
    catch (err) {
        console.error("Error encrypting URL:", err);
        throw err;
    }
});
exports.handleUrl = handleUrl;
const resolveUrl = (encrypted) => {
    try {
        const bytes = crypto_js_1.default.AES.decrypt(decodeURIComponent(encrypted), SECRET_KEY);
        return bytes.toString(crypto_js_1.default.enc.Utf8);
    }
    catch (err) {
        console.error("Error decrypting URL:", err);
        throw err;
    }
};
exports.resolveUrl = resolveUrl;

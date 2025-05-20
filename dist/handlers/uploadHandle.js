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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = handleFileUpload;
const appwrite_1 = require("appwrite");
const stream_1 = __importDefault(require("stream"));
const client = new appwrite_1.Client();
client
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject("682cd362001e4a7e2c0a");
const storage = new appwrite_1.Storage(client);
function handleFileUpload(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const separator = Buffer.from("\n\n");
            const separatorIndex = data.indexOf(separator);
            if (separatorIndex === -1) {
                throw new Error("Invalid message format: separator not found");
            }
            const metadataBuffer = data.slice(0, separatorIndex);
            const metadataString = metadataBuffer.toString("utf-8");
            const metadata = JSON.parse(metadataString);
            const fileBuffer = data.slice(separatorIndex + separator.length);
            // Convert Buffer to Readable stream
            const readableStream = new stream_1.default.Readable();
            readableStream.push(fileBuffer);
            readableStream.push(null);
            // Upload file to Appwrite bucket
            const response = yield storage.createFile("snaproom-bucket-1", "unique()", // generate unique ID for the file
            readableStream, metadata.fileType);
            console.log("File uploaded to Appwrite storage:", response);
        }
        catch (error) {
            console.error("Error in handleFileUpload:", error);
            throw error;
        }
    });
}

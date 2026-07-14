"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSplitter = exports.DocumentLoader = void 0;
const fs = __importStar(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth = __importStar(require("mammoth"));
class DocumentLoader {
    async loadPDF(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const data = await (0, pdf_parse_1.default)(fileBuffer);
            return {
                text: data.text,
                metadata: {
                    pages: data.numpages,
                    title: data.info?.Title || 'Untitled',
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to parse PDF: ${error}`);
        }
    }
    async loadDocx(filePath) {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            return {
                text: result.value,
                metadata: {
                    warnings: result.messages,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to parse DOCX: ${error}`);
        }
    }
    async loadTxt(filePath) {
        try {
            const text = fs.readFileSync(filePath, 'utf-8');
            return {
                text,
                metadata: {
                    encoding: 'utf-8',
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to read TXT file: ${error}`);
        }
    }
    async load(filePath, fileType) {
        const extension = fileType.toLowerCase();
        switch (extension) {
            case 'pdf':
                return this.loadPDF(filePath);
            case 'docx':
            case 'doc':
                return this.loadDocx(filePath);
            case 'txt':
                return this.loadTxt(filePath);
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }
    }
}
exports.DocumentLoader = DocumentLoader;
class TextSplitter {
    constructor(chunkSize = 1000, chunkOverlap = 200) {
        this.chunkSize = chunkSize;
        this.chunkOverlap = chunkOverlap;
    }
    split(text) {
        const chunks = [];
        let startIndex = 0;
        while (startIndex < text.length) {
            let endIndex = startIndex + this.chunkSize;
            if (endIndex < text.length) {
                // Find the last sentence boundary
                const lastPeriod = text.lastIndexOf('.', endIndex);
                const lastNewline = text.lastIndexOf('\n', endIndex);
                endIndex = Math.max(lastPeriod, lastNewline);
                if (endIndex <= startIndex) {
                    endIndex = startIndex + this.chunkSize;
                }
            }
            chunks.push(text.substring(startIndex, endIndex).trim());
            // Move start index with overlap
            startIndex = endIndex - this.chunkOverlap;
        }
        return chunks.filter((chunk) => chunk.length > 0);
    }
}
exports.TextSplitter = TextSplitter;
//# sourceMappingURL=documentProcessor.js.map
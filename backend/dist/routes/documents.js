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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const documentProcessor_1 = require("../services/documentProcessor");
const embeddingsService_1 = require("../services/embeddingsService");
const router = (0, express_1.Router)();
const localDocuments = [];
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, process.env.UPLOAD_DIR || './uploads');
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${(0, uuid_1.v4)()}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
    },
    fileFilter: (_req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'));
        }
    },
});
// POST /upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const documentId = (0, uuid_1.v4)();
        const fileType = req.file.mimetype.includes('pdf')
            ? 'pdf'
            : req.file.mimetype.includes('word')
                ? 'docx'
                : 'txt';
        // Load and process document
        const loader = new documentProcessor_1.DocumentLoader();
        const content = await loader.load(req.file.path, fileType);
        localDocuments.push({
            id: documentId,
            title: req.body.title || req.file.originalname,
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType,
            fileSize: req.file.size,
            content: content.text,
        });
        // Split text into chunks
        const splitter = new documentProcessor_1.TextSplitter(parseInt(process.env.CHUNK_SIZE || '1000'), parseInt(process.env.CHUNK_OVERLAP || '200'));
        const chunks = splitter.split(content.text);
        // Generate embeddings and store chunks when OpenAI is configured
        const embeddingsService = new embeddingsService_1.EmbeddingsService();
        try {
            await embeddingsService.storeChunks(documentId, chunks);
        }
        catch (embeddingError) {
            console.warn('Embedding generation skipped; continuing without embeddings.', embeddingError);
        }
        res.json({
            documentId,
            title: req.body.title || req.file.originalname,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            chunksCreated: chunks.length,
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /documents/:id
router.get('/:id', async (req, res) => {
    try {
        const localDocument = localDocuments.find((doc) => doc.id === req.params.id);
        if (!localDocument) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(localDocument);
    }
    catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /documents
router.get('/', async (req, res) => {
    try {
        const documents = localDocuments.map((doc) => ({
            id: doc.id,
            title: doc.title,
            file_name: doc.fileName,
            created_at: new Date().toISOString(),
        }));
        res.json(documents);
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=documents.js.map
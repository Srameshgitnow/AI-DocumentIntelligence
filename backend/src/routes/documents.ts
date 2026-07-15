import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DocumentLoader, TextSplitter } from '../services/documentProcessor';
import { EmbeddingsService } from '../services/embeddingsService';

const router = Router();
const localDocuments: Array<{ id: string; title: string; fileName: string; filePath: string; fileType: string; fileSize: number; content: string }> = [];

type RequestWithFile = Request & {
  file?: {
    originalname: string;
    path: string;
    size: number;
    mimetype: string;
  };
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// POST /upload
router.post('/upload', upload.single('file'), async (req: RequestWithFile, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const documentId = uuidv4();
    const fileType = req.file.mimetype.includes('pdf')
      ? 'pdf'
      : req.file.mimetype.includes('word')
        ? 'docx'
        : 'txt';

    // Load and process document
    const loader = new DocumentLoader();
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
    const splitter = new TextSplitter(
      parseInt(process.env.CHUNK_SIZE || '1000'),
      parseInt(process.env.CHUNK_OVERLAP || '200')
    );
    const chunks = splitter.split(content.text);

    // Generate embeddings and store chunks when OpenAI is configured
    const embeddingsService = new EmbeddingsService();
    try {
      await embeddingsService.storeChunks(documentId, chunks);
    } catch (embeddingError) {
      console.warn('Embedding generation skipped; continuing without embeddings.', embeddingError);
    }

    res.json({
      documentId,
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      chunksCreated: chunks.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /documents/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const localDocument = localDocuments.find((doc) => doc.id === req.params.id);

    if (!localDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(localDocument);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /documents
router.get('/', async (req: Request, res: Response) => {
  try {
    const documents = localDocuments.map((doc) => ({
      id: doc.id,
      title: doc.title,
      file_name: doc.fileName,
      created_at: new Date().toISOString(),
    }));

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

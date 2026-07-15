import { Router, Request, Response } from 'express';
import { RAGService } from '../services/ragService';

const router = Router();
const ragService = new RAGService();

// POST /chat - Ask question about a document
router.post('/', async (req: Request, res: Response) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'Missing documentId or question' });
    }

    const result = await ragService.answerQuestion(documentId, question);

    res.json({
      question,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /chat/:documentId - Get chat history
router.get('/:documentId', async (req: Request, res: Response) => {
  try {
    const history = await ragService.getChatHistory(req.params.documentId, 50);

    res.json({
      documentId: req.params.documentId,
      history,
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;

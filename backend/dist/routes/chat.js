"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ragService_1 = require("../services/ragService");
const router = (0, express_1.Router)();
const ragService = new ragService_1.RAGService();
// POST /chat - Ask question about a document
router.post('/', async (req, res) => {
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
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message });
    }
});
// GET /chat/:documentId - Get chat history
router.get('/:documentId', async (req, res) => {
    try {
        const history = await ragService.getChatHistory(req.params.documentId, 50);
        res.json({
            documentId: req.params.documentId,
            history,
        });
    }
    catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map
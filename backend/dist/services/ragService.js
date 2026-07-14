"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGService = void 0;
const openai_1 = require("@langchain/openai");
const anthropic_1 = require("@langchain/anthropic");
const prompts_1 = require("@langchain/core/prompts");
const embeddingsService_1 = require("./embeddingsService");
const connection_1 = require("../db/connection");
const uuid_1 = require("uuid");
class RAGService {
    constructor() {
        this.llm = null;
        this.embeddingsService = new embeddingsService_1.EmbeddingsService();
    }
    getLLM() {
        if (!this.llm) {
            const provider = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
            if (provider === 'anthropic') {
                if (!process.env.ANTHROPIC_API_KEY) {
                    throw new Error('ANTHROPIC_API_KEY is not configured');
                }
                this.llm = new anthropic_1.ChatAnthropic({
                    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
                    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest',
                    temperature: 0.7,
                });
            }
            else {
                if (!process.env.OPENAI_API_KEY) {
                    throw new Error('OPENAI_API_KEY is not configured');
                }
                this.llm = new openai_1.ChatOpenAI({
                    openAIApiKey: process.env.OPENAI_API_KEY,
                    modelName: 'gpt-4-turbo-preview',
                    temperature: 0.7,
                });
            }
        }
        return this.llm;
    }
    async answerQuestion(documentId, userQuestion) {
        try {
            // Retrieve relevant chunks
            const relevantChunks = await this.embeddingsService.retrieveRelevantChunks(documentId, userQuestion, 5);
            if (relevantChunks.length === 0) {
                return {
                    answer: "I couldn't find relevant information in the document to answer your question.",
                    sources: [],
                };
            }
            // Build context from retrieved chunks
            const context = relevantChunks
                .map((chunk, index) => `[Source ${index + 1}]\n${chunk.content}`)
                .join('\n\n');
            // Create prompt
            const template = `You are a helpful assistant answering questions about a document. 
Use the provided context to answer the user's question accurately.

Context:
{context}

Question: {question}

Answer:`;
            const prompt = prompts_1.PromptTemplate.fromTemplate(template);
            const llm = this.getLLM();
            const chain = prompt.pipe(llm);
            const result = await chain.invoke({
                context,
                question: userQuestion,
            });
            const response = result;
            const answer = typeof response?.content === 'string'
                ? response.content
                : Array.isArray(response?.content)
                    ? response.content
                        .map((item) => {
                        if (typeof item === 'string') {
                            return item;
                        }
                        if (typeof item === 'object' && 'text' in item && typeof item.text === 'string') {
                            return item.text;
                        }
                        return '';
                    })
                        .filter(Boolean)
                        .join('') || 'No answer generated'
                    : 'No answer generated';
            const sources = relevantChunks.map((chunk) => chunk.id);
            // Store in chat history
            await (0, connection_1.query)(`INSERT INTO chat_history 
         (id, document_id, user_question, ai_response, sources) 
         VALUES ($1, $2, $3, $4, $5)`, [
                (0, uuid_1.v4)(),
                documentId,
                userQuestion,
                answer,
                JSON.stringify(sources),
            ]);
            return { answer, sources };
        }
        catch (error) {
            throw new Error(`Failed to answer question: ${error}`);
        }
    }
    async getChatHistory(documentId, limit = 50) {
        try {
            const result = await (0, connection_1.query)(`SELECT id, user_question, ai_response, sources, created_at
         FROM chat_history
         WHERE document_id = $1
         ORDER BY created_at DESC
         LIMIT $2`, [documentId, limit]);
            return result.rows;
        }
        catch (error) {
            throw new Error(`Failed to retrieve chat history: ${error}`);
        }
    }
}
exports.RAGService = RAGService;
//# sourceMappingURL=ragService.js.map
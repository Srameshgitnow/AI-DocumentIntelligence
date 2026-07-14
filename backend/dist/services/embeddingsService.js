"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingsService = void 0;
const openai_1 = require("@langchain/openai");
const connection_1 = require("../db/connection");
const uuid_1 = require("uuid");
class EmbeddingsService {
    constructor() {
        this.embeddings = null;
    }
    getEmbeddings() {
        if (!this.embeddings) {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY is not configured');
            }
            this.embeddings = new openai_1.OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
                modelName: 'text-embedding-3-small',
            });
        }
        return this.embeddings;
    }
    async generateEmbeddings(text) {
        try {
            const result = await this.getEmbeddings().embedQuery(text);
            return result;
        }
        catch (error) {
            throw new Error(`Failed to generate embeddings: ${error}`);
        }
    }
    async storeChunks(documentId, chunks) {
        const chunkIds = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunkId = (0, uuid_1.v4)();
            const embedding = await this.generateEmbeddings(chunks[i]);
            try {
                await (0, connection_1.query)(`INSERT INTO document_chunks 
           (id, document_id, chunk_index, content, embedding, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6)`, [
                    chunkId,
                    documentId,
                    i,
                    chunks[i],
                    JSON.stringify(embedding),
                    JSON.stringify({ chunk_size: chunks[i].length }),
                ]);
                chunkIds.push(chunkId);
            }
            catch (error) {
                console.error(`Failed to store chunk ${i}:`, error);
            }
        }
        return chunkIds;
    }
    async retrieveRelevantChunks(documentId, query_text, topK = 5) {
        try {
            const queryEmbedding = await this.generateEmbeddings(query_text);
            const result = await (0, connection_1.query)(`SELECT id, content, 
                1 - (embedding <=> $1::vector) as similarity
         FROM document_chunks
         WHERE document_id = $2
         ORDER BY embedding <=> $1::vector
         LIMIT $3`, [JSON.stringify(queryEmbedding), documentId, topK]);
            return result.rows.map((row) => ({
                id: row.id,
                content: row.content,
                score: row.similarity,
            }));
        }
        catch (error) {
            throw new Error(`Failed to retrieve chunks: ${error}`);
        }
    }
}
exports.EmbeddingsService = EmbeddingsService;
//# sourceMappingURL=embeddingsService.js.map
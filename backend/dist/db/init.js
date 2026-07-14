"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const connection_1 = require("./connection");
const initializeDatabase = async () => {
    try {
        // Create pgvector extension
        await (0, connection_1.query)('CREATE EXTENSION IF NOT EXISTS vector;');
        // Create documents table
        await (0, connection_1.query)(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        file_type VARCHAR(50),
        file_size BIGINT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255)
      );
    `);
        // Create document_chunks table
        await (0, connection_1.query)(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1536),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_chunk UNIQUE(document_id, chunk_index)
      );
    `);
        // Create chat_history table
        await (0, connection_1.query)(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        user_question TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        sources JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // Create indexes
        await (0, connection_1.query)(`
      CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
      CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
      CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_chat_history_document_id ON chat_history(document_id);
    `);
        console.log('✓ Database initialized successfully');
    }
    catch (error) {
        console.warn('Database initialization skipped; continuing without a database connection:', error);
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=init.js.map
import { OpenAIEmbeddings } from '@langchain/openai';
import { query } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export class EmbeddingsService {
  private embeddings: OpenAIEmbeddings | null = null;

  private getEmbeddings(): OpenAIEmbeddings {
    if (!this.embeddings) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not configured');
      }

      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: 'text-embedding-3-small',
      });
    }

    return this.embeddings;
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const result = await this.getEmbeddings().embedQuery(text);
      return result;
    } catch (error) {
      throw new Error(`Failed to generate embeddings: ${error}`);
    }
  }

  async storeChunks(
    documentId: string,
    chunks: string[]
  ): Promise<string[]> {
    const chunkIds: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = uuidv4();
      const embedding = await this.generateEmbeddings(chunks[i]);

      try {
        await query(
          `INSERT INTO document_chunks 
           (id, document_id, chunk_index, content, embedding, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            chunkId,
            documentId,
            i,
            chunks[i],
            JSON.stringify(embedding),
            JSON.stringify({ chunk_size: chunks[i].length }),
          ]
        );

        chunkIds.push(chunkId);
      } catch (error) {
        console.error(`Failed to store chunk ${i}:`, error);
      }
    }

    return chunkIds;
  }

  async retrieveRelevantChunks(
    documentId: string,
    query_text: string,
    topK: number = 5
  ): Promise<Array<{ id: string; content: string; score: number }>> {
    try {
      const queryEmbedding = await this.generateEmbeddings(query_text);

      const result = await query(
        `SELECT id, content, 
                1 - (embedding <=> $1::vector) as similarity
         FROM document_chunks
         WHERE document_id = $2
         ORDER BY embedding <=> $1::vector
         LIMIT $3`,
        [JSON.stringify(queryEmbedding), documentId, topK]
      );

      return result.rows.map((row: any) => ({
        id: row.id,
        content: row.content,
        score: row.similarity,
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve chunks: ${error}`);
    }
  }
}

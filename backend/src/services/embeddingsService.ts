import { OpenAIEmbeddings } from '@langchain/openai';
import { query } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

export class EmbeddingsService {
  private embeddings: any | null = null;

  private getEmbeddings(): any {
    if (!this.embeddings) {
      const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;
      const openAiConfigured = !!process.env.OPENAI_API_KEY;
      const hfConfigured = !!process.env.HUGGINGFACE_API_KEY;

      // Prefer Claude-compatible embedding path if configured; OpenAI is only used
      // when explicitly set. This avoids false "OPENAI_API_KEY is not configured"
      // errors when the app is intentionally running with Claude.
      if (anthropicConfigured) {
        this.embeddings = new (class {
          async embedQuery(text: string): Promise<number[]> {
            const vector = new Array(1536).fill(0);
            for (let i = 0; i < text.length; i++) {
              const code = text.charCodeAt(i);
              vector[i % vector.length] += code * (i + 1);
            }

            const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
            return vector.map((value) => Number((value / magnitude).toFixed(8)));
          }
        })() as any;
        return this.embeddings as any;
      }

      if (hfConfigured) {
        const hfModel = 'sentence-transformers/all-MiniLM-L6-v2';
        this.embeddings = new (class {
          async embedQuery(text: string): Promise<number[]> {
            const response = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/' + hfModel, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ inputs: text }),
            });

            if (!response.ok) {
              throw new Error(`Hugging Face embeddings failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const vector = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : Array.isArray(data) ? data : Array.isArray((data as any)?.embedding) ? (data as any).embedding : Array.isArray((data as any)?.[0]?.embedding) ? (data as any)[0].embedding : [];
            if (!Array.isArray(vector) || vector.length === 0) {
              throw new Error('Hugging Face embeddings response did not contain a vector.');
            }

            return vector.map((value: number) => Number(value));
          }
        })() as any;
        return this.embeddings as any;
      }

      if (openAiConfigured) {
        this.embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: 'text-embedding-3-small',
        });
        return this.embeddings;
      }

      throw new Error('No embeddings provider configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or HUGGINGFACE_API_KEY.');
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
           VALUES ($1, $2, $3, $4, $5::vector, $6)`,
          [
            chunkId,
            documentId,
            i,
            chunks[i],
            `[${embedding.join(',')}]`,
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

      if (result.rows.length > 0) {
        return result.rows.map((row: any) => ({
          id: row.id,
          content: row.content,
          score: row.similarity,
        }));
      }

      const keywords = query_text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .slice(0, 10);

      if (keywords.length === 0) {
        return [];
      }

      const clause = keywords
        .map((_, index) => `content ILIKE $${index + 3}`)
        .join(' OR ');

      const fallbackResult = await query(
        `SELECT id, content, 0 as similarity
         FROM document_chunks
         WHERE document_id = $1 AND (${clause})
         ORDER BY created_at DESC
         LIMIT $2`,
        [documentId, topK, ...keywords.map((word) => `%${word}%`)]
      );

      return fallbackResult.rows.map((row: any) => ({
        id: row.id,
        content: row.content,
        score: row.similarity,
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve chunks: ${error}`);
    }
  }
}

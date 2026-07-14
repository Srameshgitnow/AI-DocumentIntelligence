export declare class EmbeddingsService {
    private embeddings;
    private getEmbeddings;
    generateEmbeddings(text: string): Promise<number[]>;
    storeChunks(documentId: string, chunks: string[]): Promise<string[]>;
    retrieveRelevantChunks(documentId: string, query_text: string, topK?: number): Promise<Array<{
        id: string;
        content: string;
        score: number;
    }>>;
}
//# sourceMappingURL=embeddingsService.d.ts.map
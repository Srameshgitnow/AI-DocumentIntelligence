export declare class RAGService {
    private llm;
    private embeddingsService;
    constructor();
    private getLLM;
    answerQuestion(documentId: string, userQuestion: string): Promise<{
        answer: string;
        sources: string[];
    }>;
    getChatHistory(documentId: string, limit?: number): Promise<Array<any>>;
}
//# sourceMappingURL=ragService.d.ts.map
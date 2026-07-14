interface DocumentContent {
    text: string;
    metadata: Record<string, any>;
}
export declare class DocumentLoader {
    loadPDF(filePath: string): Promise<DocumentContent>;
    loadDocx(filePath: string): Promise<DocumentContent>;
    loadTxt(filePath: string): Promise<DocumentContent>;
    load(filePath: string, fileType: string): Promise<DocumentContent>;
}
export declare class TextSplitter {
    private chunkSize;
    private chunkOverlap;
    constructor(chunkSize?: number, chunkOverlap?: number);
    split(text: string): string[];
}
export {};
//# sourceMappingURL=documentProcessor.d.ts.map
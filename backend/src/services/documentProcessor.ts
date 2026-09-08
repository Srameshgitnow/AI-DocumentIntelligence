import * as fs from 'fs';
import pdf from 'pdf-parse';
import * as mammoth from 'mammoth';

interface DocumentContent {
  text: string;
  metadata: Record<string, any>;
}

export class DocumentLoader {
  async loadPDF(filePath: string): Promise<DocumentContent> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const data = await pdf(fileBuffer);

      return {
        text: data.text,
        metadata: {
          pages: data.numpages,
          title: data.info?.Title || 'Untitled',
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error}`);
    }
  }

  async loadDocx(filePath: string): Promise<DocumentContent> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: fileBuffer });

      return {
        text: result.value,
        metadata: {
          warnings: result.messages,
        },
      };
    } catch (error) {
      throw new Error(`Failed to parse DOCX: ${error}`);
    }
  }

  async loadTxt(filePath: string): Promise<DocumentContent> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      let text = fileBuffer.toString('utf-8');

      if (fileBuffer.length >= 2 && fileBuffer[0] === 0xff && fileBuffer[1] === 0xfe) {
        text = fileBuffer.toString('utf16le');
      } else if (fileBuffer.length >= 2 && fileBuffer[0] === 0xfe && fileBuffer[1] === 0xff) {
        const swapped = Buffer.alloc(fileBuffer.length);
        for (let i = 0; i < fileBuffer.length; i += 2) {
          if (i + 1 < fileBuffer.length) {
            swapped[i] = fileBuffer[i + 1];
            swapped[i + 1] = fileBuffer[i];
          }
        }
        text = swapped.toString('utf16le');
      } else if (fileBuffer.includes(0)) {
        const sample = fileBuffer.slice(0, Math.min(fileBuffer.length, 64));
        const nullCount = sample.reduce((count, byte) => count + (byte === 0 ? 1 : 0), 0);
        if (nullCount > sample.length * 0.2) {
          text = fileBuffer.toString('utf16le');
        }
      }

      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      return {
        text,
        metadata: {
          encoding: fileBuffer.includes(0) ? 'utf-16' : 'utf-8',
        },
      };
    } catch (error) {
      throw new Error(`Failed to read TXT file: ${error}`);
    }
  }

  async load(filePath: string, fileType: string): Promise<DocumentContent> {
    const extension = fileType.toLowerCase();

    switch (extension) {
      case 'pdf':
        return this.loadPDF(filePath);
      case 'docx':
      case 'doc':
        return this.loadDocx(filePath);
      case 'txt':
        return this.loadTxt(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  }
}

export class TextSplitter {
  private chunkSize: number;
  private chunkOverlap: number;

  constructor(chunkSize: number = 1000, chunkOverlap: number = 200) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  split(text: string): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + this.chunkSize;

      if (endIndex < text.length) {
        // Find the last sentence boundary
        const lastPeriod = text.lastIndexOf('.', endIndex);
        const lastNewline = text.lastIndexOf('\n', endIndex);
        endIndex = Math.max(lastPeriod, lastNewline);

        if (endIndex <= startIndex) {
          endIndex = startIndex + this.chunkSize;
        }
      }

      chunks.push(text.substring(startIndex, endIndex).trim());

      // Move start index with overlap
      startIndex = endIndex - this.chunkOverlap;
    }

    return chunks.filter((chunk) => chunk.length > 0);
  }
}

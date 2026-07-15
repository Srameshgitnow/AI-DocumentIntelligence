import React from 'react';

// Types for API responses
export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

export interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface UploadResponse {
  documentId: string;
  title: string;
  fileName: string;
  fileSize: number;
  chunksCreated: number;
}

export interface ChatResponse {
  question: string;
  answer: string;
  sources: string[];
}

import axios from 'axios';
import { UploadResponse, ChatResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const documentService = {
  upload: (file: File, title?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    return api.post<UploadResponse>('/documents/upload', formData);
  },

  list: () => {
    return api.get('/documents');
  },

  get: (id: string) => {
    return api.get(`/documents/${id}`);
  },
};

export const chatService = {
  ask: (documentId: string, question: string) => {
    return api.post<ChatResponse>('/chat', { documentId, question });
  },

  history: (documentId: string) => {
    return api.get(`/chat/${documentId}`);
  },
};

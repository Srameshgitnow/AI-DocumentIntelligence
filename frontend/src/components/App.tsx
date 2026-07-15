import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ChatInterface } from './ChatInterface';
import '../styles/App.css';

export const App: React.FC = () => {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');

  const handleUploadSuccess = (id: string, title: string) => {
    setDocumentId(id);
    setDocumentTitle(title);
  };

  const handleStartOver = () => {
    setDocumentId(null);
    setDocumentTitle('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🔍 AI Document Intelligence</h1>
          <p>Upload documents and ask AI questions about them</p>
        </div>
      </header>

      <main className="app-main">
        {!documentId ? (
          <div className="upload-section">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        ) : (
          <div className="chat-section">
            <button className="back-button" onClick={handleStartOver}>
              ← Upload Different Document
            </button>
            <ChatInterface documentId={documentId} documentTitle={documentTitle} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 AI Document Intelligence Platform | Powered by LangChain + React</p>
      </footer>
    </div>
  );
};

export default App;

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface FileUploadProps {
  onUploadSuccess: (documentId: string, title: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError('Only PDF, DOCX, and TXT files are supported');
        return;
      }

      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);

      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        const response = await axios.post(`${API_URL}/documents/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          },
        });

        onUploadSuccess(response.data.documentId, response.data.title);
        setProgress(0);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Upload failed');
      } finally {
        setLoading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <div className="file-upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <div className="upload-icon">📄</div>
          <h3>Upload Document</h3>
          <p>Drag and drop your file here, or click to select</p>
          <p className="file-types">Supported: PDF, DOCX, DOC, TXT</p>
        </div>
      </div>

      {loading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}% uploaded</p>
        </div>
      )}

      {error && <div className="error-message">❌ {error}</div>}
    </div>
  );
};

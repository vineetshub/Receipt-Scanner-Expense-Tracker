import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadReceipt } from '../services/api';
import { ReceiptData } from '../types';

interface ReceiptUploadProps {
  onReceiptUploaded: (receipt: ReceiptData) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onReceiptUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadStatus('idle');

    try {
      const result = await uploadReceipt(file);
      
      if (result.success && result.data) {
        setUploadStatus('success');
        setStatusMessage('Receipt uploaded and processed successfully!');
        onReceiptUploaded(result.data);
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setStatusMessage('');
        }, 3000);
      } else {
        setUploadStatus('error');
        setStatusMessage(result.error || 'Failed to process receipt');
      }
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  }, [onReceiptUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="card">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Upload Receipt
        </h2>
        <p className="text-gray-600 mb-6">
          Take a photo or upload a receipt to automatically extract expense details
        </p>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="text-gray-600">Processing receipt...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the receipt here' : 'Drag & drop a receipt here'}
                </p>
                <p className="text-gray-500 mt-1">or click to browse</p>
                <p className="text-sm text-gray-400 mt-2">
                  Supports JPG, PNG, and PDF files
                </p>
              </div>
            </div>
          )}
        </div>

        {uploadStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg flex items-center space-x-3 ${
            uploadStatus === 'success' 
              ? 'bg-success-50 text-success-800 border border-success-200'
              : 'bg-danger-50 text-danger-800 border border-danger-200'
          }`}>
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 text-success-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-danger-600" />
            )}
            <span className="font-medium">{statusMessage}</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>OCR Text Extraction</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>AI-Powered Parsing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Automatic Categorization</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload; 
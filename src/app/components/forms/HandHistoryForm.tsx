import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface HandHistoryFormProps {
  onClose: () => void;
}

interface ParsedHand {
  handNumber: string;
  stakes: string;
  players: number;
  heroPosition: string;
  result: number;
}

export default function HandHistoryForm({ onClose }: HandHistoryFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseStatus, setParseStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [parsedData, setParsedData] = useState<ParsedHand[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = '.txt, .log, .xml, .csv';

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setParseStatus('idle');
    setParsedData(null);
    setErrorMessage('');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const parseHandHistory = async (fileContent: string): Promise<ParsedHand[]> => {
    // Simulate parsing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock parsing logic - in reality, this would parse actual poker hand history formats
    // This is a simplified example that would need to be replaced with actual parser
    const lines = fileContent.split('\n');
    const hands: ParsedHand[] = [];

    // Mock data for demonstration
    for (let i = 0; i < 5; i++) {
      hands.push({
        handNumber: `#${1000000 + i}`,
        stakes: '$1/$2',
        players: Math.floor(Math.random() * 3) + 6,
        heroPosition: ['BTN', 'CO', 'MP', 'BB', 'SB'][Math.floor(Math.random() * 5)],
        result: (Math.random() - 0.5) * 200
      });
    }

    return hands;
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setParseStatus('idle');
    setErrorMessage('');

    try {
      const content = await file.text();
      
      // Validate file content
      if (content.trim().length === 0) {
        throw new Error('File is empty');
      }

      const parsed = await parseHandHistory(content);
      
      if (parsed.length === 0) {
        throw new Error('No valid hands found in file');
      }

      setParsedData(parsed);
      setParseStatus('success');
    } catch (error) {
      setParseStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse hand history');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add API integration to save parsed hands
    console.log('Uploading hand history:', { file: file?.name, parsedData });
    onClose();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Icon and Description */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Upload className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Upload Hand History</h3>
          <p className="text-xs text-gray-500">Import and parse poker hand history files</p>
        </div>
      </div>

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hand History File <span className="text-red-500">*</span>
        </label>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragOver ? 'border-gray-400 bg-gray-50' : 'border-gray-300 bg-white'}
            ${file ? 'border-gray-400' : ''}
            hover:border-gray-400 hover:bg-gray-50
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileSelect(selectedFile);
            }}
            className="hidden"
          />

          {!file ? (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop your hand history file here
              </p>
              <p className="text-xs text-gray-500 mb-2">or click to browse</p>
              <p className="text-xs text-gray-400">
                Supported formats: {acceptedFormats}
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <File className="w-8 h-8 text-gray-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setParsedData(null);
                  setParseStatus('idle');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="ml-auto p-1 hover:bg-gray-200 rounded"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Process Button */}
      {file && parseStatus === 'idle' && (
        <button
          type="button"
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Parse Hand History'}
        </button>
      )}

      {/* Parse Status */}
      {parseStatus === 'success' && parsedData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-900">Successfully Parsed</p>
              <p className="text-xs text-green-700">Found {parsedData.length} hands</p>
            </div>
          </div>
          
          {/* Preview of parsed hands */}
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-gray-700">Preview:</p>
            <div className="bg-white border border-green-200 rounded p-3 max-h-40 overflow-y-auto space-y-2">
              {parsedData.slice(0, 3).map((hand, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                  <span className="font-mono text-gray-600">{hand.handNumber}</span>
                  <span className="text-gray-500">{hand.stakes}</span>
                  <span className="text-gray-500">{hand.players}p</span>
                  <span className="text-gray-500">{hand.heroPosition}</span>
                  <span className={hand.result >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {hand.result >= 0 ? '+' : ''}{hand.result.toFixed(2)}
                  </span>
                </div>
              ))}
              {parsedData.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-1">
                  and {parsedData.length - 3} more hands...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {parseStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-900">Parsing Failed</p>
              <p className="text-xs text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Supported Formats Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Supported Poker Sites:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• PokerStars (.txt)</li>
          <li>• 888poker (.log)</li>
          <li>• PartyPoker (.txt)</li>
          <li>• GGPoker (.txt)</li>
          <li>• Custom formats (.csv, .xml)</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={parseStatus !== 'success'}
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload to Database
        </button>
      </div>
    </form>
  );
}

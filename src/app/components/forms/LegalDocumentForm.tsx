import { useState } from 'react';
import { CreditCard, Upload, Image as ImageIcon } from 'lucide-react';

export interface LegalDocument {
  id: string;
  title: string;
  type: 'ID Front' | 'ID Back' | 'Passport' | 'Drivers License' | 'Other';
  fileUrl: string;
  uploadedAt: Date;
  fileSize: string;
  status: 'active' | 'expired' | 'pending';
  notes?: string;
}

interface LegalDocumentFormProps {
  onClose: () => void;
  onSubmit: (document: Omit<LegalDocument, 'id' | 'uploadedAt'>) => void;
  editDocument?: LegalDocument | null;
}

export default function LegalDocumentForm({ onClose, onSubmit, editDocument }: LegalDocumentFormProps) {
  const [title, setTitle] = useState(editDocument?.title || '');
  const [type, setType] = useState<LegalDocument['type']>(editDocument?.type || 'ID Front');
  const [fileUrl, setFileUrl] = useState(editDocument?.fileUrl || '');
  const [fileSize, setFileSize] = useState(editDocument?.fileSize || '');
  const [status, setStatus] = useState<LegalDocument['status']>(editDocument?.status || 'active');
  const [notes, setNotes] = useState(editDocument?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const documentData: Omit<LegalDocument, 'id' | 'uploadedAt'> = {
      title,
      type,
      fileUrl,
      fileSize,
      status,
      notes: notes.trim() || undefined
    };

    console.log('Legal document data:', documentData);
    onSubmit(documentData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Name *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., National ID - Marcus Chen"
            required
          />
        </div>

        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LegalDocument['type'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="ID Front">ID Front</option>
            <option value="ID Back">ID Back</option>
            <option value="Passport">Passport</option>
            <option value="Drivers License">Drivers License</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image *
          </label>
          
          {/* Image Preview */}
          {fileUrl && (
            <div className="mb-3 relative group">
              <img 
                src={fileUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFileUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* URL Input */}
          <div className="relative">
            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the URL to your ID/Passport image (JPG, PNG, or JPEG)
          </p>
        </div>

        {/* File Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Size
          </label>
          <input
            type="text"
            value={fileSize}
            onChange={(e) => setFileSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 1.2 MB"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LegalDocument['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Additional notes or comments..."
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {editDocument ? 'Update Document' : 'Add Document'}
          </button>
        </div>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { FileText, Eye, Download, Trash2, Edit, X, ExternalLink } from 'lucide-react';
import { LegalDocument } from './forms/LegalDocumentForm';

interface LegalDocumentsContentProps {
  documents: LegalDocument[];
  onAddDocument: () => void;
  onEditDocument: (document: LegalDocument) => void;
  onDeleteDocument: (documentId: string) => void;
}

export function LegalDocumentsContent({
  documents,
  onAddDocument,
  onEditDocument,
  onDeleteDocument
}: LegalDocumentsContentProps) {
  const [previewDocument, setPreviewDocument] = useState<LegalDocument | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: LegalDocument['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: LegalDocument['type']) => {
    return <FileText className="w-4 h-4" />;
  };

  return (
    <>
      {/* Image Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-[90%] h-[90%] max-w-6xl flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    {previewDocument.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {previewDocument.type} • {previewDocument.fileSize}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDocument.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href={previewDocument.fileUrl}
                  download
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </a>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div className="flex-1 overflow-hidden bg-gray-900 flex items-center justify-center p-4">
              <img
                src={previewDocument.fileUrl}
                alt={previewDocument.title}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Documents</h3>
          <button
            onClick={onAddDocument}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg 
                       hover:bg-gray-800 transition-colors font-medium text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            Add Document
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Document
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Size
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Uploaded
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Notes
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No documents yet</p>
                  <p className="text-xs text-gray-400 mt-1">Add your first legal document to get started</p>
                </td>
              </tr>
            ) : (
              documents.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                  {/* Document Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center">
                        {getTypeIcon(document.type)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{document.title}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700">
                      {document.type}
                    </span>
                  </td>

                  {/* File Size */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{document.fileSize}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(document.status)}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </span>
                  </td>

                  {/* Uploaded Date */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">{formatDate(document.uploadedAt)}</span>
                  </td>

                  {/* Notes */}
                  <td className="px-4 py-3">
                    {document.notes ? (
                      <span className="text-xs text-gray-500 line-clamp-1" title={document.notes}>
                        {document.notes}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setPreviewDocument(document)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors group"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                      </button>
                      <a
                        href={document.fileUrl}
                        download
                        className="p-1.5 hover:bg-green-50 rounded transition-colors group"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      </a>
                      <button
                        onClick={() => onEditDocument(document)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this document?')) {
                            onDeleteDocument(document.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

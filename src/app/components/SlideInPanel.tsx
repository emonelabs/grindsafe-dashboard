import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideInPanel({ 
  isOpen, 
  onClose, 
  title, 
  children
}: SlideInPanelProps) {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={onClose}
        style={{ animationDuration: '200ms' }}
      />

      {/* Slide-in Panel */}
      <div
        className="fixed right-0 top-0 h-full w-[800px] bg-white shadow-2xl border-l border-gray-200 z-50 animate-slideInRight flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}

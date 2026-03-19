import { useState, useEffect, useRef } from 'react';
import { User, Upload, X, Image as ImageIcon } from 'lucide-react';

interface PlayerEditFormProps {
  onClose: () => void;
  onSubmit: (player: PlayerFormData) => void;
  editPlayer: PlayerData | null;
}

export interface PlayerData {
  id: string;
  name: string;
  avatar: string;
  status: 'LIVE' | 'IN GAME' | 'Offline';
}

export interface PlayerFormData {
  name: string;
  avatar: string;
  status: 'LIVE' | 'IN GAME' | 'Offline';
}

export default function PlayerEditForm({ onClose, onSubmit, editPlayer }: PlayerEditFormProps) {
  const [name, setName] = useState(editPlayer?.name || '');
  const [avatar, setAvatar] = useState(editPlayer?.avatar || '');
  const [status, setStatus] = useState<'LIVE' | 'IN GAME' | 'Offline'>(editPlayer?.status || 'Offline');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editPlayer) {
      setName(editPlayer.name);
      setAvatar(editPlayer.avatar);
      setStatus(editPlayer.status);
    }
  }, [editPlayer]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      avatar,
      status
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {editPlayer ? 'Edit Player' : 'Add Player'}
          </h3>
          <p className="text-xs text-gray-500">
            {editPlayer ? 'Update player information' : 'Add new player information'}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors"
          placeholder="Enter player name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar <span className="text-red-500">*</span>
        </label>
        
        {avatar ? (
          <div className="relative w-32 h-32 mx-auto">
            <img 
              src={avatar} 
              alt="Avatar preview" 
              className="w-full h-full object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDragging ? 'bg-gray-200' : 'bg-gray-100'
              }`}>
                {isDragging ? (
                  <Upload className="w-6 h-6 text-gray-600" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'LIVE' | 'IN GAME' | 'Offline')}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                     outline-none transition-colors bg-white"
        >
          <option value="LIVE">LIVE</option>
          <option value="IN GAME">IN GAME</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 
                     rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg 
                     hover:bg-gray-800 transition-colors font-medium text-sm"
        >
          {editPlayer ? 'Save Changes' : 'Add Player'}
        </button>
      </div>
    </form>
  );
}
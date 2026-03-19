import { useState, useEffect } from 'react';
import { User, Building2, Briefcase, Mail, Phone, Calendar } from 'lucide-react';

interface MemberEditFormProps {
  onClose: () => void;
  onSubmit: (member: MemberFormData) => void;
  editMember: MemberData | null;
}

export interface MemberData {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: Date;
}

export interface MemberFormData {
  name: string;
  avatar: string;
  role: string;
  department: string;
  email: string;
  phone: string;
}

export default function MemberEditForm({ onClose, onSubmit, editMember }: MemberEditFormProps) {
  const [name, setName] = useState(editMember?.name || '');
  const [avatar, setAvatar] = useState(editMember?.avatar || '');
  const [role, setRole] = useState(editMember?.role || '');
  const [department, setDepartment] = useState(editMember?.department || '');
  const [email, setEmail] = useState(editMember?.email || '');
  const [phone, setPhone] = useState(editMember?.phone || '');

  useEffect(() => {
    if (editMember) {
      setName(editMember.name);
      setAvatar(editMember.avatar);
      setRole(editMember.role);
      setDepartment(editMember.department);
      setEmail(editMember.email);
      setPhone(editMember.phone);
    }
  }, [editMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      avatar,
      role,
      department,
      email,
      phone
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
            {editMember ? 'Edit Member' : 'Add Member'}
          </h3>
          <p className="text-xs text-gray-500">
            {editMember ? 'Update member information' : 'Add new member information'}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                       outline-none transition-colors"
            placeholder="Enter full name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
          Avatar URL <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              id="avatar"
              type="url"
              required
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                         outline-none transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          {avatar && (
            <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
              <img 
                src={avatar} 
                alt="Avatar preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=ERR';
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="role"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                         outline-none transition-colors"
              placeholder="e.g. CEO"
            />
          </div>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="department"
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                         outline-none transition-colors"
              placeholder="e.g. Executive"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                       outline-none transition-colors"
            placeholder="email@company.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-gray-400 focus:border-gray-400 
                       outline-none transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>
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
          {editMember ? 'Save Changes' : 'Add Member'}
        </button>
      </div>
    </form>
  );
}
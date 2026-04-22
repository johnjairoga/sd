'use client';

import { Lead, LeadStatus } from '@/types/lead';
import { useState } from 'react';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: Partial<Lead>) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'proposal_sent', 'closed_won', 'lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Other'];

export default function LeadForm({ initialData, onSubmit, isLoading }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    source: initialData?.source || '',
    status: initialData?.status || 'new',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Lead name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
          placeholder="Phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Source</label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
        >
          <option value="">Select source</option>
          {SOURCE_OPTIONS.map(src => (
            <option key={src} value={src}>{src}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Saving...' : 'Save Lead'}
      </button>
    </form>
  );
}

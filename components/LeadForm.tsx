'use client';

import { Lead, LeadStatus, Seller } from '@/types/lead';
import { useState } from 'react';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: Partial<Lead>) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'proposal_sent', 'closed_won', 'lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Other'];
const SELLER_OPTIONS: Seller[] = ['Seller_1', 'Seller_2', 'Seller_3'];

export default function LeadForm({ initialData, onSubmit, isLoading }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    source: initialData?.source || '',
    status: initialData?.status || 'new',
    seller: initialData?.seller || '',
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
        <label className="block text-sm font-medium text-gray-300">Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Lead name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Phone number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Source</label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" className="bg-[#1c1c1c] text-white">Select source</option>
          {SOURCE_OPTIONS.map(src => (
            <option key={src} value={src} className="bg-[#1c1c1c] text-white">{src}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status} className="bg-[#1c1c1c] text-white">
              {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Seller</label>
        <select
          name="seller"
          value={formData.seller}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-[#333333] bg-[#1c1c1c] px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="" className="bg-[#1c1c1c] text-white">Select seller</option>
          {SELLER_OPTIONS.map(seller => (
            <option key={seller} value={seller} className="bg-[#1c1c1c] text-white">{seller}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-600 transition-colors shadow-lg hover:shadow-blue-500/50"
      >
        {isLoading ? 'Saving...' : 'Save Lead'}
      </button>
    </form>
  );
}

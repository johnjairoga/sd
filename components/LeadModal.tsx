'use client';

import { Lead } from '@/types/lead';
import { ReactNode } from 'react';
import LeadForm from './LeadForm';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Lead>) => Promise<void>;
  initialData?: Lead;
  isLoading?: boolean;
  title?: string;
}

export default function LeadModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title = 'New Lead',
}: LeadModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (data: Partial<Lead>) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
        <LeadForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

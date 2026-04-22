'use client';

import { Lead } from '@/types/lead';
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
    <>
      {/* Lightweight overlay - allows background to be visible */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - responsive positioning and sizing */}
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-0">
        <div className="w-full max-w-md rounded-t-lg sm:rounded-lg bg-white p-4 sm:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          <h2 className="mb-4 text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h2>

          <LeadForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          <button
            onClick={onClose}
            className="mt-4 w-full rounded bg-gray-300 px-4 py-2 text-sm sm:text-base text-gray-900 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

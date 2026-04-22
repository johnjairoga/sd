'use client';

import { Lead } from '@/types/lead';
import { Draggable } from '@hello-pangea/dnd';

interface LeadCardProps {
  lead: Lead;
  index: number;
  onEdit: (lead: Lead) => void;
}

const SOURCE_COLORS: Record<string, string> = {
  Website: 'bg-blue-100 text-blue-800',
  Referral: 'bg-green-100 text-green-800',
  LinkedIn: 'bg-blue-400 text-white',
  'Cold Call': 'bg-orange-100 text-orange-800',
  Other: 'bg-gray-100 text-gray-800',
};

function getDaysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export default function LeadCard({ lead, index, onEdit }: LeadCardProps) {
  const colorClass = SOURCE_COLORS[lead.source || 'Other'] || SOURCE_COLORS.Other;

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(lead)}
          className={`mb-3 cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
          }`}
        >
          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-600">{lead.company}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
              {lead.source || 'Other'}
            </span>
            <span className="text-xs text-gray-500">{getDaysAgo(lead.created_at)}</span>
          </div>
        </div>
      )}
    </Draggable>
  );
}

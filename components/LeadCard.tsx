'use client';

import { Lead } from '@/types/lead';
import { Draggable } from '@hello-pangea/dnd';

interface LeadCardProps {
  lead: Lead;
  index: number;
  onEdit: (lead: Lead) => void;
}

const SOURCE_COLORS: Record<string, string> = {
  Website: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Referral: 'bg-green-500/20 text-green-300 border border-green-500/30',
  LinkedIn: 'bg-blue-500/30 text-blue-200 border border-blue-500/50',
  'Cold Call': 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  Other: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`);
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`);
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(lead)}
          onMouseMove={handleMouseMove}
          className={`mb-3 cursor-pointer rounded-lg border bg-[#1c1c1c] p-4 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'border-[#333333]'
          } spotlight`}
        >
          <h3 className="font-semibold text-white">{lead.name}</h3>
          <p className="text-sm text-gray-400">{lead.company}</p>
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

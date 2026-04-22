'use client';

import { Lead, LeadStatus } from '@/types/lead';
import { Droppable } from '@hello-pangea/dnd';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal_sent: 'Proposal Sent',
  closed_won: 'Closed Won',
  lost: 'Lost',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-[#1c1c1c] border-[#333333]',
  contacted: 'bg-[#1c1c1c] border-blue-500/30',
  proposal_sent: 'bg-[#1c1c1c] border-purple-500/30',
  closed_won: 'bg-[#1c1c1c] border-green-500/30',
  lost: 'bg-[#1c1c1c] border-red-500/30',
};

export default function KanbanColumn({ status, leads, onEditLead }: KanbanColumnProps) {
  return (
    <div className={`flex w-80 flex-shrink-0 flex-col rounded-lg border-2 glassmorphic ${STATUS_COLORS[status]} p-3 sm:p-4`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-white">{STATUS_LABELS[status]}</h2>
        <span className="rounded-full bg-[#222222] px-3 py-1 text-sm font-semibold text-gray-300 border border-[#333333]">
          {leads.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded ${
              snapshot.isDraggingOver ? 'bg-blue-500/10 ring-2 ring-blue-500/50' : ''
            }`}
            style={{ minHeight: '500px' }}
          >
            {leads.map((lead, index) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                index={index}
                onEdit={onEditLead}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

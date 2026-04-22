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
  new: 'bg-gray-50 border-gray-200',
  contacted: 'bg-blue-50 border-blue-200',
  proposal_sent: 'bg-purple-50 border-purple-200',
  closed_won: 'bg-green-50 border-green-200',
  lost: 'bg-red-50 border-red-200',
};

export default function KanbanColumn({ status, leads, onEditLead }: KanbanColumnProps) {
  return (
    <div className={`flex w-80 flex-shrink-0 flex-col rounded-lg border-2 ${STATUS_COLORS[status]} p-4`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">{STATUS_LABELS[status]}</h2>
        <span className="rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700">
          {leads.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded ${
              snapshot.isDraggingOver ? 'bg-blue-100' : ''
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

'use client';

import { Lead, LeadStatus } from '@/types/lead';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import LeadModal from './LeadModal';
import KanbanColumn from './KanbanColumn';
import MetricsStrip from './MetricsStrip';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'proposal_sent', 'closed_won', 'lost'];

interface KanbanBoardProps {
  leads?: Lead[];
  isLoading?: boolean;
  onLeadsChange?: (leads: Lead[]) => void;
}

export default function KanbanBoard({ leads: propsLeads, isLoading: propsIsLoading, onLeadsChange }: KanbanBoardProps = {}) {
  const [leads, setLeads] = useState<Lead[]>(propsLeads ?? []);
  const [isLoading, setIsLoading] = useState(propsIsLoading ?? true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propsLeads !== undefined) {
      setLeads(propsLeads);
    } else {
      fetchLeads();
    }
  }, [propsLeads]);

  useEffect(() => {
    if (propsIsLoading !== undefined) {
      setIsLoading(propsIsLoading);
    }
  }, [propsIsLoading]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leads');
      const data = await response.json();
      const newLeads = Array.isArray(data) ? data : [];
      setLeads(newLeads);
      onLeadsChange?.(newLeads);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;

    if (!destination) return;
    if (destination.droppableId === result.source.droppableId && destination.index === result.source.index) {
      return;
    }

    const newStatus = destination.droppableId as LeadStatus;
    const lead = leads.find(l => l.id === draggableId);

    if (!lead) return;

    // Optimistic update
    const updatedLeads = leads.map(l =>
      l.id === draggableId ? { ...l, status: newStatus } : l
    );
    setLeads(updatedLeads);
    onLeadsChange?.(updatedLeads);

    // Sync with Supabase
    try {
      const response = await fetch(`/api/leads/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert on error
        await fetchLeads();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
      await fetchLeads();
    }
  };

  const handleCreateNew = () => {
    setSelectedLead(undefined);
    setModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Lead>) => {
    try {
      setIsSubmitting(true);
      const method = selectedLead ? 'PATCH' : 'POST';
      const url = selectedLead ? `/api/leads/${selectedLead.id}` : '/api/leads';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        if (onLeadsChange) {
          await fetchLeads();
        } else {
          await fetchLeads();
        }
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#161616] to-[#0a0a0a]">
        <div className="text-xl text-gray-400">Loading board...</div>
      </div>
    );
  }

  const leadsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-[#161616] to-[#0a0a0a] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header - responsive layout */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              SouthDesk CRM
            </h1>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleCreateNew}
                className="flex-1 sm:flex-none rounded bg-blue-600 px-4 sm:px-6 py-2 text-sm sm:text-base text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/50"
              >
                + New Lead
              </button>
              <a
                href="/leads"
                className="flex-1 sm:flex-none rounded bg-[#222222] px-4 sm:px-6 py-2 text-sm sm:text-base text-white hover:bg-[#333333] text-center transition-colors border border-[#333333]"
              >
                View All
              </a>
            </div>
          </div>

          {/* Metrics strip */}
          <MetricsStrip leads={leads} />

          {/* Kanban board - horizontal scroll on mobile */}
          <div className="overflow-x-auto rounded-lg glassmorphic -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-4 pb-4 min-w-min sm:min-w-0">
              {STATUSES.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  leads={leadsByStatus[status]}
                  onEditLead={handleEditLead}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedLead}
        isLoading={isSubmitting}
        title={selectedLead ? 'Edit Lead' : 'New Lead'}
      />
    </DragDropContext>
  );
}

'use client';

import { Lead, LeadStatus } from '@/types/lead';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import LeadModal from './LeadModal';
import KanbanColumn from './KanbanColumn';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'proposal_sent', 'closed_won', 'lost'];

export default function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(Array.isArray(data) ? data : []);
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
    setLeads(prev =>
      prev.map(l =>
        l.id === draggableId ? { ...l, status: newStatus } : l
      )
    );

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
        await fetchLeads();
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading board...</div>
      </div>
    );
  }

  const leadsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter(l => l.status === status);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">SouthDesk CRM</h1>
            <div className="flex gap-4">
              <button
                onClick={handleCreateNew}
                className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                + New Lead
              </button>
              <a
                href="/leads"
                className="rounded bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
              >
                View All
              </a>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4">
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

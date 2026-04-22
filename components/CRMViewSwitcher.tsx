'use client';

import { Lead, Seller } from '@/types/lead';
import { useState } from 'react';
import KanbanBoard from './KanbanBoard';
import TableView from './TableView';
import LeadModal from './LeadModal';
import { useLeadsData } from '@/hooks/useLeadsData';

type ViewType = 'kanban' | 'table';
const SELLERS: Seller[] = ['Seller_1', 'Seller_2', 'Seller_3'];

export default function CRMViewSwitcher() {
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    leads,
    isLoading,
    updateLeadStatus,
    saveLead,
    deleteLead,
    fetchLeads,
  } = useLeadsData();

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedLead(undefined);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: Partial<Lead>) => {
    try {
      setIsSubmitting(true);
      const success = await saveLead(selectedLead?.id, data);
      if (success) {
        setModalOpen(false);
        setSelectedLead(undefined);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    await deleteLead(leadId);
  };

  const filteredLeads = selectedSeller
    ? leads.filter(lead => lead.seller === selectedSeller)
    : leads;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#161616] to-[#0a0a0a] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header with view toggle */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              SouthDesk CRM
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* View toggle */}
              <div className="flex gap-2 bg-[#1c1c1c] border border-[#333333] rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('kanban')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentView === 'kanban'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setCurrentView('table')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentView === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Table
                </button>
              </div>

              {/* Action buttons */}
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
          </div>

          {/* Seller filter buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSeller(null)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedSeller === null
                  ? 'bg-green-600 text-white'
                  : 'bg-[#1c1c1c] text-gray-400 border border-[#333333] hover:text-white'
              }`}
            >
              All Sellers
            </button>
            {SELLERS.map(seller => (
              <button
                key={seller}
                onClick={() => setSelectedSeller(seller)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedSeller === seller
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1c1c1c] text-gray-400 border border-[#333333] hover:text-white'
                }`}
              >
                {seller}
              </button>
            ))}
          </div>

          {/* View content */}
          {currentView === 'kanban' ? (
            <KanbanBoard
              leads={filteredLeads}
              isLoading={isLoading}
              onLeadsChange={fetchLeads}
            />
          ) : (
            <>
              {/* Table view header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-300 mb-4">Leads List</h2>
              </div>
              <TableView
                leads={filteredLeads}
                isLoading={isLoading}
                onEditLead={handleEditLead}
                onDeleteLead={handleDeleteLead}
              />
            </>
          )}
        </div>
      </div>

      {/* Shared modal for both views */}
      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedLead}
        isLoading={isSubmitting}
        title={selectedLead ? 'Edit Lead' : 'New Lead'}
      />
    </>
  );
}

'use client';

import LeadModal from '@/components/LeadModal';
import { Lead } from '@/types/lead';
import { useEffect, useState } from 'react';

export default function LeadsPage() {
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
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedLead(undefined);
    setModalOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchLeads();
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
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
    return <div className="p-8 text-center">Loading leads...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
          <button
            onClick={handleCreateNew}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            + New Lead
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500">
            No leads yet. Create one to get started.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Source</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.source}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(lead)}
                        className="mr-3 text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedLead}
        isLoading={isSubmitting}
        title={selectedLead ? 'Edit Lead' : 'New Lead'}
      />
    </div>
  );
}

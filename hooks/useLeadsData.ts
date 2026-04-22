'use client';

import { Lead, LeadStatus } from '@/types/lead';
import { useEffect, useState } from 'react';

export function useLeadsData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        await fetchLeads();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
      await fetchLeads();
    }
  };

  const saveLead = async (leadId: string | undefined, data: Partial<Lead>) => {
    try {
      const method = leadId ? 'PATCH' : 'POST';
      const url = leadId ? `/api/leads/${leadId}` : '/api/leads';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchLeads();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save lead:', error);
      return false;
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLeads();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete lead:', error);
      return false;
    }
  };

  return {
    leads,
    isLoading,
    fetchLeads,
    updateLeadStatus,
    saveLead,
    deleteLead,
  };
}

'use client';

import { Lead, LeadStatus } from '@/types/lead';

interface MetricsStripProps {
  leads: Lead[];
}

export default function MetricsStrip({ leads }: MetricsStripProps) {
  const totalLeads = leads.length;

  const leadsByStatus = {
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    proposal_sent: leads.filter(l => l.status === 'proposal_sent').length,
    closed_won: leads.filter(l => l.status === 'closed_won').length,
    lost: leads.filter(l => l.status === 'lost').length,
  };

  const conversionRate = (() => {
    const totalClosed = leadsByStatus.closed_won + leadsByStatus.lost;
    if (totalClosed === 0) return '—';
    return `${Math.round((leadsByStatus.closed_won / totalClosed) * 100)}%`;
  })();

  const inactiveLeads = (() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return leads.filter(lead => {
      const updatedAt = new Date(lead.updated_at);
      return (
        updatedAt < sevenDaysAgo &&
        lead.status !== 'closed_won' &&
        lead.status !== 'lost'
      );
    }).length;
  })();

  return (
    <div className="mb-8 grid grid-cols-4 gap-4">
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-medium text-gray-600">Total Leads</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{totalLeads}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{conversionRate}</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-medium text-gray-600">By Status</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
            New: {leadsByStatus.new}
          </span>
          <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
            Contacted: {leadsByStatus.contacted}
          </span>
          <span className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
            Proposal: {leadsByStatus.proposal_sent}
          </span>
          <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
            Won: {leadsByStatus.closed_won}
          </span>
          <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
            Lost: {leadsByStatus.lost}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm font-medium text-gray-600">Inactive Leads</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{inactiveLeads}</p>
        <p className="mt-1 text-xs text-gray-500">No activity in 7 days</p>
      </div>
    </div>
  );
}

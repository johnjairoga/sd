'use client';

import { Lead } from '@/types/lead';

interface TableViewProps {
  leads: Lead[];
  isLoading: boolean;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

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

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal_sent: 'Proposal Sent',
  closed_won: 'Closed Won',
  lost: 'Lost',
};

const STATUS_BADGE_COLORS: Record<string, string> = {
  new: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
  contacted: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  proposal_sent: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  closed_won: 'bg-green-500/20 text-green-300 border border-green-500/30',
  lost: 'bg-red-500/20 text-red-300 border border-red-500/30',
};

export default function TableView({
  leads,
  isLoading,
  onEditLead,
  onDeleteLead,
}: TableViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-lg glassmorphic border border-[#333333] p-8 text-center text-gray-400">
        No leads yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg glassmorphic border border-[#333333] shadow-xl">
      <table className="w-full">
        <thead className="border-b border-[#333333] bg-[#1c1c1c]">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Company</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Source</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Added</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333333]">
          {leads.map(lead => (
            <tr
              key={lead.id}
              className="hover:bg-[#1c1c1c] transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 text-sm font-medium text-white">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-gray-400">{lead.company || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-400">{lead.email || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-400">{lead.phone || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-400">{lead.source || '—'}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_COLORS[lead.status] || STATUS_BADGE_COLORS.new}`}>
                  {STATUS_LABELS[lead.status]}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {getDaysAgo(lead.created_at)}
              </td>
              <td className="px-6 py-4 text-sm space-x-3">
                <button
                  onClick={() => onEditLead(lead)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteLead(lead.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type LeadStatus = 'new' | 'contacted' | 'proposal_sent' | 'closed_won' | 'lost';

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

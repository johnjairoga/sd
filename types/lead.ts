export type LeadStatus = 'new' | 'contacted' | 'proposal_sent' | 'closed_won' | 'lost';
export type Seller = 'Seller_1' | 'Seller_2' | 'Seller_3';

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: LeadStatus;
  seller: Seller | null;
  created_at: string;
  updated_at: string;
}

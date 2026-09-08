export interface InvoiceItem {
  description: string;
  detail?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceIssuer {
  name: string;
  tagline?: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
}

export interface InvoiceClient {
  name: string;
  company?: string | null;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface InvoiceDocumentData {
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  currency: string;
  currencySymbol: string;
  issuer: InvoiceIssuer;
  client: InvoiceClient;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  paymentTerms?: string;
  paymentInstructions?: {
    bankName?: string;
    routingNumber?: string;
    accountNumber?: string;
    reference?: string;
    notes?: string;
  };
  notes?: string;
}

export interface ProposalScopePhase {
  phase: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface ProposalPricingItem {
  item: string;
  description: string;
  price: number;
}

export interface ProposalDocumentData {
  proposalId: string;
  proposalNumber: string;
  title: string;
  client: {
    name: string;
    company?: string | null;
    email?: string | null;
    address?: string | null;
    contactPerson?: string | null;
  };
  issuer: {
    name: string;
    tagline?: string;
    logoUrl?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    website?: string | null;
  };
  value: number;
  valueFormatted: string;
  currencySymbol: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  preparedBy: string;
  date: string;
  summary: string;
  goals?: string[];
  scopeOfWork: ProposalScopePhase[];
  deliverables: string[];
  pricingItems: ProposalPricingItem[];
  paymentTerms: string;
  termsAndConditions?: string[];
  acceptance?: {
    acceptedBy?: string | null;
    acceptedTitle?: string | null;
    acceptedAt?: string | null;
    signatureStatus: 'PENDING' | 'SIGNED';
  };
}

export interface GeneratePdfOptions {
  title?: string;
  headerTemplate?: string;
  footerTemplate?: string;
  displayHeaderFooter?: boolean;
  margins?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

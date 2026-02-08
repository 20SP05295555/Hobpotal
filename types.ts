
export interface OrderItem {
  id: string;
  description: string;
  details: string[];
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string[];
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface CompanyInfo {
  name: string;
  contact: string;
  address: string[];
  regNo: string;
  email: string;
  website: string;
  terms: string;
  paymentInstructions: string;
  logoUrl?: string;
  bankName?: string;
  sortCode?: string;
  accountNo?: string;
  accountHolder?: string;
  swift?: string;
  iban?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  dueDate: string;
  paymentDate?: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
}

export interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  date: string;
  body: string;
  isIncoming: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  type: 'production' | 'capture';
}

export enum Tab {
  CONFIRMATION = 'CONFIRMATION',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  EMAIL = 'EMAIL',
  GALLERY = 'GALLERY',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS'
}

import { Customer, Order, EmailMessage } from './types';

export const CURRENT_CUSTOMER: Customer = {
  id: '376',
  name: 'Arthur Cook',
  address: ['Iffley Rd', 'Oxford OX4 1EQ', 'United Kingdom'],
  email: 'marwelgkcurry83@gmail.com',
  phone: '+441865241971',
  avatarUrl: 'https://picsum.photos/200/200'
};

export const COMPANY_INFO = {
  name: 'HOB FURNITURE',
  contact: 'emma kitchen',
  address: ['4th Floor 205 Regent Street', 'London - W1B 4HB'],
  regNo: '14667294',
  email: 'customerservice@hobfurniture.co.uk',
  website: 'www.hobfurniture.co.uk',
  terms: 'Deposit amount only, balance due upon completion',
  paymentInstructions: 'Please pay this invoice via bank transfer (see details below) and include this payment reference: 39838265.',
  logoUrl: 'https://placehold.co/150x80/2563eb/ffffff?text=HOB+FURNITURE',
  bankName: 'SUMUP LIMITED',
  sortCode: '041450',
  accountNo: '58291337',
  accountHolder: 'HOB FURNITURE',
  swift: 'SUPAGB21XXX',
  iban: 'GB42SUPA04145058291337'
};

export const SAMPLE_ORDER: Order = {
  id: 'ord_2025_376',
  orderNumber: '2025-376',
  date: '14/09/2025',
  dueDate: '19/09/2025',
  paymentDate: '14/09/2025',
  status: 'Confirmed',
  items: [
    {
      id: 'item_1',
      description: 'Clinton Cinema Sofa',
      details: ['12ft x 4ft', 'Fabric: Alaska Madrid Chenielle'],
      quantity: 1.00,
      unit: 'each',
      price: 2000.00,
      total: 2000.00
    }
  ],
  subtotal: 2000.00,
  tax: 0, // IMPLIED included or exempt based on PDF "Subtotal without VAT" line but total is same
  total: 2000.00,
  amountPaid: 2000.00,
  amountDue: 0.00
};

export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'msg_1',
    from: 'Emma Kitchen',
    fromEmail: 'customerservice@hobfurniture.co.uk',
    to: 'Arthur Cook',
    subject: 'Order #2025-376 Confirmation - HOB Furniture',
    date: 'Sep 14, 2025, 10:30 AM',
    body: `Dear Arthur,

Thank you for your order with HOB Furniture. We are pleased to confirm we have received your deposit and your order is now being processed.

Your estimated delivery date is currently being calculated based on the production schedule for your Clinton Cinema Sofa.

If you have any questions, please simply reply to this email.

Best regards,
Emma Kitchen
HOB Furniture`,
    isIncoming: true
  },
  {
    id: 'msg_2',
    from: 'Arthur Cook',
    fromEmail: 'marwelgkcurry83@gmail.com',
    to: 'Emma Kitchen',
    subject: 'Re: Order #2025-376 Confirmation - HOB Furniture',
    date: 'Sep 15, 2025, 09:15 AM',
    body: `Hi Emma,

Thanks for the confirmation. I just wanted to double-check if the fabric "Alaska Madrid Chenielle" is the stain-resistant version? We have a dog and just want to be sure.

Thanks,
Arthur`,
    isIncoming: false
  }
];

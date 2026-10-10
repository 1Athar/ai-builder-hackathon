export interface User {
  name: string;
  phone: string;
  upiId: string;
  walletBalance: number;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'sent' | 'received' | 'recharge' | 'bill';
  date: string;
  note?: string;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  color: string;
}

export interface Bank {
  id: string;
  name: string;
  accountMasked: string;
  type: string;
  balance: number;
}

export const currentUser: User = {
  name: 'Prasad',
  phone: '+91-98765-43210',
  upiId: 'prasad@chrompe',
  walletBalance: 12450,
};

export const transactions: Transaction[] = [
  {id: 't1', name: 'Amit Kumar', amount: 500, type: 'sent', date: '2026-05-27', note: 'Lunch split'},
  {id: 't2', name: 'Salary Credit', amount: 45000, type: 'received', date: '2026-05-26'},
  {id: 't3', name: 'Airtel Recharge', amount: 299, type: 'recharge', date: '2026-05-25'},
  {id: 't4', name: 'Rahul Sharma', amount: 1200, type: 'received', date: '2026-05-24', note: 'Rent share'},
  {id: 't5', name: 'Electricity Bill', amount: 820, type: 'bill', date: '2026-05-23'},
  {id: 't6', name: 'Priya Singh', amount: 350, type: 'sent', date: '2026-05-22', note: 'Coffee'},
  {id: 't7', name: 'Swiggy', amount: 450, type: 'sent', date: '2026-05-21'},
  {id: 't8', name: 'Deepak Verma', amount: 2000, type: 'received', date: '2026-05-20'},
  {id: 't9', name: 'Jio Recharge', amount: 239, type: 'recharge', date: '2026-05-19'},
  {id: 't10', name: 'Water Bill', amount: 180, type: 'bill', date: '2026-05-18'},
];

export const contacts: Contact[] = [
  {id: 'c1', name: 'Amit', upiId: 'amit@upi', color: '#5f259f'},
  {id: 'c2', name: 'Rahul', upiId: 'rahul@upi', color: '#2196F3'},
  {id: 'c3', name: 'Priya', upiId: 'priya@upi', color: '#4CAF50'},
];

export const banks: Bank[] = [
  {id: 'b1', name: 'HDFC Bank', accountMasked: '•••• 4521', type: 'Savings', balance: 8200},
  {id: 'b2', name: 'SBI Bank', accountMasked: '•••• 7890', type: 'Savings', balance: 4250},
];

export const mobilePlans = [
  {id: 'p1', operator: 'Airtel', amount: 299, validity: '28 days', data: '2GB/day'},
  {id: 'p2', operator: 'Airtel', amount: 399, validity: '56 days', data: '2GB/day'},
  {id: 'p3', operator: 'Jio', amount: 239, validity: '28 days', data: '1.5GB/day'},
  {id: 'p4', operator: 'Jio', amount: 349, validity: '28 days', data: '2GB/day'},
];

export const billCategories = [
  {id: 'bc1', name: 'Electricity', icon: 'flash-on'},
  {id: 'bc2', name: 'Water', icon: 'water-drop'},
  {id: 'bc3', name: 'Gas', icon: 'local-fire-department'},
  {id: 'bc4', name: 'Broadband', icon: 'wifi'},
];

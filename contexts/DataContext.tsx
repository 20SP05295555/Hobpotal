
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CompanyInfo, Customer, Order, OrderItem, GalleryItem } from '../types';
import { COMPANY_INFO, CURRENT_CUSTOMER, SAMPLE_ORDER, INITIAL_GALLERY } from '../constants';

interface DataContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => void;
  customer: Customer;
  updateCustomer: (customer: Customer) => void;
  order: Order;
  updateOrder: (order: Order) => void;
  updateOrderItem: (index: number, field: keyof OrderItem, value: any) => void;
  addOrderItem: () => void;
  removeOrderItem: (index: number) => void;
  updateAmountPaid: (amount: number) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  removeGalleryItem: (id: string) => void;
  isAutoSaving: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key} from storage`, e);
    return fallback;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => loadFromStorage('companyInfo', COMPANY_INFO));
  const [customer, setCustomer] = useState<Customer>(() => loadFromStorage('customer', CURRENT_CUSTOMER));
  const [order, setOrder] = useState<Order>(() => loadFromStorage('order', SAMPLE_ORDER));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadFromStorage('gallery', INITIAL_GALLERY));
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save effect
  useEffect(() => {
    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
      localStorage.setItem('customer', JSON.stringify(customer));
      localStorage.setItem('order', JSON.stringify(order));
      localStorage.setItem('gallery', JSON.stringify(gallery));
      setIsAutoSaving(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [companyInfo, customer, order, gallery]);

  const updateCompanyInfo = (info: CompanyInfo) => setCompanyInfo(info);
  const updateCustomer = (c: Customer) => setCustomer(c);
  const updateOrder = (o: Order) => setOrder(o);

  const calculateTotals = (items: OrderItem[], amountPaid: number) => {
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const total = subtotal;
    const amountDue = Math.max(0, total - amountPaid);
    return { subtotal, total, amountDue };
  };

  const updateAmountPaid = (amount: number) => {
      const { subtotal, total, amountDue } = calculateTotals(order.items, amount);
      setOrder({ ...order, amountPaid: amount, subtotal, total, amountDue });
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...order.items];
    const item = { ...newItems[index] };
    (item as any)[field] = value;
    if (field === 'quantity' || field === 'price') {
       item.total = Number(item.quantity) * Number(item.price);
    }
    newItems[index] = item;
    const { subtotal, total, amountDue } = calculateTotals(newItems, order.amountPaid);
    setOrder({ ...order, items: newItems, subtotal, total, amountDue });
  };

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: `item_${Date.now()}`,
      description: 'New Item',
      details: [],
      quantity: 1,
      unit: 'each',
      price: 0,
      total: 0
    };
    const newItems = [...order.items, newItem];
    const { subtotal, total, amountDue } = calculateTotals(newItems, order.amountPaid);
    setOrder({ ...order, items: newItems, subtotal, total, amountDue });
  };

  const removeOrderItem = (index: number) => {
    const newItems = order.items.filter((_, i) => i !== index);
    const { subtotal, total, amountDue } = calculateTotals(newItems, order.amountPaid);
    setOrder({ ...order, items: newItems, subtotal, total, amountDue });
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = { ...item, id: `g_${Date.now()}` };
    setGallery([newItem, ...gallery]);
  };

  const removeGalleryItem = (id: string) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
        companyInfo, updateCompanyInfo, 
        customer, updateCustomer, 
        order, updateOrder, updateOrderItem,
        addOrderItem, removeOrderItem, updateAmountPaid,
        gallery, addGalleryItem, removeGalleryItem,
        isAutoSaving
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
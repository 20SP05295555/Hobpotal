
import React, { useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { OrderItem } from '../types';
import { Image, Upload, Trash2, Plus, Cloud, Check } from 'lucide-react';

type DocumentMode = 'order' | 'invoice' | 'receipt';

interface DocumentLayoutProps {
  title: string;
  documentNumber: string;
  onDocumentNumberChange?: (val: string) => void;
  dateLabel: string;
  dateValue: string;
  onDateChange?: (val: string) => void;
  dueDateValue: string;
  onDueDateChange?: (val: string) => void;
  customerNoValue: string;
  onCustomerNoChange?: (val: string) => void;
  children?: React.ReactNode;
  mode: DocumentMode;
  isEditing?: boolean;
}

// Enhanced Editable Input
const EditableInput = ({ value, onChange, className = "", type = "text", placeholder = "", align = "left" }: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`
      transition-all duration-200
      bg-transparent border-b border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50
      focus:outline-none focus:border-blue-500 focus:ring-0 focus:bg-white focus:shadow-sm
      px-1 py-0.5 w-full rounded-sm
      ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}
      ${className}
    `}
  />
);

const EditableTextArea = ({ value, onChange, className = "" }: any) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={2}
    className={`
      transition-all duration-200
      bg-transparent border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white
      rounded px-2 py-1 w-full resize-none
      ${className}
    `}
  />
);

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ 
  title, 
  documentNumber, 
  onDocumentNumberChange,
  dateLabel, 
  dateValue,
  onDateChange,
  dueDateValue,
  onDueDateChange,
  customerNoValue,
  onCustomerNoChange,
  children,
  mode,
  isEditing = false
}) => {
  const { 
    companyInfo, updateCompanyInfo, 
    customer, updateCustomer, 
    order, updateOrderItem,
    addOrderItem, removeOrderItem, updateAmountPaid,
    isAutoSaving
  } = useData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCompanyInfo({ ...companyInfo, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (index: number, value: string, isCompany: boolean) => {
    if (isCompany) {
      const newAddr = [...companyInfo.address];
      newAddr[index] = value;
      updateCompanyInfo({ ...companyInfo, address: newAddr });
    } else {
      const newAddr = [...customer.address];
      newAddr[index] = value;
      updateCustomer({ ...customer, address: newAddr });
    }
  };

  // Determine Status
  let statusText = "UNPAID";
  let statusColor = "text-red-600 border-red-600";

  if (order.amountDue <= 0 && order.total > 0) {
      statusText = "PAID";
      statusColor = "text-green-600 border-green-600";
  } else if (order.amountPaid > 0) {
      statusText = "PARTIAL";
      statusColor = "text-orange-500 border-orange-500";
  }

  // Force PAID for Receipt mode if using DocumentLayout directly in that context
  if (mode === 'receipt') {
      statusText = "PAID IN FULL";
      statusColor = "text-green-600 border-green-600";
  }

  return (
    <div className="bg-white w-full max-w-4xl mx-auto p-8 md:p-12 shadow-lg min-h-[800px] text-gray-800 font-sans relative print:shadow-none print:max-w-none print:mx-0 print:min-h-0 print:p-8 group">
      
      {/* Auto Save Indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-gray-400 print:hidden">
           {isAutoSaving ? (
             <>
               <Cloud className="w-3 h-3 animate-pulse" /> Saving...
             </>
           ) : (
             <>
               <Check className="w-3 h-3 text-green-500" /> Saved to device
             </>
           )}
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-2/3 pr-4">
           {/* Logo Section */}
           <div className="mb-6">
              {isEditing ? (
                 <div className="flex items-start gap-4 mb-4 p-4 border border-dashed border-blue-300 bg-blue-50/30 rounded transition-all hover:bg-blue-50">
                    <div className="w-32 h-16 bg-white border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative rounded-sm">
                        {companyInfo.logoUrl ? <img src={companyInfo.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" /> : <Image className="w-6 h-6 opacity-20" />}
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Company Logo</label>
                        <div className="flex gap-2 items-center">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <Upload className="w-3 h-3" />
                                Upload
                            </button>
                            {companyInfo.logoUrl && (
                                <button 
                                    onClick={() => updateCompanyInfo({...companyInfo, logoUrl: ''})}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    title="Remove Logo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoUpload} 
                            className="hidden" 
                        />
                    </div>
                 </div>
              ) : (
                 companyInfo.logoUrl && (
                    <img src={companyInfo.logoUrl} alt="Company Logo" className="h-16 object-contain mb-4" />
                 )
              )}
           </div>

          {isEditing ? (
            <div className="space-y-2 mb-6 p-2 -ml-2 rounded hover:bg-gray-50 transition-colors">
               <EditableInput value={companyInfo.contact} onChange={(v: string) => updateCompanyInfo({...companyInfo, contact: v})} className="font-medium text-sm text-gray-500" placeholder="Contact Person" />
               {companyInfo.address.map((line, i) => (
                 <EditableInput key={i} value={line} onChange={(v: string) => handleAddressChange(i, v, true)} className="text-sm text-gray-500" placeholder="Address Line" />
               ))}
               <EditableInput value={companyInfo.name} onChange={(v: string) => updateCompanyInfo({...companyInfo, name: v})} className="text-2xl font-bold uppercase text-black mt-2" placeholder="Company Name" />
            </div>
          ) : (
            <>
              <h2 className="text-sm font-medium text-gray-500 mb-1">{companyInfo.contact}</h2>
              <p className="text-sm text-gray-500 mb-6">{companyInfo.address.join(' - ')}</p>
              <h1 className="text-2xl font-bold tracking-wide uppercase text-black">{companyInfo.name}</h1>
            </>
          )}
        </div>
        <div className="w-1/3 text-right text-sm text-gray-500 pt-2">
          {isEditing ? (
             <div className="space-y-1 flex flex-col items-end p-2 -mr-2 rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 w-full justify-end">
                    <span className="whitespace-nowrap">Co. Reg.:</span>
                    <EditableInput value={companyInfo.regNo} onChange={(v: string) => updateCompanyInfo({...companyInfo, regNo: v})} className="w-full max-w-[140px]" align="right" />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                    <span className="whitespace-nowrap">Email:</span>
                    <EditableInput value={companyInfo.email} onChange={(v: string) => updateCompanyInfo({...companyInfo, email: v})} className="w-full max-w-[180px]" align="right" />
                </div>
                <div className="flex items-center gap-2 w-full justify-end">
                    <span className="whitespace-nowrap">Web:</span>
                    <EditableInput value={companyInfo.website} onChange={(v: string) => updateCompanyInfo({...companyInfo, website: v})} className="w-full max-w-[180px]" align="right" />
                </div>
             </div>
          ) : (
            <>
              <p>Co. Reg. No.: {companyInfo.regNo}</p>
              <p>Email: {companyInfo.email}</p>
              <p>Website: {companyInfo.website}</p>
            </>
          )}
        </div>
      </div>

      {/* Bill To & Info Grid */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-1/2 pr-4">
            {isEditing ? (
                <div className="space-y-1 p-2 -ml-2 rounded hover:bg-gray-50 transition-colors">
                    <span className="font-bold text-gray-900 block mb-1">Bill to:</span>
                    <EditableInput value={customer.name} onChange={(v: string) => updateCustomer({...customer, name: v})} className="font-bold mb-2" placeholder="Customer Name" />
                    {customer.address.map((line, i) => (
                        <EditableInput key={i} value={line} onChange={(v: string) => handleAddressChange(i, v, false)} className="text-sm text-gray-600" placeholder="Address Line" />
                    ))}
                    <EditableInput value={customer.email} onChange={(v: string) => updateCustomer({...customer, email: v})} className="text-sm text-gray-500 mt-2" placeholder="Customer Email" />
                    <EditableInput value={customer.phone} onChange={(v: string) => updateCustomer({...customer, phone: v})} className="text-sm text-gray-500" placeholder="Customer Phone" />
                </div>
            ) : (
                <>
                  <h3 className="font-bold text-gray-900 mb-2">Bill to: {customer.name}</h3>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    {customer.address.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    <div className="mt-2 text-gray-500">{customer.email}</div>
                    <div className="text-gray-500">{customer.phone}</div>
                  </div>
                </>
            )}
        </div>
        <div className="text-right w-1/2 pl-4">
          <div className="mb-2 flex justify-end items-center gap-2">
            <span className="font-bold text-gray-900">{title}:</span>
            {isEditing && onDocumentNumberChange ? (
                <EditableInput value={documentNumber} onChange={onDocumentNumberChange} className="w-32" align="right" />
            ) : (
                <span className="text-gray-700">{documentNumber}</span>
            )}
          </div>
          <div className="mb-2 flex justify-end items-center gap-2">
            <span className="font-bold text-gray-900">{dateLabel}:</span>
            {isEditing && onDateChange ? (
                <EditableInput value={dateValue} onChange={onDateChange} className="w-32" align="right" />
            ) : (
                <span className="text-gray-700">{dateValue}</span>
            )}
          </div>
          <div className="mb-2 flex justify-end items-center gap-2">
            <span className="font-bold text-gray-900">Due Date:</span>
            {isEditing && onDueDateChange ? (
                <EditableInput value={dueDateValue} onChange={onDueDateChange} className="w-32" align="right" />
            ) : (
                <span className="text-gray-700">{dueDateValue}</span>
            )}
          </div>
          <div className="flex justify-end items-center gap-2">
            <span className="font-bold text-gray-900">Customer No.:</span>
            {isEditing && onCustomerNoChange ? (
                <EditableInput value={customerNoValue} onChange={onCustomerNoChange} className="w-32" align="right" />
            ) : (
                <span className="text-gray-700">{customerNoValue}</span>
            )}
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="w-full bg-[#4B5563] text-white font-bold text-sm py-3 px-4 flex items-center rounded-t-sm print:bg-gray-700 print:text-white print-color-adjust-exact">
        <div className="w-5/12">Description</div>
        <div className="w-2/12 text-center">Quantity</div>
        <div className="w-1/12 text-center">Unit</div>
        <div className="w-2/12 text-right">Price</div>
        <div className="w-2/12 text-right">Amount</div>
      </div>

      {/* Table Body */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        {order.items.map((item, index) => (
          <div key={item.id} className="flex items-start text-sm py-4 px-4 text-gray-800 border-b border-gray-50 last:border-0 relative group/row hover:bg-gray-50/50 transition-colors">
             {isEditing && (
                <button 
                    onClick={() => removeOrderItem(index)}
                    className="absolute -left-8 top-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove Item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
            <div className="w-5/12 pr-4">
              {isEditing ? (
                  <div className="space-y-1">
                      <EditableInput value={item.description} onChange={(v: string) => updateOrderItem(index, 'description', v)} className="font-medium" placeholder="Item Name" />
                      {item.details.map((detail, dIdx) => (
                         <div key={dIdx} className="flex gap-2 items-center">
                            <EditableInput 
                                value={detail} 
                                onChange={(v: string) => {
                                    const newDetails = [...item.details];
                                    newDetails[dIdx] = v;
                                    updateOrderItem(index, 'details', newDetails);
                                }} 
                                className="text-gray-600 text-xs" 
                                placeholder="Detail Line"
                            />
                             <button onClick={() => {
                                 const newDetails = item.details.filter((_, i) => i !== dIdx);
                                 updateOrderItem(index, 'details', newDetails);
                             }} className="text-red-200 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                         </div>
                      ))}
                      <button 
                        onClick={() => {
                            updateOrderItem(index, 'details', [...item.details, ""]);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-600 flex items-center gap-1 mt-1 opacity-50 hover:opacity-100 transition-opacity"
                      >
                          <Plus className="w-3 h-3" /> Add Detail
                      </button>
                  </div>
              ) : (
                <>
                  <p className="font-medium mb-1">{item.description}</p>
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </>
              )}
            </div>
            
            <div className="w-2/12 text-center pt-1">
                {isEditing ? (
                    <EditableInput type="number" value={item.quantity} onChange={(v: string) => updateOrderItem(index, 'quantity', parseFloat(v) || 0)} className="text-center" align="center" />
                ) : (
                    item.quantity.toFixed(2)
                )}
            </div>
            
            <div className="w-1/12 text-center pt-1">
                {isEditing ? (
                    <EditableInput value={item.unit} onChange={(v: string) => updateOrderItem(index, 'unit', v)} className="text-center" align="center" />
                ) : (
                    item.unit
                )}
            </div>
            
            <div className="w-2/12 text-right pt-1">
                {isEditing ? (
                     <EditableInput type="number" value={item.price} onChange={(v: string) => updateOrderItem(index, 'price', parseFloat(v) || 0)} className="text-right" align="right" />
                ) : (
                    item.price.toFixed(2)
                )}
            </div>
            
            <div className="w-2/12 text-right pt-1 font-medium">
                {item.total.toFixed(2)}
            </div>
          </div>
        ))}

        {isEditing && (
            <div className="mt-4 flex justify-center">
                <button 
                    onClick={addOrderItem}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200 border-dashed"
                >
                    <Plus className="w-4 h-4" /> Add New Item
                </button>
            </div>
        )}
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 max-w-xs">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Subtotal without VAT</span>
            <span className="font-mono text-gray-900">{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-bold text-gray-900 text-sm">Total GBP</span>
            <span className="font-bold font-mono text-gray-900">{order.total.toFixed(2)}</span>
          </div>
          <div className={`flex justify-between py-2 text-sm ${isEditing ? 'bg-yellow-50/50 -mx-2 px-2 rounded' : ''}`}>
            <span className="text-gray-600 flex items-center gap-2">
                Amount Paid 
                {isEditing && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">EDITABLE</span>}
            </span>
            <span className="font-mono text-gray-900">
                {isEditing ? (
                    <EditableInput 
                        type="number" 
                        value={order.amountPaid} 
                        onChange={(v: string) => updateAmountPaid(parseFloat(v) || 0)} 
                        className="w-24 font-bold" 
                        align="right" 
                    />
                ) : (
                    mode === 'order' && order.amountPaid === 0 ? '0.00' : `-${order.amountPaid.toFixed(2)}`
                )}
            </span>
          </div>
          <div className="flex justify-between py-2 border-t border-black mt-2">
            <span className="font-bold text-gray-900">Amount Due (GBP)</span>
            <span className="font-bold font-mono text-gray-900">
               {order.amountDue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {children}
      
      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-gray-100">
         <h4 className="font-bold text-sm text-gray-900 mb-2">Terms & Conditions</h4>
         {isEditing ? (
            <EditableInput value={companyInfo.terms} onChange={(v: string) => updateCompanyInfo({...companyInfo, terms: v})} className="text-sm text-gray-600 mb-4" />
         ) : (
            <p className="text-sm text-gray-600 mb-4">{companyInfo.terms}</p>
         )}
         
         <h4 className="font-bold text-sm text-gray-900 mb-2">Payment Instructions</h4>
         {isEditing ? (
             <div className="space-y-4">
                 <EditableTextArea value={companyInfo.paymentInstructions} onChange={(v: string) => updateCompanyInfo({...companyInfo, paymentInstructions: v})} className="text-sm text-gray-600" />
                 
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Bank Name</label>
                        <EditableInput value={companyInfo.bankName} onChange={(v: string) => updateCompanyInfo({...companyInfo, bankName: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Sort Code</label>
                        <EditableInput value={companyInfo.sortCode} onChange={(v: string) => updateCompanyInfo({...companyInfo, sortCode: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Account No.</label>
                        <EditableInput value={companyInfo.accountNo} onChange={(v: string) => updateCompanyInfo({...companyInfo, accountNo: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Account Holder</label>
                        <EditableInput value={companyInfo.accountHolder} onChange={(v: string) => updateCompanyInfo({...companyInfo, accountHolder: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">SWIFT</label>
                        <EditableInput value={companyInfo.swift} onChange={(v: string) => updateCompanyInfo({...companyInfo, swift: v})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">IBAN</label>
                        <EditableInput value={companyInfo.iban} onChange={(v: string) => updateCompanyInfo({...companyInfo, iban: v})} />
                    </div>
                 </div>
             </div>
         ) : (
             <div className="text-sm text-gray-600">
               <p className="mb-4">{companyInfo.paymentInstructions}</p>
               
               <div className="space-y-1">
                   <div className="flex flex-wrap gap-x-4">
                       <span><span className="font-bold text-gray-900">Bank:</span> {companyInfo.bankName}</span>
                       <span><span className="font-bold text-gray-900">Sort Code:</span> {companyInfo.sortCode}</span>
                       <span><span className="font-bold text-gray-900">Account No.:</span> {companyInfo.accountNo}</span>
                   </div>
                   <div className="flex flex-wrap gap-x-4">
                       <span><span className="font-bold text-gray-900">Account Holder:</span> {companyInfo.accountHolder}</span>
                       <span><span className="font-bold text-gray-900">SWIFT:</span> {companyInfo.swift}</span>
                   </div>
                   <div>
                       <span className="font-bold text-gray-900">IBAN:</span> {companyInfo.iban}
                   </div>
               </div>
             </div>
         )}
      </div>

      {/* Dynamic Status Stamp */}
      {(mode === 'invoice' || mode === 'receipt') && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[6px] ${statusColor} px-8 py-2 text-5xl font-black opacity-20 rotate-[-15deg] uppercase tracking-widest pointer-events-none whitespace-nowrap z-0`}>
          {statusText}
        </div>
      )}
    </div>
  );
};

export default DocumentLayout;

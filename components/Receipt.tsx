
import React, { useRef, useState } from 'react';
import DocumentLayout from './DocumentLayout';
import { Printer, Download, CreditCard, Loader2, Edit2, Save } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Receipt: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { order, updateOrder, customer, updateCustomer } = useData();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    const element = contentRef.current;
    // Increased scale for better clarity (2.5) and max quality (1.0)
    const opt = {
      margin: 10,
      filename: `Receipt_${order.orderNumber}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2.5, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsDownloading(false);
      }).catch((err: any) => {
        console.error("PDF generation failed", err);
        setIsDownloading(false);
      });
    } else {
        console.error("html2pdf library not loaded");
        setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center max-w-4xl mx-auto print:hidden">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          Official Receipt
        </h2>
        <div className="flex gap-3">
             {isEditing ? (
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            ) : (
              <>
                 <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Printer className="w-4 h-4" /> Print
                </button>
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {isDownloading ? 'Generating...' : 'Download PDF'}
                </button>
              </>
            )}
        </div>
      </div>

      <div id="printable-receipt" ref={contentRef}>
        <DocumentLayout 
            title="Receipt" 
            documentNumber={`RCT-${order.orderNumber}`}
            onDocumentNumberChange={(v) => updateOrder({...order, orderNumber: v.replace('RCT-', '')})}
            dateLabel="Payment Date"
            dateValue={order.paymentDate || order.date}
            onDateChange={(v) => updateOrder({...order, paymentDate: v})}
            dueDateValue={order.dueDate}
            onDueDateChange={(v) => updateOrder({...order, dueDate: v})}
            customerNoValue={customer.id}
            onCustomerNoChange={(v) => updateCustomer({...customer, id: v})}
            mode="receipt"
            isEditing={isEditing}
        >
            <div className="border border-gray-200 rounded-md p-4 mb-8 bg-gray-50">
            <h4 className="font-bold text-sm text-gray-900 mb-2">Payment Method</h4>
            <div className="flex items-center gap-4 text-sm text-gray-700">
                <span>Bank Transfer</span>
                <span className="h-4 w-px bg-gray-300"></span>
                <span>Ref: 39838265</span>
                <span className="h-4 w-px bg-gray-300"></span>
                <span className="text-green-600 font-medium">Verified</span>
            </div>
            </div>
        </DocumentLayout>
      </div>
    </div>
  );
};

export default Receipt;

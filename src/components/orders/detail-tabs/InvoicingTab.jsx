import React from 'react';
import { FileText, Edit2, Download } from 'lucide-react';
import { EmptyState, InfoCard } from '../../common';
import { formatDate } from '../../../utils';
import { PERMISSIONS } from '../../../constants';

export function InvoicingTab({ order, editingInvoice, setEditingInvoice, invoiceData, saveInvoice, InvoicingForm, hasPermission }) {
  if (editingInvoice) {
    return (
      <InvoicingForm
        initialData={invoiceData}
        onSave={saveInvoice}
        onCancel={() => setEditingInvoice(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Order Invoicing
          </h3>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm leading-relaxed">
            Provide the final tax invoice details and upload the E-Way bill after the goods have been dispatched.
          </p>
        </div>

        {hasPermission(PERMISSIONS.EDIT_INVOICING) && (
          <button
            onClick={() => setEditingInvoice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
             <Edit2 className="w-4 h-4" /> Edit Invoice Details
          </button>
        )}
      </div>

      {invoiceData?.invoiceNumber || invoiceData?.invoiceDate ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard label="Invoice Number" value={invoiceData.invoiceNumber} highlight />
            <InfoCard label="Invoice Date" value={formatDate(invoiceData.invoiceDate)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Invoice Attachment</p>
               {invoiceData.invoiceAttachment ? (
                 <button onClick={() => {
                    const link = document.createElement('a');
                    link.href = invoiceData.invoiceAttachment;
                    link.download = `Invoice_${invoiceData.invoiceNumber}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                 }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 rounded-xl text-sm font-semibold hover:bg-blue-500 hover:text-white transition-colors">
                    <Download className="w-4 h-4" /> Download Tax Invoice PDF
                 </button>
               ) : (
                 <p className="text-slate-500 text-sm italic">Not Uploaded</p>
               )}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">E-Way Bill Attachment</p>
               {invoiceData.ewayBillAttachment ? (
                 <button onClick={() => {
                    const link = document.createElement('a');
                    link.href = invoiceData.ewayBillAttachment;
                    link.download = `EWayBill_${invoiceData.invoiceNumber}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                 }} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/10 text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors">
                    <Download className="w-4 h-4" /> Download E-Way Bill PDF
                 </button>
               ) : (
                 <p className="text-slate-500 text-sm italic">Not Uploaded</p>
               )}
            </div>
          </div>

          {invoiceData.remarks && (
            <div className="mt-6">
              <InfoCard label="Remarks" value={invoiceData.remarks} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState 
          icon={<FileText className="w-6 h-6 text-slate-400" />} 
          message="No invoice details have been recorded yet." 
          canEdit={hasPermission(PERMISSIONS.EDIT_INVOICING)}
          onEdit={() => setEditingInvoice(true)}
        />
      )}
    </div>
  );
}

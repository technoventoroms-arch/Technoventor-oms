import React, { useState } from 'react';
import { FileText, Download, Upload, AlertCircle } from 'lucide-react';
import { FormField } from '../common';

export function InvoicingForm({ initialData = {}, onSave, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: initialData.invoiceNumber || '',
    invoiceDate: initialData.invoiceDate || '',
    invoiceAttachment: initialData.invoiceAttachment || '',
    ewayBillAttachment: initialData.ewayBillAttachment || '',
    remarks: initialData.remarks || ''
  });

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    
    if (file.type !== 'application/pdf') {
      alert("Please upload a PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (base64Data, filename) => {
    if (!base64Data) return;
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.invoiceNumber || !formData.invoiceDate) {
      alert("Please fill in Invoice Number and Date.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <FileText className="w-48 h-48" />
        </div>
        
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Order Invoicing Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <FormField label="Invoice Number" required>
            <input
              type="text"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="INV/202X/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
            />
          </FormField>

          <FormField label="Invoice Date" required>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
            />
          </FormField>

          {/* Invoice Attachment */}
          <div className="col-span-1 md:col-span-2 mt-4">
            <label className="block text-sm font-semibold text-slate-400 mb-2">Invoice Attachment (PDF)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-white cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-blue-400" />
                Upload Invoice PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'invoiceAttachment')}
                />
              </label>
              
              {formData.invoiceAttachment ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Uploaded successfully
                  </span>
                  <button 
                    onClick={() => handleDownload(formData.invoiceAttachment, `Invoice_${formData.invoiceNumber || 'Draft'}.pdf`)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button 
                    onClick={() => setFormData(f => ({...f, invoiceAttachment: ''}))}
                    className="text-red-400 hover:text-red-300 text-sm font-medium ml-2"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-sm text-slate-500 italic">No file uploaded</span>
              )}
            </div>
          </div>

          {/* E-Way Bill Attachment */}
          <div className="col-span-1 md:col-span-2 mt-2">
            <label className="block text-sm font-semibold text-slate-400 mb-2">E-Way Bill Attachment (PDF)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium text-white cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-orange-400" />
                Upload E-Way Bill PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'ewayBillAttachment')}
                />
              </label>
              
              {formData.ewayBillAttachment ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Uploaded successfully
                  </span>
                  <button 
                    onClick={() => handleDownload(formData.ewayBillAttachment, `EWayBill_${formData.invoiceNumber || 'Draft'}.pdf`)}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button 
                    onClick={() => setFormData(f => ({...f, ewayBillAttachment: ''}))}
                    className="text-red-400 hover:text-red-300 text-sm font-medium ml-2"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-sm text-slate-500 italic">No file uploaded</span>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <FormField label="Remarks">
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional notes regarding the invoice..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                rows={3}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <FileText className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Invoice Details'}
        </button>
      </div>
    </div>
  );
}

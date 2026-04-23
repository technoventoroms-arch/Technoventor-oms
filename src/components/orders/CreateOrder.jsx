import React, { useState } from 'react';
import { FileSpreadsheet, Plus, ClipboardList, Package, Layers, X, DollarSign, Upload, Tag, ShieldCheck, CreditCard, Download } from 'lucide-react';
import { CUSTOMER_TYPES, PAYMENT_TERMS, WARRANTY_TERMS, ITEM_UNITS, ORDER_STAGES } from '../../constants';
import { Section, FormField, AddressFields } from '../common';
import {
  CustomerDetailsSection,
  OrderDetailsSection,
  EPBGDetailsSection,
  CommercialTermsSection,
  BOQItemsSection
} from './form-sections';

export function CreateOrder({ onSubmit, onCancel }) {
  const [projectName, setProjectName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    type: 'Private',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: 'India'
    },
    sameAsBilling: true,
    contactPerson: '',
    contactNumber: '',
    email: '',
    gstNumber: ''
  });

  // 2. Order Details
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    quotationNumber: '',
    quotationDate: '',
    expectedDeliveryDate: '',
    dispatchDate: ''
  });

  // 3. EPBG Details
  const [epbgDetails, setEpbgDetails] = useState({
    required: 'No',
    attachmentDraft: null
  });

  // 4. Commercial Terms
  const [commercialTerms, setCommercialTerms] = useState({
    paymentTerm: 'Net 30',
    warrantyTerm: '1 Year',
    others: ''
  });

  // 5. BOQ Items
  const [items, setItems] = useState([{ 
    id: 1, 
    itemCode: '', 
    name: '', 
    make: '', 
    model: '', 
    unit: 'Nos', 
    quantity: 1, 
    rate: 0, 
    amount: 0, 
    gstPercent: 18, 
    totalAmount: 0,
    parentItemIndex: null,
    description: '',
    itemType: 'goods'
  }]);

  const [importMode, setImportMode] = useState(false);
  const [excelData, setExcelData] = useState('');

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, 
      itemCode: '', 
      name: '', 
      make: '', 
      model: '', 
      unit: 'Nos', 
      quantity: 1, 
      rate: 0, 
      amount: 0, 
      gstPercent: 18, 
      totalAmount: 0,
      parentItemIndex: null,
      description: '',
      itemType: 'goods'
    }]);
  };

  const addSubItem = (parentId) => {
    const parentIndex = items.findIndex(i => i.id === parentId);
    if (parentIndex === -1) return;
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItems = [...items];
    newItems.splice(parentIndex + 1, 0, {
      id: newId, 
      itemCode: '', 
      name: '', 
      make: '', 
      model: '', 
      unit: 'Nos', 
      quantity: 1, 
      rate: 0, 
      amount: 0, 
      gstPercent: 18, 
      totalAmount: 0,
      parentItemIndex: parentId,
      description: '',
      itemType: 'goods'
    });
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      
      if (['quantity', 'rate', 'gstPercent'].includes(field)) {
        const qty = parseFloat(newItems[index].quantity) || 0;
        const rate = parseFloat(newItems[index].rate) || 0;
        const gst = parseFloat(newItems[index].gstPercent) || 0;
        
        const amount = qty * rate;
        newItems[index].amount = amount;
        newItems[index].totalAmount = amount * (1 + (gst / 100));
      }
      return newItems;
    });
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
  const gstTotal = grandTotal - subTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ 
        id: orderId,
        projectName, 
        customerDetails, 
        orderDetails, 
        epbgDetails, 
        commercialTerms, 
        items, 
        totalValue: subTotal,
        summary: { subTotal, gstAmount: gstTotal, grandTotal }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelPaste = (text) => {
    if (!text) return;
    
    // Split into lines and filter empty ones
    let lines = text.trim().split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return;

    // Detect separator
    const detectBestSeparator = () => {
      const seps = ['\t', ',', ';', /\s{2,}/];
      let best = '\t';
      let maxCols = 0;
      const sample = lines[0];
      seps.forEach(sep => {
        const cols = sample.split(sep).length;
        if (cols > maxCols) {
          maxCols = cols;
          best = sep;
        }
      });
      if (best === ',' && maxCols < 5) return '\t';
      return best;
    };

    const separator = detectBestSeparator();

    const cleanNumeric = (val) => {
      if (!val) return '0';
      return val.toString().replace(/[^0-9.-]/g, '') || '0';
    };

    const splitLine = (line, sep) => {
      if (sep instanceof RegExp) return line.split(sep);
      if (sep === '\t') return line.split('\t');
      const result = [];
      let cell = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === sep && !inQuotes) {
          result.push(cell.trim());
          cell = '';
        } else {
          cell += char;
        }
      }
      result.push(cell.trim());
      return result;
    };

    const parsedItems = lines.map((line, lineIndex) => {
      const row = splitLine(line, separator).map(cell => cell.replace(/^["']|["']$/g, ''));
      if (lineIndex === 0) {
        const isHeader = row.some(cell => 
          ['code', 'description', 'price', 'rate', 'qty', 'quantity', 'make', 'model'].includes(cell.toLowerCase())
        );
        if (isHeader) return null;
      }
      if (row.length < 3) return null;

      const qty = parseFloat(cleanNumeric(row[2])) || 1;
      const rate = parseFloat(cleanNumeric(row[5])) || 0;
      const gst = parseFloat(cleanNumeric(row[6])) || 18;
      const amount = qty * rate;
      const totalAmount = amount * (1 + (gst / 100));
      
      return {
        id: lineIndex + 1,
        itemCode: row[0] || '',
        name: row[1] || '',
        make: row[3] || '',
        model: row[4] || '',
        quantity: qty,
        unit: 'Nos',
        rate: rate,
        amount: amount,
        gstPercent: gst,
        totalAmount: totalAmount,
        parentItemIndex: null,
        description: '',
        itemType: 'goods'
      };
    }).filter(item => item !== null);

    if (parsedItems.length > 0) {
      const reindexedItems = parsedItems.map((item, idx) => ({ ...item, id: idx + 1 }));
      setItems(reindexedItems);
      setImportMode(false);
      setExcelData('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => handleExcelPaste(event.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
            Create Order
          </h2>
          <p className="text-slate-400">Initialize a new project and order details</p>
        </div>
        <button
          onClick={() => setImportMode(!importMode)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-lg"
        >
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          Import BOQ (Excel)
        </button>
      </div>

      {importMode && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Upload className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Import BOQ Items</h3>
            </div>
            <div className="flex items-center gap-3">
              <a href="/boq_sample.csv" download className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium">
                <Download className="w-4 h-4" /> Template
              </a>
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 cursor-pointer hover:bg-slate-700 hover:text-white transition-all">
                <Plus className="w-4 h-4" /> Upload CSV
                <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
          <textarea
            value={excelData}
            onChange={(e) => setExcelData(e.target.value)}
            onPaste={(e) => handleExcelPaste(e.clipboardData.getData('text'))}
            placeholder="Paste your Excel table rows here..."
            className="w-full h-48 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
          />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setImportMode(false)} className="px-5 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="button" onClick={() => handleExcelPaste(excelData)} className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all">Load Items</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField label="System Order ID" icon={<Tag />}>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-mono"
                  placeholder="e.g. ORD-2024-001"
                  required
                />
              </FormField>
              <FormField label="Project Name" icon={<ClipboardList />}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  placeholder="e.g. Mumbai HQ Infrastructure"
                  required
                />
              </FormField>
              <div className="flex flex-col justify-end">
                 <p className="text-sm text-slate-500 mb-1">Status</p>
                 <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-medium inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    Initializing New Order
                 </div>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CustomerDetailsSection customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} />
          <OrderDetailsSection orderDetails={orderDetails} setOrderDetails={setOrderDetails} />
          <EPBGDetailsSection epbgDetails={epbgDetails} setEpbgDetails={setEpbgDetails} />
          <CommercialTermsSection commercialTerms={commercialTerms} setCommercialTerms={setCommercialTerms} />
        </div>

        <BOQItemsSection
          items={items}
          setItems={setItems}
          updateItem={updateItem}
          removeItem={removeItem}
          addItem={addItem}
          addSubItem={addSubItem}
        />

        <div className="flex justify-end gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <button type="button" onClick={onCancel} className="px-8 py-3 text-slate-400 font-bold hover:text-white transition-colors">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-12 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {isSubmitting ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <Plus className="w-5 h-5" />}
            {isSubmitting ? 'CREATING...' : 'CREATE ORDER'}
          </button>
        </div>
      </form>
    </div>
  );
}

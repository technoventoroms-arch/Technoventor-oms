import React, { useState } from 'react';
import { Users, ClipboardList, Package, Layers, X, DollarSign, Tag, ShieldCheck, CreditCard, Plus, Upload, Download } from 'lucide-react';
import { CUSTOMER_TYPES, PAYMENT_TERMS, WARRANTY_TERMS, ITEM_UNITS } from '../../constants';
import { Section, FormField, AddressFields } from '../common';
import {
  CustomerDetailsSection,
  OrderDetailsSection,
  EPBGDetailsSection,
  CommercialTermsSection,
  BOQItemsSection
} from './form-sections';

export function EditOrder({ order, currentUser, onSubmit, onCancel }) {
  const [projectName, setProjectName] = useState(order.projectName || '');
  const [orderId, setOrderId] = useState(order.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 1. Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    name: order.customerDetails?.name || '',
    type: order.customerDetails?.type || 'Private',
    billingAddress: order.customerDetails?.billingAddress || {
      line1: '', line2: '', city: '', state: '', zip: '', country: 'India'
    },
    shippingAddress: order.customerDetails?.shippingAddress || {
      line1: '', line2: '', city: '', state: '', zip: '', country: 'India'
    },
    sameAsBilling: !order.customerDetails?.shippingAddress || JSON.stringify(order.customerDetails?.billingAddress) === JSON.stringify(order.customerDetails?.shippingAddress),
    contactPerson: order.customerDetails?.contactPerson || '',
    contactNumber: order.customerDetails?.contactNumber || '',
    email: order.customerDetails?.email || '',
    gstNumber: order.customerDetails?.gstNumber || ''
  });

  // 2. Order Details
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: order.orderDetails?.orderNumber || '',
    orderDate: order.orderDetails?.orderDate || '',
    quotationNumber: order.orderDetails?.quotationNumber || '',
    quotationDate: order.orderDetails?.quotationDate || '',
    expectedDeliveryDate: order.orderDetails?.expectedDeliveryDate || '',
    dispatchDate: order.orderDetails?.dispatchDate || ''
  });

  // 3. EPBG Details
  const [epbgDetails, setEpbgDetails] = useState({
    required: order.epbgDetails?.required || 'No',
    attachmentDraft: order.epbgDetails?.attachmentDraft || null
  });

  // 4. Commercial Terms
  const [commercialTerms, setCommercialTerms] = useState({
    paymentTerm: order.commercialTerms?.paymentTerm || 'Net 30',
    warrantyTerm: order.commercialTerms?.warrantyTerm || '1 Year',
    others: order.commercialTerms?.others || ''
  });

  // 5. BOQ Items
  const [items, setItems] = useState(order.items || [{ 
    id: 1, itemCode: '', name: '', make: '', model: '', unit: 'Nos', quantity: 1, rate: 0, amount: 0, gstPercent: 18, totalAmount: 0, parentItemIndex: null, description: '' 
  }]);

  const addItem = () => {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { 
      id: nextId, itemCode: '', name: '', make: '', model: '', unit: 'Nos', quantity: 1, rate: 0, amount: 0, gstPercent: 18, totalAmount: 0, parentItemIndex: null, description: '' 
    }]);
  };

  const addSubItem = (parentId) => {
    const parentIndex = items.findIndex(i => i.id === parentId);
    if (parentIndex === -1) return;
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    const newItems = [...items];
    newItems.splice(parentIndex + 1, 0, {
      id: newId, itemCode: '', name: '', make: '', model: '', unit: 'Nos', quantity: 1, rate: 0, amount: 0, gstPercent: 18, totalAmount: 0, parentItemIndex: parentId, description: ''
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

  const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const grandTotal = items.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
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
        summary: { subTotal, gstAmount: gstTotal, grandTotal },
        history: [
          ...(order.history || []),
          {
            date: new Date().toISOString(),
            action: `Order details updated (Project/Customer/BOQ)`,
            by: currentUser?.name || 'Unknown',
            department: currentUser?.department || 'Unknown'
          }
        ]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Edit Order: {order.id}
          </h2>
          <p className="text-slate-400">Modify existing project and order details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField label="System Order ID" icon={<Tag />}>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-mono"
                  placeholder="e.g. ORD-2024-001"
                  required
                />
              </FormField>
             <FormField label="Project Name" icon={<ClipboardList />}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  placeholder="e.g. Mumbai HQ Infrastructure"
                  required
                />
              </FormField>
              <div className="flex flex-col justify-end">
                 <p className="text-sm text-slate-500 mb-1">Status</p>
                 <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 font-medium inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Editing Existing Order
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

        <div className="flex flex-col lg:flex-row gap-8">
           <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h4 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
                 <ClipboardList className="w-4 h-4 text-amber-400" />
                 Order Notes
              </h4>
              <textarea 
                placeholder="Additional instructions or notes for this order..."
                className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30"
              />
           </div>
           
           <div className="w-full lg:w-96 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                   <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">6. Summary</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-sm">Sub Total</span>
                  <span className="font-mono">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-sm">GST Amount</span>
                  <span className="font-mono">+ ₹{gstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="h-px bg-slate-700 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Grand Total</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <ClipboardList className="w-5 h-5" />
                  )}
                  {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                >
                  Cancel and Discard
                </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}

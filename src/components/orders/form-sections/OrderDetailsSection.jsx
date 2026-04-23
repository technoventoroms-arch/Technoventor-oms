import React from 'react';
import { Tag } from 'lucide-react';
import { Section, FormField } from '../../common';

export function OrderDetailsSection({ orderDetails, setOrderDetails }) {
  return (
    <Section icon={<Tag className="w-5 h-5" />} title="2. Order Details">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Order Number">
          <input
            type="text"
            value={orderDetails.orderNumber}
            onChange={(e) => setOrderDetails({...orderDetails, orderNumber: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
            placeholder="PO/2024/001"
            required
          />
        </FormField>
        <FormField label="Order Date">
          <input
            type="date"
            value={orderDetails.orderDate}
            onChange={(e) => setOrderDetails({...orderDetails, orderDate: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
          />
        </FormField>
        <FormField label="Quotation/Tender No.">
          <input
            type="text"
            value={orderDetails.quotationNumber}
            onChange={(e) => setOrderDetails({...orderDetails, quotationNumber: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
          />
        </FormField>
        <FormField label="Quotation Date">
          <input
            type="date"
            value={orderDetails.quotationDate}
            onChange={(e) => setOrderDetails({...orderDetails, quotationDate: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
          />
        </FormField>
        <FormField label="Expected Delivery Date">
          <input
            type="date"
            value={orderDetails.expectedDeliveryDate}
            onChange={(e) => setOrderDetails({...orderDetails, expectedDeliveryDate: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
          />
        </FormField>
        <FormField label="Dispatch Date">
          <input
            type="date"
            value={orderDetails.dispatchDate}
            onChange={(e) => setOrderDetails({...orderDetails, dispatchDate: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
          />
        </FormField>
      </div>
    </Section>
  );
}

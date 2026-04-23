import React from 'react';
import { Users, Tag, ShieldCheck, CreditCard, DollarSign, Download } from 'lucide-react';
import { InfoCard } from '../../common';
import { formatAddress, formatDate } from '../../../utils';
import { PERMISSIONS } from '../../../constants';

export function OverviewTab({ order, hasPermission }) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          1. Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard label="Customer Name" value={hasPermission(PERMISSIONS.VIEW_CUSTOMER_NAME) ? order.customerDetails?.name : 'Restricted'} />
          <InfoCard label="Customer Type" value={order.customerDetails?.type} />
          <InfoCard label="GST Number" value={order.customerDetails?.gstNumber || 'N/A'} />
          <InfoCard label="Contact Person" value={order.customerDetails?.contactPerson || 'N/A'} />
          <InfoCard label="Contact Number" value={order.customerDetails?.contactNumber || 'N/A'} />
          <InfoCard label="Email ID" value={order.customerDetails?.email || 'N/A'} />
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Billing Address" value={formatAddress(order.customerDetails?.billingAddress || order.customerDetails?.address)} />
              <InfoCard label="Shipping Address" value={formatAddress(order.customerDetails?.shippingAddress || order.customerDetails?.address)} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-400" />
          2. Order Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard label="Order Number" value={order.orderDetails?.orderNumber || order.id} />
          <InfoCard label="Order Date" value={formatDate(order.orderDetails?.orderDate || order.createdDate)} />
          <InfoCard label="Quotation/Tender No." value={order.orderDetails?.quotationNumber || 'N/A'} />
          <InfoCard label="Quotation/Tender Date" value={formatDate(order.orderDetails?.quotationDate)} />
          <InfoCard label="Expected Delivery Date" value={formatDate(order.orderDetails?.expectedDeliveryDate)} />
          <InfoCard label="Dispatch Date" value={formatDate(order.orderDetails?.dispatchDate)} />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          3. EPBG Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard label="EPBG Required" value={order.epbgDetails?.required || 'No'} highlight={order.epbgDetails?.required === 'Yes'} />
          {order.epbgDetails?.required === 'Yes' && (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs text-slate-500 font-semibold">Attachment Draft</p>
              {order.epbgDetails?.attachmentDraft ? (
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = order.epbgDetails.attachmentDraft;
                    link.download = `EPBG_Draft_${order.id}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors w-fit"
                >
                  <Download className="w-4 h-4" />
                  Download Draft.pdf
                </button>
              ) : (
                <span className="text-sm text-slate-500 italic">No attachment uploaded</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-amber-400" />
          4. Commercial Terms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard label="Payment Term" value={order.commercialTerms?.paymentTerm || 'N/A'} />
          <InfoCard label="Warranty Term" value={order.commercialTerms?.warrantyTerm || 'N/A'} />
          <InfoCard label="Others" value={order.commercialTerms?.others || 'N/A'} />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800/50">
        <div className="bg-slate-950/30 rounded-2xl p-6 border border-slate-800/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Overall Project Value
            </h3>
            {hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && (
              <div className="text-right">
                <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Grand Total (Incl. GST)</p>
                <p className="text-3xl font-black text-emerald-400 font-mono">₹{order.summary?.grandTotal?.toLocaleString('en-IN') || order.totalValue.toLocaleString('en-IN')}</p>
              </div>
            )}
          </div>
          {!hasPermission(PERMISSIONS.VIEW_ORDER_VALUE) && <p className="text-slate-500 text-sm italic">Financial details are restricted based on your role.</p>}
        </div>
      </div>
    </div>
  );
}

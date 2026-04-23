import React from 'react';
import { Users } from 'lucide-react';
import { Section, FormField, AddressFields } from '../../common';
import { CUSTOMER_TYPES } from '../../../constants';

export function CustomerDetailsSection({ customerDetails, setCustomerDetails }) {
  return (
    <Section icon={<Users />} title="1. Customer Details">
      <div className="space-y-4">
        <FormField label="Customer Name">
          <input
            type="text"
            value={customerDetails.name}
            onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            required
          />
        </FormField>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Customer Type">
            <select
              value={customerDetails.type}
              onChange={(e) => setCustomerDetails({...customerDetails, type: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {CUSTOMER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </FormField>
          <FormField label="GST Number">
            <input
              type="text"
              value={customerDetails.gstNumber}
              onChange={(e) => setCustomerDetails({...customerDetails, gstNumber: e.target.value.toUpperCase()})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              placeholder="27AAAAA0000A1Z5"
            />
          </FormField>
        </div>

        <AddressFields 
          labelPrefix="Billing "
          fields={customerDetails.billingAddress}
          onChange={(newAddr) => {
            setCustomerDetails(prev => ({
              ...prev,
              billingAddress: newAddr,
              shippingAddress: prev.sameAsBilling ? newAddr : prev.shippingAddress
            }));
          }}
        />

        <div className="flex items-center gap-3 px-1 pt-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={customerDetails.sameAsBilling}
              onChange={(e) => {
                const checked = e.target.checked;
                setCustomerDetails(prev => ({
                  ...prev,
                  sameAsBilling: checked,
                  shippingAddress: checked ? prev.billingAddress : prev.shippingAddress
                }));
              }}
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            <span className="ml-3 text-sm font-medium text-slate-400">Shipping same as Billing</span>
          </label>
        </div>

        {!customerDetails.sameAsBilling && (
          <div className="pt-4 border-t border-slate-800/30 mt-4">
            <AddressFields 
              labelPrefix="Shipping "
              fields={customerDetails.shippingAddress}
              onChange={(newAddr) => {
                setCustomerDetails(prev => ({ ...prev, shippingAddress: newAddr }));
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Contact Person">
            <input
              type="text"
              value={customerDetails.contactPerson}
              onChange={(e) => setCustomerDetails({...customerDetails, contactPerson: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </FormField>
          <FormField label="Contact Number">
            <input
              type="text"
              value={customerDetails.contactNumber}
              onChange={(e) => setCustomerDetails({...customerDetails, contactNumber: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </FormField>
        </div>
        <FormField label="Email ID">
          <input
            type="email"
            value={customerDetails.email}
            onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            placeholder="contact@example.com"
          />
        </FormField>
      </div>
    </Section>
  );
}

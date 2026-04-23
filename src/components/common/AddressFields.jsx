import React from 'react';
import { FormField } from './FormField';

export function AddressFields({ fields, onChange, labelPrefix = '' }) {
  const handleChange = (field, value) => {
    onChange({ ...fields, [field]: value });
  };

  return (
    <div className="space-y-4 pt-2 border-t border-slate-800/30">
      <FormField label={`${labelPrefix}Address Line1`}>
        <input
          type="text"
          value={fields.line1 || ''}
          onChange={(e) => handleChange('line1', e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          placeholder="Street address, P.O. box, company name, c/o"
          required
        />
        <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-none">Street address, P.O. box, company name, c/o</p>
      </FormField>
      
      <FormField label={`${labelPrefix}Address Line2`}>
        <input
          type="text"
          value={fields.line2 || ''}
          onChange={(e) => handleChange('line2', e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
        <p className="text-[10px] text-slate-500 mt-1 ml-1 leading-none">Apartment, suite, unit, building, floor, etc.</p>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="City">
          <input
            type="text"
            value={fields.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            required
          />
        </FormField>
        <FormField label="State/Province/Region">
          <input
            type="text"
            value={fields.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="ZIP/Postal Code">
          <input
            type="text"
            value={fields.zip || ''}
            onChange={(e) => handleChange('zip', e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            required
          />
        </FormField>
        <FormField label="Country">
          <select
            value={fields.country || 'India'}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="India">India</option>
          </select>
        </FormField>
      </div>
    </div>
  );
}

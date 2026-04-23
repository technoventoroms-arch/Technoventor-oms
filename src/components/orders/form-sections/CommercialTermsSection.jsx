import React from 'react';
import { CreditCard } from 'lucide-react';
import { Section, FormField } from '../../common';
import { PAYMENT_TERMS, WARRANTY_TERMS } from '../../../constants';

export function CommercialTermsSection({ commercialTerms, setCommercialTerms }) {
  return (
    <Section icon={<CreditCard className="w-5 h-5" />} title="4. Commercial Terms">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Payment Term">
            <select
              value={commercialTerms.paymentTerm}
              onChange={(e) => setCommercialTerms({...commercialTerms, paymentTerm: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
            >
              {PAYMENT_TERMS.map(term => <option key={term} value={term}>{term}</option>)}
            </select>
          </FormField>
          <FormField label="Warranty Term">
            <select
              value={commercialTerms.warrantyTerm}
              onChange={(e) => setCommercialTerms({...commercialTerms, warrantyTerm: e.target.value})}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white"
            >
              {WARRANTY_TERMS.map(term => <option key={term} value={term}>{term}</option>)}
            </select>
          </FormField>
        </div>
        <FormField label="Others (Custom Remarks)">
          <textarea
            value={commercialTerms.others}
            onChange={(e) => setCommercialTerms({...commercialTerms, others: e.target.value})}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white"
            placeholder="Special specifications..."
            rows={1}
          />
        </FormField>
      </div>
    </Section>
  );
}

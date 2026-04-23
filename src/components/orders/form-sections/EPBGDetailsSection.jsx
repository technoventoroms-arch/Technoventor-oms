import React from 'react';
import { ShieldCheck, Upload, X } from 'lucide-react';
import { Section, FormField } from '../../common';

export function EPBGDetailsSection({ epbgDetails, setEpbgDetails }) {
  const handleEPBGFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEpbgDetails({
          ...epbgDetails,
          attachmentDraft: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Section icon={<ShieldCheck className="w-5 h-5" />} title="3. EPBG Details">
      <div className="space-y-4">
        <FormField label="Is EPBG Required?">
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="epbg"
                checked={epbgDetails.required === 'Yes'}
                onChange={() => setEpbgDetails({...epbgDetails, required: 'Yes'})}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${epbgDetails.required === 'Yes' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'}`}>
                {epbgDetails.required === 'Yes' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
              </div>
              <span className={epbgDetails.required === 'Yes' ? 'text-emerald-400' : 'text-slate-400'}>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="epbg"
                checked={epbgDetails.required === 'No'}
                onChange={() => setEpbgDetails({...epbgDetails, required: 'No'})}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${epbgDetails.required === 'No' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600'}`}>
                {epbgDetails.required === 'No' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
              </div>
              <span className={epbgDetails.required === 'No' ? 'text-emerald-400' : 'text-slate-400'}>No</span>
            </label>
          </div>
        </FormField>
        
        {epbgDetails.required === 'Yes' && (
          <FormField label="Attachment Draft">
            <input 
              type="file" 
              id="epbg-upload" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleEPBGFileChange}
            />
            <label htmlFor="epbg-upload" className="flex items-center gap-3 w-full bg-slate-950/30 border border-dashed border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all cursor-pointer">
              <Upload className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-500">
                {epbgDetails.attachmentDraft ? 'Change draft document' : 'Upload draft document'}
              </span>
            </label>
            {epbgDetails.attachmentDraft && (
              <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg w-fit">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Draft PDF uploaded</span>
                <button 
                  type="button" 
                  onClick={() => setEpbgDetails({...epbgDetails, attachmentDraft: null})}
                  className="ml-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </FormField>
        )}
      </div>
    </Section>
  );
}

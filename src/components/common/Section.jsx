import React from 'react';

export function Section({ icon, title, children, className = '' }) {
  return (
    <div className={`card overflow-hidden shadow-lg flex flex-col ${className}`}>
      <div className="card-header">
        <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}

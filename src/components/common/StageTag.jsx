import React from 'react';
import { STAGE_LABELS } from '../../constants';

export function StageTag({ stage }) {
  const colors = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    planning: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    stores: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    procurement: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    finance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    stores_inward: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    dispatch: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded-full border ${colors[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}

import React from 'react';
import { STAGE_LABELS } from '../../constants';
import { STAGE_COLORS } from '../../constants/theme';

export function StageTag({ stage }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded-full border ${STAGE_COLORS[stage] || STAGE_COLORS.new}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}

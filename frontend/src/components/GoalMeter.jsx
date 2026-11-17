import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const GoalMeter = ({ done = 0, target = 20 }) => {
  const pct = Math.min(100, Math.round((done / Math.max(1, target)) * 100));
  const complete = done >= target;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-headline text-3xl font-bold text-on-surface">
          {done}
          <span className="text-base font-normal text-on-surface-variant"> / {target}</span>
        </p>
        {complete ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 font-label">
            <CheckCircle2 size={14} /> Goal reached
          </span>
        ) : (
          <span className="text-xs font-semibold text-on-surface-variant font-label">
            {target - done} to go
          </span>
        )}
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(done, target)}
        aria-label="Cards reviewed today"
        className={`h-2.5 rounded-full overflow-hidden ${
          complete ? 'bg-emerald-500/20' : 'bg-surface-container-highest'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            complete ? 'bg-emerald-600' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default GoalMeter;

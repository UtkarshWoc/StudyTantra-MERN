import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const GoalMeter = ({ done = 0, target = 20 }) => {
  const pct = Math.min(100, Math.round((done / Math.max(1, target)) * 100));
  const complete = done >= target;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-2xl font-extrabold text-white">
          {done}<span className="text-base font-semibold text-slate-400"> / {target}</span>
        </p>
        {complete ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400"><CheckCircle2 size={14} /> Goal reached</span>
        ) : (
          <span className="text-xs font-semibold text-slate-500">{target - done} to go</span>
        )}
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(done, target)}
        aria-label="Cards reviewed today"
        className={`h-2.5 rounded-full overflow-hidden ${complete ? 'bg-emerald-500/15' : 'bg-amber-500/15'}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${complete ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'}`}
          style={{ width: `${pct}%`, animation: 'progress-fill 1s ease-out' }}
        />
      </div>
    </div>
  );
};

export default GoalMeter;

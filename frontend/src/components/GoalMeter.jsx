import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Today's reviews against the daily goal. Meter: the track is a lighter step of
 * the same hue as the fill; reaching the goal switches to the success color
 * with an icon + label (never color alone).
 */
const GoalMeter = ({ done = 0, target = 20 }) => {
  const pct = Math.min(100, Math.round((done / Math.max(1, target)) * 100));
  const complete = done >= target;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-2xl font-extrabold text-slate-50">
          {done}<span className="text-base font-semibold text-slate-400"> / {target}</span>
        </p>
        {complete ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400"><CheckCircle2 size={14} /> Goal reached</span>
        ) : (
          <span className="text-xs font-semibold text-slate-400">{target - done} to go</span>
        )}
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={Math.min(done, target)}
        aria-label="Cards reviewed today"
        className={`h-2 rounded-full ${complete ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}
      >
        <div
          className={`h-2 rounded-full transition-all duration-500 ${complete ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default GoalMeter;

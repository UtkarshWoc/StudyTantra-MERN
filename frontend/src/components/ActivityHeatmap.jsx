import React, { useMemo, useState } from 'react';

// Sequential, one hue (amber 800→500), validated with the dataviz ordinal check
// against the #111827 surface: lightness rises with activity. Zero days use a
// neutral slate step so "no study" never reads as "a little study".
const EMPTY = '#1e293b';
const RAMP = ['#92400e', '#b45309', '#d97706', '#f59e0b'];
const BUCKETS = [1, 5, 15, 30]; // lower bounds for RAMP steps

const colorFor = (count) => {
  if (!count) return EMPTY;
  let step = 0;
  BUCKETS.forEach((min, i) => { if (count >= min) step = i; });
  return RAMP[step];
};

const CELL = 11;
const GAP = 2; // surface gap between cells
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDay = (key) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/**
 * GitHub-style calendar of study activity (reviews + quizzes per day).
 * days: [{ date: 'YYYY-MM-DD', count }] oldest → newest.
 */
const ActivityHeatmap = ({ days = [] }) => {
  const [hover, setHover] = useState(null); // { day, x, y }

  const { weeks, monthLabels, total, activeDays } = useMemo(() => {
    // Pad the start so each column is a Sunday→Saturday week
    const firstDow = days.length ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0;
    const cells = [...Array(firstDow).fill(null), ...days];
    const cols = [];
    for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

    // Label a column when a month starts in it (and the first column)
    const labels = [];
    cols.forEach((week, i) => {
      const ref = week.find((d) => d?.date.endsWith('-01')) || (i === 0 ? week.find(Boolean) : null);
      if (ref) labels.push({ col: i, label: MONTHS[Number(ref.date.slice(5, 7)) - 1] });
    });
    // Drop a first label that would collide with the next one
    if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();

    return {
      weeks: cols,
      monthLabels: labels,
      total: days.reduce((n, d) => n + d.count, 0),
      activeDays: days.filter((d) => d.count > 0).length,
    };
  }, [days]);

  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP) + 16;

  return (
    <figure className="relative">
      <div className="overflow-x-auto pb-1">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Study activity over the last year: ${total} reviews and quizzes on ${activeDays} days`}
          onMouseLeave={() => setHover(null)}
        >
          {monthLabels.map((m) => (
            <text key={`${m.col}-${m.label}`} x={m.col * (CELL + GAP)} y={10} className="fill-slate-500" fontSize="10">{m.label}</text>
          ))}
          {weeks.map((week, col) => week.map((day, row) => day && (
            <rect
              key={day.date}
              x={col * (CELL + GAP)}
              y={16 + row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={2}
              fill={colorFor(day.count)}
              onMouseEnter={(e) => {
                const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                const r = e.currentTarget.getBoundingClientRect();
                setHover({ day, x: r.left - box.left + CELL / 2, y: r.top - box.top });
              }}
            >
              <title>{`${day.count} on ${formatDay(day.date)}`}</title>
            </rect>
          )))}
        </svg>
      </div>

      {hover && (
        <div
          role="tooltip"
          style={{ left: hover.x, top: hover.y - 8 }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-[#0b1120] border border-[#334155] px-2.5 py-1.5 text-xs shadow-xl"
        >
          <span className="font-semibold text-slate-100">{hover.day.count} {hover.day.count === 1 ? 'activity' : 'activities'}</span>
          <span className="text-slate-400"> · {formatDay(hover.day.date)}</span>
        </div>
      )}

      <figcaption className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-slate-400">
        <span>{total} reviews & quizzes · {activeDays} active days</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less
          {[EMPTY, ...RAMP].map((c) => <span key={c} className="inline-block w-[11px] h-[11px] rounded-[2px]" style={{ background: c }} />)}
          More
        </span>
      </figcaption>
    </figure>
  );
};

export default ActivityHeatmap;

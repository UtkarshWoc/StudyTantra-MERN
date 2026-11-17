import React, { useMemo, useState, useRef, useEffect } from 'react';

// Sequential Sahara-amber ramp.
// '#1e293b' retained for zero-activity cells to preserve accessible test assertions and contrast.
const EMPTY = '#1e293b';
const RAMP = ['#c2652a', '#e08850', '#f0a878', '#fbe8d8'];
const BUCKETS = [1, 5, 15, 30]; // lower bounds for RAMP steps

const colorFor = (count) => {
  if (!count) return EMPTY;
  let step = 0;
  BUCKETS.forEach((min, i) => {
    if (count >= min) step = i;
  });
  return RAMP[step];
};

const CELL = 11;
const GAP = 2; // surface gap between cells
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDay = (key) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * GitHub-style calendar of study activity in Sahara styling.
 * days: [{ date: 'YYYY-MM-DD', count }] oldest → newest.
 */
const ActivityHeatmap = ({ days = [] }) => {
  const [hover, setHover] = useState(null); // { day, x, y }

  const { weeks, monthLabels, total, activeDays } = useMemo(() => {
    let effectiveDays = days;
    if (!effectiveDays || effectiveDays.length === 0) {
      const today = new Date();
      effectiveDays = Array.from({ length: 365 }, (_, i) => {
        const d = new Date(today);
        d.setUTCDate(d.getUTCDate() - (364 - i));
        return { date: d.toISOString().slice(0, 10), count: 0 };
      });
    }

    const firstDow = effectiveDays.length ? new Date(`${effectiveDays[0].date}T00:00:00Z`).getUTCDay() : 0;
    const cells = [...Array(firstDow).fill(null), ...effectiveDays];
    const cols = [];
    for (let i = 0; i < cells.length; i += 7) cols.push(cells.slice(i, i + 7));

    const labels = [];
    cols.forEach((week, i) => {
      const ref = week.find((d) => d?.date.endsWith('-01')) || (i === 0 ? week.find(Boolean) : null);
      if (ref) labels.push({ col: i, label: MONTHS[Number(ref.date.slice(5, 7)) - 1] });
    });
    if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();

    return {
      weeks: cols,
      monthLabels: labels,
      total: effectiveDays.reduce((n, d) => n + (d?.count || 0), 0),
      activeDays: effectiveDays.filter((d) => (d?.count || 0) > 0).length,
    };
  }, [days]);

  const width = weeks.length * (CELL + GAP);
  const height = 7 * (CELL + GAP) + 16;
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [weeks]);

  return (
    <figure className="relative">
      <div ref={scrollRef} className="overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Study activity over the last year: ${total} reviews and quizzes on ${activeDays} days`}
          onMouseLeave={() => setHover(null)}
          className="select-none"
        >
          {monthLabels.map((m) => (
            <text
              key={`${m.col}-${m.label}`}
              x={m.col * (CELL + GAP)}
              y={10}
              className="fill-on-surface-variant font-label text-[10px]"
              fontSize="10"
            >
              {m.label}
            </text>
          ))}
          {weeks.map((week, col) =>
            week.map(
              (day, row) =>
                day && (
                  <rect
                    key={day.date}
                    x={col * (CELL + GAP)}
                    y={16 + row * (CELL + GAP)}
                    width={CELL}
                    height={CELL}
                    rx={2.5}
                    fill={colorFor(day.count)}
                    stroke={day.count ? 'none' : 'rgba(154, 144, 136, 0.2)'}
                    strokeWidth={day.count ? 0 : 0.5}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parent = scrollRef.current.getBoundingClientRect();
                      setHover({
                        day,
                        x: rect.left - parent.left + CELL / 2,
                        y: rect.top - parent.top - 8,
                      });
                    }}
                  />
                )
            )
          )}
        </svg>
      </div>

      {hover && (
        <div
          role="tooltip"
          className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1 rounded-lg bg-surface-container-highest text-on-surface text-[11px] font-label font-medium shadow-md whitespace-nowrap border border-outline-variant/30"
          style={{ left: hover.x, top: hover.y }}
        >
          <span className="font-bold text-primary">
            {hover.day.count} action{hover.day.count === 1 ? '' : 's'}
          </span>{' '}
          on {formatDay(hover.day.date)}
        </div>
      )}
    </figure>
  );
};

export default ActivityHeatmap;

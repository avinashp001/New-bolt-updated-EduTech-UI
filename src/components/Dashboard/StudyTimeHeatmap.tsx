import React, { useMemo } from "react";
import { ChevronDown, Clock } from "lucide-react";

interface Session {
  created_at: string; // ISO datetime string
  duration_minutes?: number;
}

interface StudyTimeCardProps {
  studySessions?: Session[]; // can pass [] or undefined
  title?: string;
}

const HOUR_LABEL = (h: number) => {
  const ampm = h >= 12 ? "pm" : "am";
  const hr = ((h + 11) % 12) + 1; // 1..12
  return `${hr}${ampm}`;
};

const StudyTimeCard: React.FC<StudyTimeCardProps> = ({
  studySessions = [],
  title = "Study Time",
}) => {
  const today = new Date();

  // build last 7 days
  const last7Dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, [today]);

  const { dailyTotals, hourlyTotals, maxDailyMinutes } = useMemo(() => {
    const dailyMap = new Map<string, number>();
    const hourlyMap = new Map<number, number>();

    // last7Dates.forEach((d) => dailyMap.set(d.toISOString().split("T")[0], 0));
    last7Dates.forEach((d) => dailyMap.set(d.toLocaleDateString("en-CA"), 0));

    for (let h = 0; h < 24; h++) hourlyMap.set(h, 0);

    (studySessions || []).forEach((s) => {
      if (!s?.created_at) return;
      const dt = new Date(s.created_at);
      // const dateKey = dt.toISOString().split("T")[0];
      const dateKey = dt.toLocaleDateString("en-CA");
      if (!dailyMap.has(dateKey)) return; // not in last 7 days
      const mins = Number(s.duration_minutes || 0);

      if (dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + mins);
      }

      const hour = dt.getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + mins);
    });

    const dailyTotalsArr = last7Dates.map((d) => {
      // const key = d.toISOString().split("T")[0];
      const key = d.toLocaleDateString("en-CA");
      return {
        date: key,
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        totalMinutes: dailyMap.get(key) || 0,
      };
    });

    const maxDaily = Math.max(...dailyTotalsArr.map((d) => d.totalMinutes), 1);

    return {
      dailyTotals: dailyTotalsArr,
      hourlyTotals: Array.from(hourlyMap.entries()).map(([hour, mins]) => ({
        hour,
        mins,
      })),
      maxDailyMinutes: maxDaily,
    };
  }, [studySessions, last7Dates]);

  // best/worst hour
  const bestHour = useMemo(() => {
    return hourlyTotals.reduce(
      (acc, cur) => (cur.mins > acc.mins ? cur : acc),
      { hour: 8, mins: 0 }
    );
  }, [hourlyTotals]);

  const positiveHours = hourlyTotals.filter((h) => h.mins > 0);
  const worstHour = positiveHours.length
    ? positiveHours.reduce((acc, cur) =>
        cur.mins < acc.mins ? cur : acc
      , positiveHours[0])
    : { hour: 19, mins: 0 };

  const bestLabel = `${HOUR_LABEL(bestHour.hour)}`;
  const worstLabel = `${HOUR_LABEL(worstHour.hour)}`;

  const todayKey = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-4 max-w-sm">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white/80">
            {title}
          </h3>
          <div className="text-xs text-slate-500">Last 7 days</div>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm text-slate-600 hover:bg-slate-100">
          <span className="text-xs">Daily base</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* mini bar chart */}
      <div className="h-24 mb-3 flex items-end">
        <div className="flex items-end space-x-2 w-full justify-between">
          {dailyTotals.map((d) => {
            const heightPct = Math.round(
              (d.totalMinutes / (maxDailyMinutes || 1)) * 100
            );
            const label =
              d.totalMinutes < 60
                ? `${d.totalMinutes}m`
                : `${(d.totalMinutes / 60).toFixed(1)}h`;

            return (
              <div
                key={d.date}
                className="flex flex-col items-center justify-end relative"
              >
                <div
                  className="w-6 rounded-md bg-gradient-to-b from-orange-400 to-orange-600 transition-all flex items-end justify-center text-[10px] font-medium text-white"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: heightPct === 0 ? 6 : undefined,
                    boxShadow:
                      heightPct > 0
                        ? "0 2px 6px rgba(249,115,22,0.25)"
                        : undefined,
                  }}
                  title={`${d.label} — ${Math.round(d.totalMinutes)} min`}
                >
                  {d.totalMinutes > 0 && (
                    <span className="mb-1">{label}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* days row */}
      <div className="flex items-center justify-between mb-3">
        {dailyTotals.map((d) => {
          const isToday = d.date === todayKey;
          return (
            <div
              key={d.date}
              className="flex flex-col items-center text-xs w-6"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  isToday
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {d.label.slice(0, 1)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{d.label}</div>
            </div>
          );
        })}
      </div>

      {/* best / worst */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-emerald-50 rounded-xl">
          <div className="text-sm font-bold text-emerald-700">{bestLabel}</div>
          <div className="text-xs text-emerald-600">Best Performance</div>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-xl">
          <div className="text-sm font-bold text-red-700">{worstLabel}</div>
          <div className="text-xs text-red-600">Worst Performance</div>
        </div>
      </div>

      {/* Study pattern box */}
      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-blue-700">Study Pattern</div>
          <div className="text-xs text-slate-600 mt-1">
            Build a consistent study routine to identify your peak performance
            hours.
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimeCard;
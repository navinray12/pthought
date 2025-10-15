import React from "react";
import { format } from "date-fns";
type AppointmentPos = {
  apt: any,
  top: number,
  height: number, 
  leftRatio?: number,
  widthRatio?: number,
  start: Date,
  end: Date
};
const APPT_COLORS: Record<string, string> = {
  Checkup: "bg-blue-500",
  Consultation: "bg-green-500",
  "Follow-up": "bg-orange-400",
  Procedure: "bg-purple-500",
};
export const DayView: React.FC<{
  date: Date;
  appointments: AppointmentPos[];
  loading: boolean;
}> = ({ date, appointments, loading }) => {
  const minuteToPx = 1; 
  const totalHeight = 600 * minuteToPx;
  return (
    <div className="border rounded p-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-bold"> {format(date, "EEEE, MMM d, yyyy")} </div>
        </div>
        <div className="text-sm text-gray-600">{loading ? "Loading..." : `${appointments.length} appointments`}</div>
      </div>
      <div className="flex">
        {/* times column */}
        <div className="w-20">
          {Array.from({length: 11}).map((_,i) => {
            const hour = 8 + i;
            return (
              <div key={i} style={{height: 60 * minuteToPx}} className="text-xs text-right pr-2">
                {hour}:00
              </div>
            );
          })}
        </div>
        <div className="flex-1 relative border-l" style={{height: totalHeight}}>
          {/* slot backgrounds */}
          {Array.from({length: 20}).map((_,i)=>(
            <div key={i} style={{height: 30*minuteToPx}} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"} />
          ))}
          {/* appointments */}
          {appointments.map((p, idx) => {
            const topPx = p.top * minuteToPx;
            const heightPx = Math.max(20, p.height * minuteToPx);
            const leftPct = (p.leftRatio ?? 0) * 100;
            const widthPct = (p.widthRatio ?? 1) * 100;
            const colorClass = APPT_COLORS[p.apt.type] ?? "bg-gray-400";
            return (
              <div
                key={idx}
                className={`absolute rounded-md p-1 text-white ${colorClass} shadow`}
                style={{
                  top: topPx,
                  left: `calc(${leftPct}% + 4px)`,
                  width: `calc(${widthPct}% - 8px)`,
                  height: heightPx,
                  overflow: "hidden"
                }}
                title={`${p.apt.patientName} • ${format(p.start, "HH:mm")} - ${format(p.end, "HH:mm")}`}
              >
                <div className="font-semibold text-sm">{p.apt.patientName}</div>
                <div className="text-xs">{p.apt.type} • {p.height} min</div>
              </div>
            );})}
        </div>
      </div></div>
  );
};
export default DayView;

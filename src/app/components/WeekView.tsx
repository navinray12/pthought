import React from "react";
import { addDays, format } from "date-fns";

type WeeklyApt = {
  apt: any,
  dayIndex: number, 
  top: number,
  height: number,
  leftRatio?: number,
  widthRatio?: number,
};
const APPT_COLORS: Record<string, string> = {
  Checkup: "bg-blue-500",
  Consultation: "bg-green-500",
  "Follow-up": "bg-orange-400",
  Procedure: "bg-purple-500",
};

export const WeekView: React.FC<{
  startDate: Date; 
  appointments: WeeklyApt[];
}> = ({ startDate, appointments }) => {
  const minuteToPx = 1;
  const totalHeight = 600;
  const days = Array.from({length:7}).map((_,i) => addDays(startDate, i));

  return (
    <div className="border rounded p-2 overflow-auto">
      <div className="mb-3 flex justify-between items-center">
        <div className="font-bold">Week: {format(startDate, "MMM d")} - {format(addDays(startDate,6),"MMM d, yyyy")}</div>
        <div className="text-sm text-gray-600">{appointments.length} appointments</div>
      </div>
      <div className="grid" style={{gridTemplateColumns: `80px repeat(7, 1fr)`}}>
        <div className="border-r" />
        {days.map((d, i) => (
          <div key={i} className="text-center border">{format(d,"EEE dd")}</div>
        ))}
        <div className="border-r pr-2">
          {Array.from({length:11}).map((_,i)=>(
            <div key={i} style={{height:60}} className="text-xs text-right pr-1">{8+i}:00</div>
          ))}
        </div>
        {days.map((d, di)=>(
          <div key={di} className="relative border-l" style={{height: totalHeight}}>
            {Array.from({length:20}).map((_,j)=>(
              <div key={j} style={{height:30}} className={j%2? "bg-gray-50":"bg-white"} />
            ))}
            {appointments.filter(a=>a.dayIndex===di).map((p, idx)=>{
              const top = p.top;
              const height = Math.max(20, p.height);
              const leftPct = (p.leftRatio ?? 0) * 100;
              const widthPct = (p.widthRatio ?? 1) * 100;
              const colorClass = APPT_COLORS[p.apt.type] ?? "bg-gray-400";
              return (
                <div key={idx}
                  className={`absolute rounded p-1 text-white ${colorClass} shadow`}
                  style={{
                    top, left: `calc(${leftPct}% + 4px)`, width: `calc(${widthPct}% - 8px)`,
                    height,overflow: "hidden"
                  }}
                  title={`${p.apt.patientName} ${p.apt.type}`}>
                  <div className="text-xs font-semibold">{p.apt.patientName}</div>
                  <div className="text-[10px]">{format(new Date(p.apt.startTime),"HH:mm")} - {format(new Date(p.apt.endTime),"HH:mm")}</div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;

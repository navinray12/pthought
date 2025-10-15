"use client";
import React, { useEffect,useMemo, useState } from "react";
import DoctorSelector from "./DoctorSelector";
import DayView from "./DayView";
import WeekView from "./WeekView";
import { useAppointments } from "../hooks/useAppointments";
import AppointmentService from "../services/appointmentService";
import { startOfWeek, addDays } from "date-fns";
type Role = "frontdesk" | "doctor";
export const ScheduleView: React.FC<{ initialDate?: Date; role?: Role; currentDoctorId?: string | null }> = ({
  initialDate = new Date(),
  role = "frontdesk",
  currentDoctorId = null,
}) => {
  const [mode, setMode] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [doctorId, setDoctorId] = useState<string | null>(role === "doctor" ? currentDoctorId : null);
  useEffect(() => {
    if (role === "frontdesk" && !doctorId) {
      const first = AppointmentService.listDoctors()[0];
      if (first) setDoctorId(first.id);
    }
  }, [role, doctorId]);

  const { loading, error, mapped } = useAppointments(doctorId, selectedDate);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

  const weekAppointments = useMemo(() => {
    if (!doctorId) return [];
    const raw = AppointmentService.getAppointmentsByDoctorAndRange(doctorId, weekStart, addDays(weekStart, 6));
    return raw.map((apt) => {
      const s = new Date(apt.startTime);
      const e = new Date(apt.endTime);
      const dayStart = new Date(s);
      dayStart.setHours(8, 0, 0, 0);
      const top = Math.max(0, Math.round((s.getTime() - dayStart.getTime()) / 60000));
      const height = Math.max(20, Math.round((e.getTime() - s.getTime()) / 60000));
      const dayIndex = Math.floor((s.setHours(0, 0, 0, 0) - weekStart.setHours(0, 0, 0, 0)) / (24 * 60 * 60 * 1000));
      return { apt, top, height, dayIndex, start: s, end: e };
    });
  }, [doctorId, weekStart]);

  const weekPositioned = useMemo(() => {
    const byDay: Record<number, any[]> = {};
    weekAppointments.forEach((w: any) => {
      byDay[w.dayIndex] = byDay[w.dayIndex] || [];
      byDay[w.dayIndex].push(w);
    });
    const laid: any[] = [];
    Object.keys(byDay).forEach((k) => {
      const arr = byDay[Number(k)];
      arr.sort((a, b) => a.top - b.top);
      const groups: any[] = [];
      while (arr.length) {
        const base = arr.shift();
        const group = [base];
        for (let i = arr.length - 1; i >= 0; i--) {
          if (base.top < arr[i].top + arr[i].height && arr[i].top < base.top + base.height) {
            group.push(arr[i]);
            arr.splice(i, 1);
          }
        }
        groups.push(group);
      }
      groups.forEach((gr) => {
        gr.forEach((it: any, idx: number) => {
          laid.push({ ...it, leftRatio: idx / gr.length, widthRatio: 1 / gr.length });
        });
      });
    });
    return laid;
  }, [weekAppointments]);

  const doctors = AppointmentService.listDoctors();
  const currentDoctor = doctors.find((d) => d.id === doctorId);

  return (
    <div className=" w-full max-w-full space-y-6 p-6 bg-gray-50 rounded-lg shadow-md">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <DoctorSelector value={doctorId} onChange={setDoctorId} role={role}  currentDoctorId={currentDoctorId}/>
          
          <input  value={selectedDate.toISOString().slice(0, 10)}  onChange={(e) => setSelectedDate(new Date(e.target.value))} type="date"  className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"/>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              onClick={() => setMode("day")}
              className={`px-4 py-2 rounded font-semibold transition ${
                mode === "day"? "bg-blue-600 text-white shadow-md": "bg-white border border-gray-300 hover:bg-gray-100"}`} >
                  Day View
            </button>
            <button
              onClick={() => setMode("week")}
              className={`px-4 py-2 rounded font-semibold transition ${
                mode === "week" ? "bg-blue-600 text-white shadow-md": "bg-white border border-gray-300 hover:bg-gray-100"}`}>
              Week View
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-800">{currentDoctor?.name ?? "No doctor selected"}</div>
          <div className="text-sm text-gray-500">{currentDoctor?.specialty ?? ""}</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-inner min-h-[400px] w-full max-w-full overflow-x-auto">
  {mode === "day" ? (
    <DayView date={selectedDate} appointments={mapped} loading={loading} />
  ) : (
    <WeekView startDate={weekStart} appointments={weekPositioned} />
  )}
</div>
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  );
};

export default ScheduleView;

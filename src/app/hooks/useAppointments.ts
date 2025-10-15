
import { useEffect, useMemo, useState } from "react";
import AppointmentService from "../services/appointmentService";
import { Appointment } from "../types";
import { addDays, startOfWeek } from "date-fns";
import { TimeSlot } from "../domain/TimeSlot";

export function generateDaySlots(date: Date) {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour < 18; hour++) {
    [0, 30].forEach(min => {
      const s = new Date(date);
      s.setHours(hour, min, 0, 0);
      const e = new Date(s);
      e.setMinutes(e.getMinutes() + 30);
      slots.push(new TimeSlot(s, e));
    });
  }
  return slots;
}
export function useAppointments(doctorId: string | null, date: Date) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        if (!doctorId) {
          setAppointments([]);
          return;
        }
        const a = AppointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
        if (mounted) setAppointments(a);
      } catch (err: any) {
        if (mounted) setError(err.message || "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {mounted = false;};
  }, [doctorId, date]);

  const timeSlots = useMemo(() => generateDaySlots(date), [date]);
  const dayBoundStart = new Date(date);
  dayBoundStart.setHours(8,0,0,0);
  function toMinutesFromStart(d: Date) {
    return Math.max(0, Math.round((d.getTime() - dayBoundStart.getTime()) / 60000));
  }
  const mapped = useMemo(() => {
    return appointments.map(apt => {
      const s = new Date(apt.startTime);
      const e = new Date(apt.endTime);
      const top = toMinutesFromStart(s);
      const height = Math.max(30, Math.round((e.getTime() - s.getTime()) / 60000)); // min height 30
      return { apt, top, height, start: s, end: e };
    }).sort((a,b)=>a.top-b.top);
  }, [appointments]);
  const positioned = useMemo(() => {
    const groups: Array<typeof mapped> = [];
    const items = mapped.slice();
    while (items.length) {
      const base = items.shift()!;
      const group = [base];
      for (let i = items.length - 1; i >= 0; i--) {
        if (base.end > items[i].start || base.start < items[i].end) {
          group.push(items[i]);
          items.splice(i,1);
        }
      }
      groups.push(group);
    }
    const laidOut: any[] = [];
    groups.forEach(group => {
      const cols = group.length;
      group.forEach((it, idx) => {
        laidOut.push({
          ...it,
          leftRatio: idx / cols,
          widthRatio: 1 / cols
        });
      });
    });
    return laidOut;
  }, [mapped]);
  return { loading, error, appointments, timeSlots, mapped: positioned };
}

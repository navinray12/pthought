
"use client";
import React from "react";
import AppointmentService from "../services/appointmentService";
import { Doctor } from "../types";

type Props = {
  value?: string | null;
  onChange: (doctorId: string | null) => void;
  role?: "frontdesk" | "doctor";
  currentDoctorId?: string | null;
};
export const DoctorSelector: React.FC<Props> = ({ value, onChange, role = "frontdesk", currentDoctorId }) => {
  const doctors = AppointmentService.listDoctors() as Doctor[];
  if (role === "doctor") {
    const dr = doctors.find(d => d.id === currentDoctorId);
    return (
      <div className="space-y-1">
        <div className="font-semibold">{dr?.name ?? "Unknown Doctor"}</div>
        <div className="text-sm text-muted-foreground">{dr?.specialty}</div>
        {dr && (
          <div className="text-xs text-gray-500">
            {Object.entries(dr.workingHours)
              .map(([day, time]) => `${day.slice(0, 3)} ${time.start}-${time.end}`).join(", ")}
          </div>
        )}
      </div>
    );
  }
  return (
    <select
      className="px-3 py-2 border rounded"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}>
      <option value="">-- Select doctor --</option>
      {doctors.map(d => (
        <option key={d.id} value={d.id}>
          {d.name} — {d.specialty} (
          {Object.entries(d.workingHours)
            .map(([day, time]) => `${day.slice(0, 3)} ${time.start}-${time.end}`)
            .join(", ")}
          )
        </option>
      ))}
    </select>
  );
};
export default DoctorSelector;

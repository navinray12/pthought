import React from "react";
import ScheduleView from "../components/ScheduleView";
export default function SchedulePage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Hospital Appointment Scheduler</h1>
      <ScheduleView role="frontdesk"/>
    </main>
  );
}

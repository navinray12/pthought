"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/schedule");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-300 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold  mb-4">
          Hospital Appointment Scheduler
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Manage doctors’ appointments efficiently with day and week views.  
          Choose a doctor, view their schedule, and explore weekly or daily
          appointments.
        </p>
        <button
          onClick={handleNavigate}
          className="px-6 py-3 bg-blue-500 hover:bg-orange-700 text-white rounded-xl font-medium transition-all duration-200"
        >
          View Schedule Daily/Weekly
        </button>
      </div>
    </main>
  );
}

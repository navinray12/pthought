export type Doctor = {
  id: string,
  name: string,
  specialty: string,
  email?: string,
  phone?: string,
  workingHours: {
    [day: string]: {
      start: string,
      end: string,
    };
  };
};

export type AppointmentStatus = "scheduled" | "completed" | "canceled" | "no-show";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  type: AppointmentType;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;      
  dateOfBirth: string;
};
export type AppointmentType =
  | "checkup"
  | "consultation"
  | "surgery"
  | "follow-up"
  | "emergency"
  | "procedure";
export type AppointmentSlot = {
  apt: Appointment,
  top: number,
  height: number,
  dayIndex: number,
  start: Date,
  end: Date,
  leftRatio?: number,
  widthRatio?: number,
};


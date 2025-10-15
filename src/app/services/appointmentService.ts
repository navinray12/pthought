// services/appointmentService.ts
import { Appointment } from "../types";
import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_APPOINTMENTS } from "../data/mockData"; 
import { isSameDay, parseISO } from "date-fns";
export class AppointmentService {
    static getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    const pickups = MOCK_APPOINTMENTS.filter(apt => {
      if (apt.doctorId !== doctorId) return false;
      const aptStart = typeof apt.startTime === "string" ? parseISO(apt.startTime) : new Date(apt.startTime);
      return isSameDay(aptStart, date);
    });
    pickups.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return pickups;
  }
  static getAppointmentsByDoctorAndRange(doctorId: string, startDate: Date, endDate: Date): Appointment[] {
    const start = startDate.setHours(0,0,0,0);
    const end = endDate.setHours(23,59,59,999);
    return MOCK_APPOINTMENTS.filter(apt => {
      if (apt.doctorId !== doctorId) return false;
      const s = new Date(apt.startTime).getTime();
      return s >= start && s <= end;
    }).sort((a,b)=>new Date(a.startTime).getTime()-new Date(b.startTime).getTime());
  }
  static listDoctors() {
    return MOCK_DOCTORS;
  }
  static listPatients() {
    return MOCK_PATIENTS;
  }
}
export default AppointmentService;

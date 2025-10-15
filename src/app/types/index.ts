export type Doctor = {
  id: string,
  name: string,
  specialty: string,
  workingHours: {
    [day: string]: {
      start: string,
      end: string,
    };
  };
};

export type Appointment = {
  id: string,
  doctorId: string,
  patientName: string,
  startTime: string,
  endTime: string,
  notes?: string,
};

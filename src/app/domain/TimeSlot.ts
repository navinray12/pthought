export class TimeSlot {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date) {
    this.start = start;
    this.end = end;
  }
  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end;
  }
  durationMinutes(): number {
    return Math.round((this.end.getTime() - this.start.getTime()) / 60000);
  }
}

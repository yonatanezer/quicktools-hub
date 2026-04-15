export type SLAConfig = {
  workingDays: number[];
  workingHours: { start: string; end: string } | null;
  holidays: string[];
};

const MS_PER_MINUTE = 60_000;

function parseHHMM(value: string): { hours: number; minutes: number } | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function dayWindow(date: Date, config: SLAConfig): { start: Date; end: Date } | null {
  if (!isWorkingDay(date, config)) return null;

  if (!config.workingHours) {
    const dayStart = startOfDay(date);
    return { start: dayStart, end: new Date(dayStart.getTime() + 24 * 60 * MS_PER_MINUTE) };
  }

  const startTime = parseHHMM(config.workingHours.start);
  const endTime = parseHHMM(config.workingHours.end);
  if (!startTime || !endTime) return null;

  const dayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    startTime.hours,
    startTime.minutes,
    0,
    0
  );
  const dayEnd = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    endTime.hours,
    endTime.minutes,
    0,
    0
  );

  if (dayEnd <= dayStart) return null;
  return { start: dayStart, end: dayEnd };
}

function moveToNextWorkingWindowStart(date: Date, config: SLAConfig): Date {
  let cursor = new Date(date);
  for (let i = 0; i < 370; i += 1) {
    const window = dayWindow(cursor, config);
    if (window) {
      if (cursor < window.start) return window.start;
      if (cursor >= window.start && cursor < window.end) return cursor;
    }
    const nextDay = startOfDay(cursor);
    nextDay.setDate(nextDay.getDate() + 1);
    cursor = nextDay;
  }
  return new Date(date);
}

export function isWorkingDay(date: Date, config: SLAConfig): boolean {
  const weekday = date.getDay();
  if (!config.workingDays.includes(weekday)) return false;
  return !config.holidays.includes(localDateKey(date));
}

export function isWorkingHour(date: Date, config: SLAConfig): boolean {
  const window = dayWindow(date, config);
  if (!window) return false;
  return date >= window.start && date < window.end;
}

export function addBusinessTime(start: Date, durationMinutes: number, config: SLAConfig): Date {
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) return new Date(start);

  let remaining = Math.floor(durationMinutes);
  let cursor = new Date(start);

  while (remaining > 0) {
    cursor = moveToNextWorkingWindowStart(cursor, config);
    const window = dayWindow(cursor, config);
    if (!window) break;

    if (cursor < window.start) cursor = window.start;
    if (cursor >= window.end) {
      cursor = new Date(startOfDay(cursor).getTime() + 24 * 60 * MS_PER_MINUTE);
      continue;
    }

    const available = Math.floor((window.end.getTime() - cursor.getTime()) / MS_PER_MINUTE);
    if (available <= 0) {
      cursor = new Date(startOfDay(cursor).getTime() + 24 * 60 * MS_PER_MINUTE);
      continue;
    }

    const consumed = Math.min(remaining, available);
    cursor = new Date(cursor.getTime() + consumed * MS_PER_MINUTE);
    remaining -= consumed;
  }

  return cursor;
}

export function diffBusinessTime(start: Date, end: Date, config: SLAConfig): number {
  if (end.getTime() === start.getTime()) return 0;
  if (end < start) return -diffBusinessTime(end, start, config);

  let cursor = new Date(start);
  let totalMinutes = 0;

  while (cursor < end) {
    cursor = moveToNextWorkingWindowStart(cursor, config);
    if (cursor >= end) break;

    const window = dayWindow(cursor, config);
    if (!window) break;

    const segmentStart = cursor < window.start ? window.start : cursor;
    const segmentEnd = end < window.end ? end : window.end;

    if (segmentEnd > segmentStart) {
      totalMinutes += Math.floor((segmentEnd.getTime() - segmentStart.getTime()) / MS_PER_MINUTE);
    }

    cursor = segmentEnd >= window.end ? window.end : segmentEnd;
    if (cursor >= window.end) {
      cursor = new Date(startOfDay(cursor).getTime() + 24 * 60 * MS_PER_MINUTE);
    }
  }

  return totalMinutes;
}

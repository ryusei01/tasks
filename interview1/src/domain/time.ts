const HOUR = 60 * 60 * 1000;

export function dateKey(ms: number): string {
  const d = new Date(ms);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function previousDateKey(key: string): string {
  return shiftDateKey(key, -1);
}

export function nextDateKey(key: string): string {
  return shiftDateKey(key, 1);
}

function shiftDateKey(key: string, days: number): string {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return dateKey(date.getTime());
}

export function isNight(ms: number): boolean {
  const hour = new Date(ms).getHours();
  return hour >= 21 || hour < 5;
}

export function isEarly(completedAt: number, dueAt: number | null): boolean {
  if (dueAt == null) return false;
  return completedAt <= dueAt - 3 * HOUR;
}

export function isLastMinute(completedAt: number, dueAt: number | null): boolean {
  if (dueAt == null) return false;
  if (isEarly(completedAt, dueAt)) return false;
  return completedAt >= dueAt - HOUR && completedAt <= dueAt;
}

export function formatWhen(ms: number): string {
  const d = new Date(ms);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hour}:${minute}`;
}

export function atLocal(year: number, month: number, day: number, hour: number, minute = 0): number {
  return new Date(year, month - 1, day, hour, minute, 0, 0).getTime();
}

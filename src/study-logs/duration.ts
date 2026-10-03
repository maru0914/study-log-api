export function durationMinutes(start: string, end: string): number {
  return toMinutes(end) - toMinutes(start);
}

// '10:00'のような時刻を、0:00からの分に直す
function toMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

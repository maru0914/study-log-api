export function monthRange(yearMonth: string): { from: Date; to: Date } {
  const year = Number(yearMonth.slice(0, 4));
  const month = Number(yearMonth.slice(4, 6)); // 1〜12

  return {
    // Date.UTC の月は 0 から数える（0 が1月）
    from: new Date(Date.UTC(year, month - 1, 1)), // その月の1日
    to: new Date(Date.UTC(year, month, 1)), // 翌月の1日
  };
}

export function currentYearMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}${month}`;
}

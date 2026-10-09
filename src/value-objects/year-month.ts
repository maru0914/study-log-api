export class YearMonth {
  // ①値を受け取って、形を確かめる
  private constructor(private readonly value: string) {
    if (!/^\d{4}(0[1-9]|1[0-2])$/.test(value)) {
      throw new Error('Invalid YearMonth format. Expected YYYYMM.');
    }
  }

  // ②作り方を決める
  static fromString(yearMonth: string): YearMonth {
    return new YearMonth(yearMonth);
  }

  static fromDate(date: Date): YearMonth {
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    return new YearMonth(`${date.getUTCFullYear()}${month}`);
  }
  static current(): YearMonth {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return new YearMonth(`${now.getFullYear()}${month}`);
  }

  // ③ 中身を読む
  getYear(): number {
    return Number(this.value.slice(0, 4));
  }

  getMonth(): number {
    return Number(this.value.slice(4, 6));
  }

  toString(): string {
    return this.value;
  }

  // ④ 日付にする・月を動かす
  toDate(): Date {
    return new Date(Date.UTC(this.getYear(), this.getMonth() - 1, 1));
  }

  previous(): YearMonth {
    return YearMonth.fromDate(
      new Date(Date.UTC(this.getYear(), this.getMonth() - 2, 1)),
    );
  }

  next(): YearMonth {
    return YearMonth.fromDate(
      new Date(Date.UTC(this.getYear(), this.getMonth(), 1)),
    );
  }
}

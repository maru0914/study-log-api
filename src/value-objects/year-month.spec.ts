import { YearMonth } from './year-month.js';

describe('YearMonth', () => {
  it("fromString('202610')のyearが2026、monthが10", () => {
    const ym = YearMonth.fromString('202610');
    expect(ym.getYear()).toBe(2026);
    expect(ym.getMonth()).toBe(10);
  });

  it("'202613' や '2021-01' は throw する", () => {
    const message = 'Invalid YearMonth format. Expected YYYYMM.';
    expect(() => YearMonth.fromString('202613')).toThrow(message);
    expect(() => YearMonth.fromString('2021-01')).toThrow(message);
  });

  it("'202601' の previous() は '202512'（年をまたぐ）", () => {
    expect(YearMonth.fromString('202601').previous().toString()).toBe('202512');
  });
});

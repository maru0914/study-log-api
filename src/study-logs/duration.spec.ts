import './duration.js';
import { durationMinutes } from './duration.js';

describe('durationMinutes', () => {
  it('10:00 から 11:30 は 90 分', () => {
    expect(durationMinutes('10:00', '11:30')).toBe(90);
  });
  it('10:00 から 10:50 は 50 分', () => {
    expect(durationMinutes('10:00', '10:50')).toBe(50);
  });
});

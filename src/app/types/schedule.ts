export interface Schedule {
  id: string;
  actionGroupId: string;

  hours: number;
  minutes: number;
  days: number[]; // 0 to 6 (sun = 0...)
}


/**
* Homeflow Technologies | ShiftEntity.
*
* @property nama_shift
* @property public_day_off
*
* @create ShiftEntity
*/

import { JadwalShiftEntity } from "./JadwalShift.entity";

export interface ShiftEntity {
  id: number;
  nama_shift: string;
  public_day_off: boolean | string;
  jadwal_shifts: Array<JadwalShiftEntity>
  
}


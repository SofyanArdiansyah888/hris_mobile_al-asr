
/**
* Homeflow Technologies | ScheduleKaryawanEntity.
*
* @property karyawan_id
* @property tanggal
* @property hari
* @property masuk
* @property keluar
* @property toleransi
* @property periode_istirahat
*
* @create ScheduleKaryawanEntity
*/

import { KaryawanEntity } from "./Karyawan.entity";

export interface ScheduleKaryawanEntity {
  id: number;
  karyawan_id: number;
  karyawan: KaryawanEntity;
  masuk: string;
  keluar: string;
  tanggal: string;
  hari: string;
  toleransi: number;
  periode_istirahat: number;
}


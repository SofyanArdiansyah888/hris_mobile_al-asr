
/**
* Homeflow Technologies | JadwalShiftEntity.
*
* @property masuk
* @property hari
* @property keluar
* @property toleransi
* @property istirahat
* @property periode_istirahat
* @property waktu_kerja
* @property shift_id
*
* @create JadwalShiftEntity
*/

export interface JadwalShiftEntity {
  hari: string;
  toleransi: number;
  periode_istirahat: number;
  waktu_kerja: number;
  shift_id: number;
  selected: number
}


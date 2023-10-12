/**
 * Homeflow Technologies | IzinEntity.
 *
 * @property karyawan_id
 * @property karyawan
 * @property izin_id
 * @property izin
 * @property sisa_quota
 * @property periode_tahun
 *
 * @create KaryawanIzinEntity
 */

import { IzinEntity } from "./Izin.entity";
import { KaryawanEntity } from "./Karyawan.entity";

export interface IzinKaryawanEntity {
  karyawan_id: number;
  karyawan: KaryawanEntity;
  izin_id: number;
  izin: IzinEntity;
  sisa_quota: number;
  periode_tahun: number;
}

/**
 * Homeflow Technologies | RiwayatIzinEntity.
 *
 * @property izin_id
 * @property karyawan_id
 * @property status
 *
 * @create RiwayatIzinEntity
 */

import { IzinEntity } from "./Izin.entity";
import { KaryawanEntity } from "./Karyawan.entity";

export interface RiwayatIzinEntity {
  id: string;
  izin_id: number;
  izin: IzinEntity;
  karyawan_id: number;
  status: string;
  karyawan: KaryawanEntity;
  telepon: string;
  keterangan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  nama_file: string;
  jumlah_hari: string;
}

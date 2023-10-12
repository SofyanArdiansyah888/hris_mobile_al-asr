
/**
* Homeflow Technologies | RiwayatPenggajianEntity.
*
* @property karyawan_id
* @property total_tunjangan
* @property total_potongan
* @property detail_tunjangan
* @property detail_potongan
* @property gaji_pokok
* @property total_gaji
* @property periode
*
* @create RiwayatPenggajianEntity
*/

import { KaryawanEntity } from "./Karyawan.entity";
import { PotonganEntity } from "./Potongan.entity";
import { TunjanganEntity } from "./Tunjangan.entity";

export interface RiwayatPenggajianEntity {
  id:number;
  karyawan_id: number;
  karyawan: KaryawanEntity
  total_tunjangan: number
  total_potongan: number;
  gaji_pokok: number;
  total_gaji: number;
  periode: string;
  detail_tunjangan: TunjanganEntity[];
  detail_potongan: PotonganEntity[];
}


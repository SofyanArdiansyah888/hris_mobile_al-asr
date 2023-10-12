
/**
* Homeflow Technologies | PendidikanKaryawanEntity.
*
* @property jenjang
* @property nama_sekolah
* @property tahun_masuk
* @property tahun_keluar
* @property karyawan_id
*
* @create PendidikanKaryawanEntity
*/

export interface PendidikanKaryawanEntity {
  id: number;
  jenjang: string;
  nama_sekolah: string;
  karyawan_id: number;
  tahun_masuk: number;
  tahun_keluar: number;
}


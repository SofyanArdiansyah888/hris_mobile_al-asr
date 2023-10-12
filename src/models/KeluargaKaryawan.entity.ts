
/**
* Homeflow Technologies | KeluargaKaryawanEntity.
*
* @property nama
* @property tempat_lahir
* @property tanggal_lahir
* @property status_keluarga
* @property anak_ke
* @property karyawan_id
*
* @create KeluargaKaryawanEntity
*/

export interface KeluargaKaryawanEntity {
  id: number;
  nama: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  anak_ke: number;
  karyawan_id: number;
  status_keluarga: 'anak' | 'suami / istri'
}


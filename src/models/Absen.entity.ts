
/**
* Homeflow Technologies | AbsenEntity.
*
* @property karyawan_id
* @property waktu_masuk
* @property waktu_keluar
* @property tanggal
* @property jumlah_telat
* @property jumlah_lembur
*
* @create AbsenEntity
*/

export interface AbsenEntity {
    id: number;
    karyawan_id: number;
    tanggal: string;
    jumlah_telat: number;
    jumlah_lembur: number;
    waktu_masuk: string;
    waktu_keluar: string;
  }
  
  
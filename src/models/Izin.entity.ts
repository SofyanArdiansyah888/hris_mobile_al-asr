
/**
* Homeflow Technologies | IzinEntity.
*
* @property nama_izin
* @property regulasi
* @property durasi
* @property quota
* @property upload_file
*
* @create IzinEntity
*/

export interface IzinEntity {
  id: number;
  nama_izin: string;
  regulasi : 'dibayar' | 'tidak dibayar'
  quota: number;
  durasi: 'half day' | 'full day';
  upload_file: 'mandatory' | 'optional';
  jenis_izin: 'izin' | 'cuti'
}



/**
* Homeflow Technologies | CutiEntity.
*
* @property nama_cuti
* @property regulasi
* @property quota
* @property tipe
* @property upload_file
*
* @create CutiEntity
*/

export interface CutiEntity {
  id: number;
  nama_cuti: string;
  regulasi : 'dibayar' | 'tidak dibayar'
  quota: number;
  tipe: 'hari' | 'hari kantor'
  upload_file: 'mandatory' | 'optional';
} 



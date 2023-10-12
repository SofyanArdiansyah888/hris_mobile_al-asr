
/**
* Homeflow Technologies | PotonganEntity.
*
* @property nama_potongan
* @property nominal_bawaan
* @property permanent
* @property tanggal_awal_potongan
* @property tanggal_akhir_potongan
*
* @create PotonganEntity
*/

export interface PotonganEntity {
  id: number;
  nama_potongan: string;
  nominal_bawaan: string;
  nominal: string;
  permanent: number;
  tanggal_awal_potongan: string;
  tanggal_akhir_potongan: string;
}


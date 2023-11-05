

export interface UserEntity {
  id_pegawai: number;
  nama_lengkap: string;
  username: string;
  role_id: string;
  umur: string;
  image: string;
  qr_code_image: string;
  kode_pegawai: string;
  instansi: string;
  jabatan: string;
  npwp: string;
  tgl_lahir: string;
  tempat_lahir: string;
  jenis_kelamin: string;
  setting: {
    latitude: number;
    longitude: number;
    radius: number
  }
}


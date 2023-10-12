/**
 * Homeflow Technologies | KaryawanEntity.
 *
 * @property nama_lengkap
 * @property tempat_lahir
 * @property tanggal_lahir
 * @property jenis_kelamin
 * @property status_pernikahan
 * @property jumlah_anak
 * @property golongan_darah
 * @property agama
 * @property tanggal_bergabung
 * @property pendidikan_terakhir
 * @property nik
 * @property nip
 * @property npwp
 * @property user_id
 * @property jabatan_id
 * @property role_id
 * @property atasan_id
 * @property telepon
 * @property email
 * @property alamat_lengkap
 * @property status_karyawan
 * @property foto
 * @property divisi_id
 * @property departemen_id
 * @property gaji_pokok
 * @property nama_bank
 * @property nomor_rekening
 * @property nama_pemilik_rekening
 * @property shift_id
 *
 * @create KaryawanEntity
 */

import { DepartemenEntity } from "./Departemen.entity";
import { DivisiEntity } from "./Divisi.entity";
import { DokumenKaryawanEntity } from "./DokumenKaryawan.entity";
import { JabatanEntity } from "./Jabatan.entity";
import { KeluargaKaryawanEntity } from "./KeluargaKaryawan.entity";
import { PendidikanKaryawanEntity } from "./PendidikanKaryawan.entity";
import { RiwayatTrainingKaryawanEntity } from "./RiwayatTrainingKaryawan.entity";
import { ShiftEntity } from "./Shift.entity";
import { UserEntity } from "./User.entity";

export interface KaryawanEntity {
  id: number;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jumlah_anak: number;
  tanggal_bergabung: string;
  nik: string;
  nip: string;
  npwp: string;
  user_id: number;
  user: UserEntity;
  jabatan_id: number;
  jabatan?: JabatanEntity;
  departemen?: DepartemenEntity;
  divisi?: DivisiEntity;
  role_id: number | string;
  atasan_id: number;
  telepon: string;
  email: string;
  alamat_lengkap: string;
  foto: string;
  divisi_id: number;
  departemen_id: number;
  nama_bank: string;
  nama_pemilik_rekening: string;
  shift_id: number;
  agama: string;
  nomor_rekening:string;
  jenis_kelamin: "laki-laki" | "perempuan";
  status_karyawan: "aktif" | "tidak aktif";
  status_pernikahan: "menikah" | "belum menikah";
  golongan_darah: "a" | "b" | "ab" | "o";
  pendidikan_terakhir: string;
  atasan: KaryawanEntity;
  shift: ShiftEntity;
  pendidikan_karyawans: PendidikanKaryawanEntity[];
  riwayat_training_karyawans: RiwayatTrainingKaryawanEntity[];
  keluarga_karyawans: KeluargaKaryawanEntity[];
  dokumen_karyawans: DokumenKaryawanEntity[];
}

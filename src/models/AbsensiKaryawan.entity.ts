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
import { KaryawanEntity } from "./Karyawan.entity";
import { KeluargaKaryawanEntity } from "./KeluargaKaryawan.entity";
import { PendidikanKaryawanEntity } from "./PendidikanKaryawan.entity";
import { RiwayatTrainingKaryawanEntity } from "./RiwayatTrainingKaryawan.entity";
import { ShiftEntity } from "./Shift.entity";
import { UserEntity } from "./User.entity";

export interface AbsensiKaryawanEntity extends KaryawanEntity {
  hadir: number;
  tidak_hadir: number;
  telat: number;
}

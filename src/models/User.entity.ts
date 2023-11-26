import {SettingEntity} from "./Setting.entity";
import {JadwalEntitiy} from "./Jadwal.entitiy";
import {CabangEntity} from "./Cabang.entity";


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
    setting: SettingEntity
    jadwal: JadwalEntitiy;
    cabang: CabangEntity;

}


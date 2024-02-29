import {create} from 'zustand';

interface IPayload {
    foto: string,
    tipe: string,
    map_absen: string,
    nama_pegawai: string,
    kode_pegawai: string,
    keterangan: string,
    alasan: string
}

interface IUsePresensiFormStore {
    payload: IPayload,
    setPayload: (input: IPayload) => void
}


const usePresensiFormStore = create<IUsePresensiFormStore>((set) => ({
    payload: {
        foto: "",
        tipe: "",
        map_absen: "",
        nama_pegawai: "",
        kode_pegawai: "",
        keterangan: "",
        alasan: ""
    },
    setPayload: (input) => set({
        payload: {
            ...input
            // latitude: input.latitude, longitude: input.longitude
        }
    }),
}));

export default usePresensiFormStore

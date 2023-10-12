import {create} from 'zustand';
import { PendidikanKaryawanEntity } from '../models/PendidikanKaryawan.entity';

interface ISelectedPendidikan {
    selected: PendidikanKaryawanEntity | undefined,
    setSelectedPendidikan: (input: PendidikanKaryawanEntity) => void
}


export const useSelectPendidikanStore = create<ISelectedPendidikan>((set) => ({
    selected: undefined,
    setSelectedPendidikan: (input) => set((state) => ({ selected: input})),
  }))
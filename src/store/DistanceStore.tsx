import {create} from 'zustand';


interface IDistance {
    distance: number 
    setDistance: (input: number) => void
}


export const useDistanceStore = create<IDistance>((set) => ({
    distance: 9999,
    setDistance: (input) => set((state) => ({ distance: input})),
  }))
import {create} from 'zustand';


interface IDistance {
    latLng: {
        latitude: number,
        longitude: number
    },
    setLocation: (input: { latitude: number, longitude: number }) => void
}


const useLocationStore = create<IDistance>((set) => ({
    latLng: {
        latitude: 0,
        longitude: 0,
    },
    setLocation: (input) => set({latLng: {latitude: input.latitude, longitude: input.longitude}}),
}));

export default  useLocationStore

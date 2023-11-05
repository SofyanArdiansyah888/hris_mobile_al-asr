import {create} from 'zustand';


interface IDistance {
    latLng: {
        latitude: number,
        longitude: number,
        radius: number
    },
    setLocation: (input: { latitude: number, longitude: number,radius: number }) => void
}


const usePesantrenLocationStore = create<IDistance>((set) => ({
    latLng: {
        latitude: -5.195352877950009,
        longitude: 119.43194099143338,
        radius: 100
    },
    setLocation: (input) => set({latLng: {latitude: input.latitude, longitude: input.longitude,radius: input.radius}}),
}));

export default  usePesantrenLocationStore

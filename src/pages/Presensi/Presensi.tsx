import {IonPage} from "@ionic/react";
import {CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import {LatLngExpression} from "leaflet";
import {LogInIcon, LogOutIcon} from "lucide-react";
import {useDistanceStore} from "../../store/DistanceStore";
import useLocationStore from "../../store/LocationStore";
import {useEffect, useState} from "react";
import NotifAlert from "../../components/NotifAlert";


export const PESANTREN_LOCATION = {
    latitude: -5.195352877950009,
    longitude: 119.43194099143338
};
const Presensi = () => {
    const [errorMessage, setErrorMessage] = useState<string>(
        "Gagal Melakukan Absen"
    );
    const [dangerAlert, setDangerAlert] = useState(false);

    const {latitude: pesantrenLatitude, longitude: pesantrenLongitude} = PESANTREN_LOCATION
    const {latLng: {latitude, longitude}} = useLocationStore()
    const {distance} = useDistanceStore()

    const handleAbsenDatang = () => {
        if (distance >= 100) {
            setErrorMessage("Anda belum berada di radius absensi");
            setDangerAlert(true);
        } else {
            // mutate({});
        }
    };

    const handleAbsenPulang = () => {
        if (distance >= 100) {
            setErrorMessage("Anda belum berada di radius absensi");
            setDangerAlert(true);
        } else {
            // mutate({});
        }
    };

    return <IonPage>
        <MapContainer center={[latitude, longitude]}
                      zoom={19}
                      scrollWheelZoom={false}
                      style={{
                          width: "100%",
                          height: '100vh'
                      }}

        >

            <ComponentResize lat={latitude} lng={longitude}/>
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                position={[latitude, longitude]}
            >
                <Popup>
                    Posisi Kamu :D
                </Popup>
            </Marker>


            <CircleMarker center={[pesantrenLatitude, pesantrenLongitude]} pathOptions={{color: "red"}} radius={100}>
                <Popup>Pondok Pesantren Al-Asr Makassar</Popup>
            </CircleMarker>

        </MapContainer>
        <button className={"btn  absolute bottom-6 right-6 z-[999] flex items-center gap-3"}
                onClick={handleAbsenPulang}>
            Pulang
            <LogOutIcon className={"h-4 w-4"}/>
        </button>
        <button className={"btn !bg-primary !border-primary absolute bottom-6 left-6 z-[999] flex items-center gap-3"}
                onClick={handleAbsenDatang}>
            <LogInIcon className={"h-4 w-4"}/>
            Datang
        </button>
        <NotifAlert
            isOpen={dangerAlert}
            handleCancel={() => setDangerAlert(false)}
            message={errorMessage}
            type="danger"
            setIsOpen={setDangerAlert}
        />
    </IonPage>
}

const ComponentResize = ({lat, lng}: { lat: number, lng: number }) => {
    const map = useMap()
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    setTimeout(() => {
        map.invalidateSize()
    }, 200)

    return null
}

export default Presensi;

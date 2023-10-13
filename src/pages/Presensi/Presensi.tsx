import {IonPage} from "@ionic/react";
import {CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import {LatLngExpression} from "leaflet";
import {LogInIcon, LogOutIcon} from "lucide-react";


const location: LatLngExpression = [-5.195352877950009, 119.43194099143338];
const Presensi = () => {
    return <IonPage>
        <MapContainer center={location}
                      zoom={19}
                      scrollWheelZoom={false}
                      style={{
                          width: "100%",
                          height: '100vh'
                      }}>
            <ComponentResize/>
            <TileLayer
                attribution=''
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                position={location}
            >
                <Popup>
                    Pondok Pesantren Al-Asr Makassar
                </Popup>
            </Marker>


            <CircleMarker center={location} pathOptions={{color: "red"}} radius={100}>
                <Popup>Popup in CircleMarker</Popup>
            </CircleMarker>

        </MapContainer>
        <button className={"btn  absolute bottom-6 right-6 z-[999] flex items-center gap-3"}>
            Pulang
            <LogOutIcon className={"h-4 w-4"}/>
        </button>
        <button className={"btn !bg-primary !border-primary absolute bottom-6 left-6 z-[999] flex items-center gap-3"}>
            <LogInIcon className={"h-4 w-4"}/>
            Datang
        </button>
    </IonPage>
}

const ComponentResize = () => {
    const map = useMap()

    setTimeout(() => {
        map.invalidateSize()
    }, 200)

    return null
}

export default Presensi;

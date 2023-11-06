import {IonPage} from "@ionic/react";
import {Circle, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import {LogInIcon, LogOutIcon} from "lucide-react";
import useLocationStore from "../../store/LocationStore";
import {useEffect, useState} from "react";
import NotifAlert from "../../components/NotifAlert";
import PresensiModal from "./PresensiModal";
import {useGet} from "../../hooks/useApi";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import usePesantrenLocationStore from "../../store/usePesantrenLocationStore";


const Presensi = () => {
    const [dangerAlert, setDangerAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    const {latLng: {longitude: pesantrenLongitude, latitude: pesantrenLatitude, radius}} = usePesantrenLocationStore()
    const {latLng: {latitude, longitude}} = useLocationStore()
    const [user] = useLocalStorage("user")
    const [absensi, setAbsensi] = useState<{ tipe: string, isShown: boolean }>({
        tipe: 'datang',
        isShown: false
    });
    const {data: payloadCheckAbsen} = useGet<
        { message: string, isAbsenDatang: boolean }
    >({
        name: "check-absen",
        endpoint: `user/${user?.kode_pegawai}/check-absen`,
    });

    return <IonPage>
        <MapContainer center={[latitude, longitude]}
                      zoom={19}
                      minZoom={13}
                      scrollWheelZoom={false}
                      style={{
                          width: "100%",
                          height: '100vh'
                      }}

        >
            <LayersControl>
                <LayersControl.Overlay checked name="Your Position">
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
                </LayersControl.Overlay>

                <LayersControl.Overlay checked name="Marker with popup">
                    <Circle center={[pesantrenLatitude, pesantrenLongitude]} pathOptions={{color: "red"}}
                            radius={radius}>
                        <Popup>Pondok Pesantren Al-Asr Makassar</Popup>
                    </Circle>
                </LayersControl.Overlay>

            </LayersControl>

        </MapContainer>
        <button className={"btn  absolute bottom-6 right-6 z-[999] !border-none flex items-center gap-3"}
                onClick={() => setAbsensi({
                    tipe: 'pulang',
                    isShown: true
                })}
                disabled={payloadCheckAbsen && payloadCheckAbsen.isAbsenDatang === false}
        >
            Pulang
            <LogOutIcon className={"h-4 w-4"}/>
        </button>
        <button className={"btn !bg-primary !border-primary absolute bottom-6 left-6 z-[999] flex items-center gap-3"}
                onClick={() => setAbsensi({
                    tipe: 'datang',
                    isShown: true
                })}
                disabled={payloadCheckAbsen && payloadCheckAbsen.isAbsenDatang === true}
        >
            <LogInIcon className={"h-4 w-4"}/>
            Datang
        </button>
        <NotifAlert
            isOpen={dangerAlert}
            handleCancel={() => setDangerAlert(false)}
            message={"Gagal Melakukan Presensi"}
            type="danger"
            setIsOpen={setDangerAlert}
        />
        <NotifAlert
            isOpen={successAlert}
            handleCancel={() => setSuccessAlert(false)}
            message={"Berhasil Melakukan Presensi"}
            type="success"
            setIsOpen={setSuccessAlert}
        />
        <PresensiModal
            absen={absensi}
            setAbsensi={setAbsensi}
            setDangerAlert={setDangerAlert}
            setSuccessAlert={setSuccessAlert}
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

import {IonContent, IonPage, IonRefresher, IonRefresherContent,} from "@ionic/react";
import moment from "moment";
import {useEffect, useState} from "react";
import "../../src/index.css";
import Loading from "../components/Loading";
import {useGet} from "../hooks/useApi";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {GetDetailPayload} from "../models/GenericPayload";
import {Capacitor} from "@capacitor/core";
import {UserEntity} from "../models/User.entity";

const Tab1: React.FC = () => {
    const [imageProfil, setImageProfil] = useState<string>(
        "assets/logo-icon.png"
    );
    const [user] = useLocalStorage("user");

    const [time, setTime] = useState<string>();

    const {data, isFetching, refetch} = useGet<
        GetDetailPayload<UserEntity>
    >({
        name: "user",
        endpoint: `user/${user?.id_pegawai}/profil`,
    });

    const {data: payloadCheckAbsen, refetch: refetchCheckAbsent} = useGet<
        { message: string }
    >({
        name: "check-absen",
        endpoint: `user/${user?.kode_pegawai}/check-absen`,
    });

    useEffect(() => {
        if (data) {
            let fotoUrl = "assets/logo-icon.png";

            if (!(data.data.image === null || data.data.image === "")) {
                fotoUrl = `${process.env.REACT_APP_BASIC_URL}storage/profile/${data.data.image}`;
            }
            console.log(fotoUrl, 'fotourl')
            setTimeout(() => {
                setImageProfil(fotoUrl);
            }, 300);
        }
    }, [data]);

    useEffect(() => {
        setTime(moment().format("DD MMM YYYY, HH:mm"));
        setInterval(() => setTime(moment().format("DD MMM YYYY, HH:mm")), 5000);
    }, []);


    return (
        <IonPage>
            <IonContent scrollY={true} className={`${Capacitor.getPlatform() === 'ios' ? "pt-16" : ""}`}>
                <IonRefresher
                    slot="fixed"
                    onIonRefresh={(e) => {
                        refetch();
                        refetchCheckAbsent();
                        e.detail.complete();
                    }}
                >
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                {isFetching ? (<div className="h-[100vh] flex items-center justify-center mt-[-45px]">
                        <Loading/>
                    </div>
                ) : (
                    <>
                        <div className="px-6 pt-12 text-2xl  text-center font-semibold">Pesantren
                            <br/>
                            <span className={"text-accent"}>
              Al-Asr Makassar
              </span>

                        </div>
                        <div className="flex flex-col h-[75vh] justify-center">
                            <div className="flex flex-col pt-6 px-6 items-center w-full gap-4">
                                <img
                                    src={imageProfil}
                                    alt="Gambar Profil"
                                    onError={() => setImageProfil("assets/logo.png")}
                                    className={`w-48 h-48 rounded-full border-2 border-zinc-50 object-cover ${
                                        imageProfil === "assets/logo-icon.png"
                                            ? "animate-pulse"
                                            : ""
                                    }`}
                                ></img>
                                {/* </div> */}
                                {/* HEADER TEXT */}
                                <div className="text-center">
                                    {/* <h4 className="text-sm text-slate-500 my-0">Welcome Back,</h4> */}
                                    <h1 className="text-xl mt-1 mb-0 font-semibold">
                                        {data?.data.nama_lengkap}
                                    </h1>
                                    <h4 className="text-sm text-slate-500 mt-1">{time}</h4>
                                </div>
                            </div>
                            {
                                payloadCheckAbsen?.message &&
                                <div className="mt-12 mx-auto text-center h-24">
                                    <div className="rounded-xl px-2 py-2 w-48 text-sm">
                                        {payloadCheckAbsen?.message?.substring(0, payloadCheckAbsen?.message?.length - 3)} &nbsp;
                                    </div>
                                </div>
                            }

                        </div>
                    </>
                )}
            </IonContent>

        </IonPage>
    );
};

export default Tab1;

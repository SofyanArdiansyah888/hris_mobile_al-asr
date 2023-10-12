import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { Fingerprint } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import "../../src/index.css";
import Loading from "../components/Loading";
import NotifAlert from "../components/NotifAlert";
import { useGet, usePut } from "../hooks/useApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { GetDetailPayload } from "../models/GenericPayload";
import { KaryawanEntity } from "../models/Karyawan.entity";
import { useDistanceStore } from "../store/DistanceStore";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
const Tab1: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>(
    "Gagal Melakukan Absen"
  );
  const [successMessage, setSuccessMessage] = useState<string>(
    "Anda Berhasil Melakukan Absensi"
  );
  const distance = useDistanceStore((state) => state.distance);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [imageProfil, setImageProfil] = useState<string>(
    "assets/logo-icon.png"
  );
  const [isAbsenSuccess, setIsAbsenSuccess] = useState(false);
  const [user] = useLocalStorage("user");
  const [time, setTime] = useState<string>();

  const { data, isFetching, refetch } = useGet<
    GetDetailPayload<KaryawanEntity>
  >({
    name: "karyawan",
    endpoint: `karyawans/${user?.karyawan?.id}`,
  });

  const { data: payloadCheckAbsen, refetch: refetchCheckAbsent } = useGet<
    GetDetailPayload<{ message: string }>
  >({
    name: "check-absen",
    endpoint: `karyawans/${user?.karyawan?.id}/check-absen`,
  });

  useEffect(() => {
    if (isAbsenSuccess) {
      setTimeout(() => {
        setIsAbsenSuccess(false);
      }, 2000);
    }
  }, [isAbsenSuccess]);

  useEffect(() => {
    if (data) {
      let fotoUrl = "assets/logo-icon.png";

      if (!(data.data.foto === null || data.data.foto === "")) {
        fotoUrl = data.data.foto;
      }

      setTimeout(() => {
        setImageProfil(fotoUrl);
      }, 300);
    }
  }, [data]);

  const { mutate, isLoading: isAbsenLoading } = usePut({
    name: "check-absen",
    endpoint: `karyawans/${user?.karyawan.id}/absen`,
    onSuccessCallback: (data: any) => {
      setSuccessMessage(data?.message);
      setIsAbsenSuccess(true);
    },
    onErrorCallback: (error: any) => {
      if (error?.response?.status === 422) {
        setErrorMessage(error.response?.data.message);
      }
      setDangerAlert(true);
    },
  });

  useEffect(() => {
    setTime(moment().format("DD MMM YYYY, HH:mm"));
    setInterval(() => setTime(moment().format("DD MMM YYYY, HH:mm")), 5000);
  }, []);

  const handleAbsen = () => {
    if (distance >= 100) {
      setErrorMessage("Anda belum berada di radius absensi");
      setDangerAlert(true);
    } else {
      mutate({});
    }
  };
  
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
          <Loading />
          </div>
        ) : (
          <>
            <div className="px-6 pt-20 text-2xl  text-center">HRIS NOBEL</div>
            <div className="flex flex-col h-[75vh] justify-center">
              <div className="flex flex-col pt-6 px-6 items-center w-full gap-4">
                {/* <div className="bg-slate-300 w-48 h-48 rounded-full border-4 border-slate-900"> */}
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

              {!isAbsenSuccess ? (
                <button
                  className={`mx-auto mt-12  rounded-full w-24 h-24 justify-center flex items-center
                      px-5 py-2    cursor-pointer
                      ${distance <= 100 ? "bg-[#1f1d42]" : "bg-gray-500"}`}
                  disabled={isAbsenLoading}
                  onClick={handleAbsen}
                >
                  <Fingerprint className="w-16 h-16 text-white " />
                </button>
              ) : (
                <div className="mt-12 mx-auto text-center h-24">
                  <div className=" bg-red-600 text-white  rounded-xl px-2 py-2 w-48 text-sm">
                    {successMessage}
                  </div>
                </div>
              )}

            {
              payloadCheckAbsen?.data.message && 
              <div className="mt-12 mx-auto text-center h-24">
              <div className="rounded-xl px-2 py-2 w-48 text-sm">
                 { payloadCheckAbsen?.data?.message?.substring(0,payloadCheckAbsen?.data?.message?.length-3)}
              </div>
            </div>
            }

            </div>
          </>
        )}
      </IonContent>

      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message={errorMessage}
        type="danger"
        setIsOpen={setDangerAlert}
      />
    </IonPage>
  );
};

export default Tab1;

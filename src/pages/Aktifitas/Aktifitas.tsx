import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
  BsList
} from "react-icons/bs";
import { useHistory } from "react-router";
import DateCallendar from "../../components/DateCallendar";

import moment from "moment";
import EmptyBox from "../../components/EmptyBox";
import Loading from "../../components/Loading";
import NotifAlert from "../../components/NotifAlert";
import TitleHeader from "../../components/TitleHeader";
import { useGet } from "../../hooks/useApi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GetPayload } from "../../models/GenericPayload";
import { RiwayatIzinEntity } from "../../models/RiwayatIzin.entity";

const Tab2: React.FC = () => {
  const [karyawanId, setKaryawanId] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [ajuan, setAjuan] = useState(false);
  const [date, setDate] = useState<string | string[] | null | undefined>(
    moment().format("DD MMMM Y")
  );
  const [user] = useLocalStorage("user");
  const history = useHistory();
  const [showAlert,setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: payload,
    isFetching,
    refetch,
  } = useGet<GetPayload<RiwayatIzinEntity>>({
    name: "riwayat-izins",
    endpoint: `riwayat-izins-pgkg`,
    filter: {
      berlangsung: true,
      date,
      karyawan_id: karyawanId,
      ajuan
    },
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  useEffect(() => {
    refetch();
  }, [karyawanId, refetch,ajuan]);

  const handleDetailAktivitas = (aktifitas: RiwayatIzinEntity) => {
   
    if(user?.karyawan?.id.toString() === aktifitas.karyawan_id.toString() ||
        user?.karyawan?.role_id.toString() === '2' || 
        user?.karyawan?.role_id.toString() === '3' || 
        (aktifitas.karyawan.atasan_id)?.toString() ===  (user?.karyawan?.id)?.toString()
      )
      history.replace(`/aktifitas/${aktifitas?.id}`)
      else{
        setShowAlert(true);
        setAlertMessage('Tidak dapat melihat izin !')
      }
      
  }

  const handleColorStatus = (status: string) => {
    if(status === "disetujui") return `bg-green-700`;
    else if(status === 'disetujui atasan') return `bg-yellow-500`
    else if(status === 'disetujui hrd') return 'bg-yellow-500'
    else if(status === 'pengajuan') return 'bg-red-700'
    return 'bg-red-700'
  }

  const handleChangeStatusName = (status: string) => {
    if(status === 'pengajuan') return 'diajukan'
    else if(status === 'disetujui atasan' || status === 'disetujui hrd') return `divalidasi`
    else if(status === 'disetujui hrd') return 'diapprove'
    return status
  }
  return (
    <>
      <IonPage>
        <TitleHeader
          title="Aktifitas"
          rightIcon={
            <div className="flex flex-row gap-4">
              <div className="relative">
                <BsList
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setIsMenuOpen((menu) => !menu)}
                />
                {isMenuOpen && (
                  <ul className="menu bg-base-100 w-40 p-4 rounded-box absolute right-0 top-8 shadow-md space-y-2 text-md text-right">
                    <li
                      onClick={() => {
                        history.push("create-izin");
                        setIsMenuOpen(false);
                      }}
                    >
                      Buat Izin
                    </li>
                    <li
                      onClick={() => {
                        history.push("create-cuti");
                        setIsMenuOpen(false);
                      }}
                    >
                      Buat Cuti
                    </li>
                    <li
                      onClick={() => {
                        setIsFilterModal(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      Filter Tanggal
                    </li>
                    <li
                      onClick={() => {
                        if (karyawanId) {
                          setKaryawanId(undefined);
                        } else {
                          setKaryawanId(user.karyawan.id);
                        }

                        setIsMenuOpen(false);
                      }}
                    >
                      {karyawanId ? `Aktifitas Semua` : `Aktifitas Saya`}
                    </li>

                    <li
                      onClick={() => {
                       setAjuan(ajuan => !ajuan)

                        setIsMenuOpen(false);
                      }}
                    >
                      {ajuan ? `Clear Ajuan` : `Ajuan`}
                    </li>
                  </ul>
                )}
              </div>
            </div>
          }
        />
        <IonContent fullscreen>
          <IonRefresher
            slot="fixed"
            onIonRefresh={(e) => {
              refetch();
              e.detail.complete();
            }}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          {isFetching ? (
            <Loading />
          ) : (
            <>
              {payload?.data && payload.data.length > 0 ? (
                <div className="px-6 ">
                  <ul className="max-w-md divide-y-2 divide-zinc-300 pb-24">
                    {payload?.data.map((aktifitas) => (
                      <li className="py-3 cursor-pointer">
                        
                        <div className="flex flex-col gap-3" onClick={() => handleDetailAktivitas(aktifitas)}>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-row justify-between">
                              <p className="text-md font-semibold text-gray-900 ">
                                {aktifitas.karyawan.nama_lengkap}
                              </p>
                              <p className={`text-[10px]  text-white p-1 rounded-md capitalize max-h-[24px] ${handleColorStatus(aktifitas.status)}`}>
                                {handleChangeStatusName(aktifitas.status) }
                              </p>
                            </div>

                            <div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 ">
                                  {aktifitas.izin.nama_izin}
                                </p>
                                {aktifitas.tanggal_mulai ===
                                aktifitas.tanggal_selesai ? (
                                  <p className="text-xs text-black font-semibold">
                                    {moment(aktifitas.tanggal_mulai).format(
                                      "DD MMM YYYY"
                                    )}
                                  </p>
                                ) : (
                                  <p className="text-xs text-black font-semibold">
                                    {moment(aktifitas.tanggal_mulai).format(
                                      "DD MMM YYYY"
                                    )}{" "}
                                    -{" "}
                                    {moment(aktifitas.tanggal_selesai).format(
                                      "DD MMM YYYY"
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <EmptyBox message="Belum ada aktifitas yang diajukan " />
              )}
            </>
          )}
        </IonContent>
        <DateCallendar
          isOpen={isFilterModal}
          handleCancel={() => setIsFilterModal(false)}
          handleSubmit={(filterDate) => {
            setDate(moment(filterDate).format("DD MMMM Y"));
            setIsFilterModal(false);
          }}
          presentation={"date"}
          preferWheel={false}
        />
      <NotifAlert
        isOpen={showAlert}
        handleCancel={() => setShowAlert(false) }
        message= {alertMessage}
        type="warning"
        setIsOpen={setShowAlert}
        timeout={3000}
      />
      </IonPage>

    </>
  );
};

export default Tab2;

import {IonContent, IonPage, IonRefresher, IonRefresherContent,} from "@ionic/react";
import moment from "moment";
import {useEffect, useState} from "react";
import {CiFilter} from "react-icons/ci/index";
import DateCallendar from "../components/DateCallendar";
import EmptyBox from "../components/EmptyBox";
import Loading from "../components/Loading";
import TitleHeader from "../components/TitleHeader";
import {useGet} from "../hooks/useApi";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {AbsenEntity} from "../models/Absen.entity";
import {GetDetailPayload, GetPayload} from "../models/GenericPayload";
import {defaultDate} from "../utils/formatter";


const Absensi: React.FC = () => {
  const [isFilterModal, setIsFilterModal] = useState(false);
  const [date, setDate] = useState<string | string[] | null | undefined>(
    moment(defaultDate()).format('MMMM YYYY')
  );

  const [user] = useLocalStorage("user");

  const {
    data: payload,
    isFetching,
    refetch,
  } = useGet<GetPayload<AbsenEntity>>({
    name: "absens",
    endpoint: `absens`,
    filter: {
      karyawan_id: user.karyawan.id,
      date,
    },
  });

  const { data: dendaPayload, refetch: refetchDenda } = useGet<
    GetDetailPayload<{ potongan: number; range_keterlambatan: string }>
  >({
    name: "denda-absen",
    endpoint: `absens/denda`,
    filter: {
      karyawan_id: user.karyawan.id,
      date,
    },
  });

  useEffect(() => {
    refetch();
    refetchDenda();
  }, [date, refetch, refetchDenda]);



  return (
    <IonPage>
      <TitleHeader
        title="Presensi"
        rightIcon={
          <CiFilter
            className="w-6 h-6 cursor-pointer"
            strokeWidth={1}
            onClick={() => setIsFilterModal(true)}
          />
        }
      />

      <IonContent fullscreen>
        <IonRefresher
          slot="fixed"
          onIonRefresh={(e) => {
            refetch();
            refetchDenda();
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
              <>
                {/*<div className="mx-4 my-4 max-w-md bg-zinc-50 p-3 flex justify-between rounded-xl">*/}
                {/*  <div>*/}
                {/*    <p>Total Keterlambatan</p>*/}
                {/*    {dendaPayload?.data?.range_keterlambatan && <small className="text-[10px] text-slate-600">*/}
                {/*      {dendaPayload?.data.range_keterlambatan}*/}
                {/*    </small>}*/}
                {/*  </div>*/}

                {/*  <div className="text-right">*/}
                {/*    <p>*/}
                {/*      {payload.data.reduce(*/}
                {/*        (prev, curr) =>*/}
                {/*          Number(prev) + Number(curr.jumlah_telat),*/}
                {/*        0*/}
                {/*      )}*/}
                {/*      Menit*/}
                {/*    </p>*/}
                {/*   { dendaPayload?.data?.range_keterlambatan && <small className="text-[10px] text-red-600">*/}
                {/*      -{formatRupiah(dendaPayload?.data.potongan)}*/}
                {/*    </small>}*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div className="px-6 pb-4 space-y-4 ">
                  <ul className="max-w-md divide-y-2 divide-secondary pb-24">
                    {payload?.data.map((absen, index) => (
                      <li className="py-3" key={index}>
                        <div className="flex flex-col gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-md font-semibold text-gray-900 ">
                              {moment(absen.tanggal).format("DD MMMM Y")}
                            </p>
                            <div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-500 ">
                                  In{" "}
                                  {absen.waktu_masuk?.substring(
                                    0,
                                    absen.waktu_masuk?.length - 3
                                  )}{" "}
                                  - Out{" "}
                                  {absen.waktu_keluar?.substring(
                                    0,
                                    absen.waktu_keluar?.length - 3
                                  )}{" "}
                                </p>
                                <p className="text-xs text-accent">
                                  Telat {absen.jumlah_telat} Menit
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <EmptyBox message="Belum ada data absensi" />
            )}
          </>
        )}
      </IonContent>
      <DateCallendar
        isOpen={isFilterModal}
        handleCancel={() => setIsFilterModal(false)}
        defaultValue={ defaultDate() }
        handleSubmit={(filterDate) => {
          setDate(moment(filterDate).format("MMMM Y"));
          setIsFilterModal(false);
        }}
        presentation={"month-year"}
      />
    </IonPage>
  );
};

export default Absensi;

import { IonContent, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { CiFilter } from "react-icons/ci";
import { Link } from "react-router-dom";
import DateCallendar from "../../components/DateCallendar";
import EmptyBox from "../../components/EmptyBox";
import Loading from "../../components/Loading";
import TitleHeader from "../../components/TitleHeader";
import { useGet } from "../../hooks/useApi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GetPayload } from "../../models/GenericPayload";
import { RiwayatPenggajianEntity } from "../../models/RiwayatPenggajian.entity";
import { formatThousand } from "../../utils/formatter";

const Gaji: React.FC = () => {
  const [isFilterModal, setIsFilterModal] = useState(false);

  const [date, setDate] = useState<string | string[] | null | undefined>(
    moment().format("MMMM Y")
  );

  const [user] = useLocalStorage("user");


  const {
    data: payload,
    isFetching,
    refetch,
  } = useGet<GetPayload<RiwayatPenggajianEntity>>({
    name: "riwayat-penggajians",
    endpoint: `riwayat-penggajians`,
    filter: {
      date,
      karyawan_id: user?.karyawan?.id,
    },
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);
  return (
    <>
      <IonPage>
        <TitleHeader
          title="Gaji"
          rightIcon={
            <div className="flex flex-row gap-4">
              <CiFilter
                className="w-6 h-6 cursor-pointer"
                strokeWidth={1}
                onClick={() => setIsFilterModal(true)}
              />
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
                <div className="px-6 mt-4 bg-zinc-50 mx-2 py-4 rounded-xl ">
                  <div className="  divide-zinc-300">
                    {payload?.data.map((riwayat) => (
                      <Link to={`/gaji/${riwayat.id}`}>
                        <p className="text-xl">
                          {riwayat.periode}{/* {moment(riwayat.periode).format("MMMM Y")} */}
                        </p>

                        <div className="flex flex-col mt-4  ">
                          {/* GAJI POKOK */}
                          <div className="text-sm text-gray-700 flex justify-between gap-2 ">
                            Gaji Pokok
                            <div className="w-28 text-end flex">
                              <div className="w-12">Rp.</div>
                              <div className="w-full">
                                {formatThousand(riwayat.gaji_pokok)}
                              </div>
                            </div>
                          </div>
                          {/* POTONGAN */}
                          <div className="text-sm text-red-400 flex justify-between gap-2 mt-2">
                            Potongan
                            <div className="w-28 text-end flex">
                              <div className="w-12">-Rp.</div>
                              <div className="w-full">
                                {formatThousand(riwayat.total_potongan)}
                              </div>
                            </div>
                          </div>
                          {/* TUNJANGAN */}
                          <div className="text-sm text-green-400 flex justify-between gap-2 mt-2">
                            Tunjangan
                            <div className="w-28 text-end flex">
                              <div className="w-12">+Rp.</div>
                              <div className="w-full">
                                {formatThousand(riwayat.total_tunjangan)}
                              </div>
                            </div>
                          </div>
                          <div className="border-b-2 border-zinc-500 h-2 w-full"></div>
                          <div className="text-sm text-gray-700 flex justify-between gap-2 mt-2 font-semibold ">
                            Total Gaji
                            <div className="w-28 text-end flex">
                              <div className="w-12">Rp.</div>
                              <div className="w-full">{formatThousand(riwayat.total_gaji)}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyBox message="Belum ada gaji yang ditampilkan"/>
              )}
            </>
          )}
        </IonContent>
      </IonPage>
      <DateCallendar
        isOpen={isFilterModal}
        handleCancel={() => setIsFilterModal(false)}
        handleSubmit={(filterDate) => {
          setDate(moment(filterDate).format("MMMM Y"));
          setIsFilterModal(false);
        }}
        presentation={"month-year"}
      />
    </>
  );
};

export default Gaji;

import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { ArrowLeftCircle, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import CircleShadowButton from "../../../components/CircleShadowButton";
import Loading from "../../../components/Loading";
import TitleHeader from "../../../components/TitleHeader";
import { useGet } from "../../../hooks/useApi";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { GetDetailPayload } from "../../../models/GenericPayload";
import { KaryawanEntity } from "../../../models/Karyawan.entity";
import DeleteAlert from "../../../components/DeleteAlert";
import NotifAlert from "../../../components/NotifAlert";
import { useState } from "react";
import { RiwayatTrainingKaryawanEntity } from "../../../models/RiwayatTrainingKaryawan.entity";
import EmptyBox from "../../../components/EmptyBox";

const DataPelatihan: React.FC = () => {
  const history = useHistory();
  const [user] = useLocalStorage("user");
  const [isDelete, setIsdelete] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<RiwayatTrainingKaryawanEntity>();

  const {
    data: payload,
    isFetching,
    refetch,
  } = useGet<GetDetailPayload<KaryawanEntity>>({
    name: "karyawan",
    endpoint: `karyawans/${user?.karyawan.id}`,
  });
  return (
    <IonPage>
      <TitleHeader
        title="Data Pelatihan"
        rightIcon={
          <div className="flex flex-row justify-between items-center gap-4">
            <PlusCircleIcon
              className="w-8 h-8 cursor-pointer"
              strokeWidth={1}
              onClick={() => {
                history.push("/create-pelatihan");
              }}
            />
            <ArrowLeftCircle
              strokeWidth={1}
              className="w-8 h-8 cursor-pointer"
              onClick={() => history.replace("/profil")}
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
            {payload?.data &&
            payload?.data?.riwayat_training_karyawans?.length > 0 ? (
              <div className="px-6 mt-4 divide-y-2  ">
                <ul className="max-w-md divide-y-2 divide-zinc-300">
                  {payload?.data?.riwayat_training_karyawans?.map(
                    (pelatihan, index) => (
                      <li key={index} className="py-3 cursor-pointer">
                        <div className="text-xs font-semibold text-gray-900 flex gap-3 items-center w-full ">
                          <CircleShadowButton
                            icon={
                              <Trash2Icon
                                className="w-6 h-6 p-1 text-red-700"
                                onClick={() => {
                                  setSelectedItem(pelatihan);
                                  setIsdelete(true);
                                }}
                              />
                            }
                          />

                          <div className="flex-1">
                            <Link to={`/data-pelatihan/${pelatihan.id}`}>
                              <p>{pelatihan.nama_kegiatan}</p>
                              <p className="text-xs text-slate-500 font-light ">
                                {pelatihan.tahun}
                              </p>
                            </Link>
                          </div>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              <EmptyBox message="Belum Ada Data pelatihan" />
            )}
          </>
        )}
      </IonContent>
      <DeleteAlert
        isOpen={isDelete}
        handleCancel={() => setIsdelete(false)}
        message={`Apakah kamu yakin ingin menghapus data ${selectedItem?.nama_kegiatan} `}
        deleteProps={{
          name: "karyawan",
          endpoint: `riwayat-training-karyawans/${selectedItem?.id}`,
          onSuccessCallback: () => {
            setIsdelete(false);
            setSuccessAlert(true);
          },
        }}
      />
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Menghapus Data Keluarga"
        type="success"
        setIsOpen={setSuccessAlert}
      />
    </IonPage>
  );
};

export default DataPelatihan;

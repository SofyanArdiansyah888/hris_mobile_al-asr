import { IonContent, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
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
import EmptyBox from "../../../components/EmptyBox";
import { useState } from "react";
import DeleteAlert from "../../../components/DeleteAlert";
import { KeluargaKaryawanEntity } from "../../../models/KeluargaKaryawan.entity";
import NotifAlert from "../../../components/NotifAlert";

const DataKeluarga: React.FC = () => {
  const history = useHistory();
  const [user] = useLocalStorage("user");
  const [isDelete, setIsdelete] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KeluargaKaryawanEntity>();

  const { data: payload, isFetching, refetch } = useGet<GetDetailPayload<KaryawanEntity>>(
    {
      name: "karyawan",
      endpoint: `karyawans/${user?.karyawan.id}`,
    }
  );
  return (
    <IonPage>
      <TitleHeader
        title="Data Keluarga"
        rightIcon={
          <div className="flex flex-row justify-between items-center gap-4">
            <PlusCircleIcon
              className="w-8 h-8 cursor-pointer"
              strokeWidth={1}
              onClick={() => {
                history.push("/create-keluarga");
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
            {payload?.data && payload?.data?.keluarga_karyawans?.length > 0 ? (
              <div className="px-6 mt-4 divide-y-2  ">
                <ul className="max-w-md divide-y-2 divide-zinc-300">
                  {payload?.data?.keluarga_karyawans?.map((keluarga, index) => (
                    <li className="py-3" key={index}>
                      <div className="flex flex-row justify-between items-center">
                        <p className=" font-semibold text-gray-900 flex gap-3 items-center">
                          <CircleShadowButton
                            icon={
                              <Trash2Icon
                                className="w-6 h-6 p-1 text-red-700"
                                onClick={() => {
                                  setSelectedItem(keluarga);
                                  setIsdelete(true);
                                }}
                              />
                            }
                          />
                        </p>
                        <div className="w-full text-xs ml-3">
                          <Link to={`/data-keluarga/${keluarga.id}`}>
                            <p className="font-semibold capitalize">
                              {keluarga.nama}
                            </p>
                            <p className="capitalize">
                              {keluarga.status_keluarga}{" "}
                              {keluarga.status_keluarga === "anak"
                                ? `Ke-${keluarga.anak_ke}`
                                : ""}{" "}
                            </p>
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyBox message="Belum Ada Data Keluarga" />
            )}
          </>
        )}
      </IonContent>
      <DeleteAlert
        isOpen={isDelete}
        handleCancel={() => setIsdelete(false)}
        message={`Apakah kamu yakin ingin menghapus data ${selectedItem?.nama} `}
        deleteProps={{
          name: "karyawan",
          endpoint: `keluarga-karyawans/${selectedItem?.id}`,
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

export default DataKeluarga;

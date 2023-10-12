import { IonContent, IonPage, IonRefresher, IonRefresherContent } from "@ionic/react";
import { ArrowLeftCircle, PlusCircleIcon, Trash2Icon } from "lucide-react";
import moment from "moment";
import { useHistory } from "react-router";
import CircleShadowButton from "../../../components/CircleShadowButton";
import EmptyBox from "../../../components/EmptyBox";
import Loading from "../../../components/Loading";
import TitleHeader from "../../../components/TitleHeader";
import { useGet } from "../../../hooks/useApi";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { GetDetailPayload } from "../../../models/GenericPayload";
import { KaryawanEntity } from "../../../models/Karyawan.entity";
import DeleteAlert from "../../../components/DeleteAlert";
import NotifAlert from "../../../components/NotifAlert";
import { useState } from "react";
import { DokumenKaryawanEntity } from "../../../models/DokumenKaryawan.entity";

const DataDokumen: React.FC = () => {
  const history = useHistory();
  const [user] = useLocalStorage("user");
  const [isDelete, setIsdelete] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DokumenKaryawanEntity>();
  const { data: payload, isFetching,refetch } = useGet<GetDetailPayload<KaryawanEntity>>(
    {
      name: "karyawan",
      endpoint: `karyawans/${user?.karyawan.id}`,
    }
  );

  return (
    <IonPage>
      
      <TitleHeader
        title="Data Dokumen"
        rightIcon={
          <div className="flex flex-row justify-between items-center gap-4">
            <PlusCircleIcon
              className="w-8 h-8 cursor-pointer"
              strokeWidth={1}
              onClick={() => history.push("/create-dokumen")}
            />
            <ArrowLeftCircle
              className="w-8 h-8 cursor-pointer"
              strokeWidth={1}
              onClick={() => history.replace('/profil')}
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
            {payload?.data && payload?.data.dokumen_karyawans.length > 0 ? (
              <div className="px-6 mt-4 divide-y-2  ">
                <ul className="max-w-md divide-y-2 divide-zinc-300">
                  {payload?.data.dokumen_karyawans.map((dokumen, index) => (
                    <li className="py-3" key={index}>
                      <div className="flex flex-row justify-between items-center ">
                        <div className="text-xs font-semibold text-gray-900 flex gap-3 items-center w-full">
                          <CircleShadowButton
                            icon={
                              <Trash2Icon
                                className="w-6 h-6 p-1 text-red-700"
                                onClick={() => {
                                  setSelectedItem(dokumen);
                                  setIsdelete(true);
                                }}
                              />
                            }
                          />
                          <div className="w-full cursor-pointer" onClick={() => window.open(`${dokumen.gLink}`)}>
                            <p>{dokumen.nama_dokumen}</p>
                            <p className="text-xs text-gray-500 lowercase">
                              {dokumen.link_file}
                            </p>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 ">
                          {moment(dokumen.created_at).format("D MMM Y, H:mm:s")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyBox message="Belum Ada Data Dokumen" />
            )}
          </>
        )}
      </IonContent>
      <DeleteAlert
        isOpen={isDelete}
        handleCancel={() => setIsdelete(false)}
        message={`Apakah kamu yakin ingin menghapus data ${selectedItem?.nama_dokumen} `}
        deleteProps={{
          name: "karyawan",
          endpoint: `dokumen-karyawans/${selectedItem?.id}`,
          onSuccessCallback: () => {
            setIsdelete(false);
            setSuccessAlert(true);
          },
        }}
      />
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Menghapus Dokumen"
        type="success"
        setIsOpen={setSuccessAlert}
      />
    </IonPage>
  );
};

export default DataDokumen;

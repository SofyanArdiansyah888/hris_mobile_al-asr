import { IonContent, IonPage } from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import KembaliHeader from "../../components/KembaliHeader";
import Loading from "../../components/Loading";
import NotifAlert from "../../components/NotifAlert";
import { useGet } from "../../hooks/useApi";
import { GetDetailPayload } from "../../models/GenericPayload";
import { RiwayatPenggajianEntity } from "../../models/RiwayatPenggajian.entity";
import { formatRupiah } from "../../utils/formatter";

const DetailGaji: React.FC = () => {
  
  const params: any = useParams();
  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);

  const { data, isFetching, refetch } = useGet<
    GetDetailPayload<RiwayatPenggajianEntity>
  >({
    name: "riwayat-penggajian",
    endpoint: `riwayat-penggajians/${params?.id}`,
  });

  useEffect(() => {
    refetch();
  }, [params,refetch]);


  return (
    <IonPage>
      <KembaliHeader handleKembali={() => history.replace("/gaji")} />
      <IonContent fullscreen>
        {isFetching ? (
          <Loading />
        ) : (
          <div className="  px-4 py-4   ">
            <h2 className=" text-xl ">Detail Gaji</h2>
            <div className="flex  flex-col w-full  gap-2 my-6 bg-zinc-50 p-4 rounded-xl  ">
              {/* PERIODE */}
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-semibold">Periode</p>
                <p className="text-xs">
                  {moment(data?.data?.periode).format("MMMM Y")}
                </p>
              </div>
              <hr />

              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-semibold">Gaji Pokok</p>
                <p className="text-xs font-semibold">
                  {formatRupiah(data?.data?.gaji_pokok)}
                </p>
              </div>
              <hr />

              {/* TUNJANGAN */}
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-semibold">Tunjangan</p>
              </div>

              {data?.data.detail_tunjangan.map((tunjangan) => (
                <>
                  <div className="flex flex-row justify-between items-center gap-0">
                    <p className="ml-8 text-xs  ">{tunjangan.nama_tunjangan}</p>
                    <p className="text-xs">{formatRupiah(tunjangan.nominal)}</p>
                  </div>
                  <hr />
                </>
              ))}
              <div className="flex flex-row justify-between items-center font-semibold text-green-400">
                <p className="ml-8 text-xs font-semibold">Total</p>
                <p className="text-xs ">
                  +{formatRupiah(data?.data.total_tunjangan)}
                </p>
              </div>
              <hr />

              {/* POTONGAN */}
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-semibold">Potongan</p>
              </div>

              {data?.data.detail_potongan.map((potongan) => (
                <>
                  <div className="flex flex-row justify-between items-center gap-0 text-xs">
                    <p className="ml-8   ">{potongan.nama_potongan}</p>
                    <p>{formatRupiah(potongan.nominal)}</p>
                  </div>
                  <hr />
                </>
              ))}
              <div className="flex flex-row justify-between items-center font-semibold text-red-400 text-xs">
                <p className="ml-8  font-semibold">Total</p>
                <p>-{formatRupiah(data?.data.total_potongan)}</p>
              </div>
              <hr />

              {/* GAJI BERSIH */}
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-semibold">Gaji Bersih</p>
                <p className="text-xs font-semibold">
                  {formatRupiah(data?.data?.total_gaji)}
                </p>
              </div>
              <hr />
            </div>
          </div>
        )}
      </IonContent>
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Menyetujui Izin/Cuti"
        type="success"
        setIsOpen={setSuccessAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message="Gagal Menyetujui Izin/Cuti"
        type="danger"
        setIsOpen={setDangerAlert}
      />
    </IonPage>
  );
};

export default DetailGaji;

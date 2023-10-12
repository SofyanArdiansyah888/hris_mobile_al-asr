import { IonContent, IonPage } from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import KembaliHeader from "../../components/KembaliHeader";
import Loading from "../../components/Loading";
import NotifAlert from "../../components/NotifAlert";
import { useGet, usePost } from "../../hooks/useApi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GetDetailPayload } from "../../models/GenericPayload";
import { RiwayatIzinEntity } from "../../models/RiwayatIzin.entity";
import DeleteAlert from "../../components/DeleteAlert";
const DetailAktivitas: React.FC = () => {
  const [user] = useLocalStorage("user");
  const params: any = useParams();
  const history = useHistory();
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [dangerMessage, setDangerMessage] = useState("");
  const [isModalDelete, setModalDelete] = useState(false);

  const { data, isFetching, refetch } = useGet<
    GetDetailPayload<RiwayatIzinEntity>
  >({
    name: "riwayat-izin",
    endpoint: `riwayat-izins/${params?.id}`,
  });

  const { mutate, isLoading: isApproveLoading } = usePost({
    name: "riwayat-izin,riwayat-izins",
    endpoint: `riwayat-izins/update-status`,
    onSuccessCallback: () => {
      setSuccessAlert(true);
    },
    onErrorCallback: () => {
      setDangerAlert(true);
      setDangerMessage("Gagal Menyetujui Izin/Cuti");
    },
  });

  useEffect(() => {
    refetch();
  }, [params, refetch]);

  const handleChangeStatusName = (status: string | undefined) => {
    if(status === 'pengajuan') return 'diajukan'
    else if(status === 'disetujui atasan' || status === 'disetujui hrd') return `divalidasi`
    else if(status === 'disetujui hrd') return 'diapprove'
    return status
  }

  const kegiatans = [
    { judul: "Nama Karyawan", deskripti: data?.data?.karyawan?.nama_lengkap },
    { judul: "Izin", deskripti: data?.data?.izin?.nama_izin },
    {
      judul: "Tanggal",
      deskripti:
        data?.data.tanggal_mulai === data?.data.tanggal_selesai
          ? moment(data?.data.tanggal_mulai).format("DD MMM YYYY")
          : `${moment(data?.data.tanggal_mulai).format(
              "DD MMM YYYY"
            )} - ${moment(data?.data.tanggal_selesai).format("DD MMM YYYY")}`,
    },
    { judul: "Jumlah Hari", deskripti: `${data?.data.jumlah_hari} Hari` },
    { judul: "Status Pengajuan", deskripti: handleChangeStatusName(data?.data.status) },
    { judul: "Keterangan", deskripti: data?.data.keterangan },
  ];

  const handleApprove = (status: "disetujui" | "disetujui atasan") => {
    mutate({
      id: params?.id,
      status,
      role_id: user.karyawan.role_id,
    });
  };



  return (
    <IonPage>
      <KembaliHeader handleKembali={() => history.replace("/aktifitas")} />
      <IonContent fullscreen>
        {isFetching ? (
          <Loading />
        ) : (
          <div className="  px-4 py-6   ">
            <h2 className="font-semibold  text-xl">Detail Aktifitas</h2>
            <div className="flex  flex-col w-full  gap-3 my-8 ">
              {kegiatans.map((kegiatan) => (
                <div>
                  <p className="text-sm font-semibold">{kegiatan.judul}</p>
                  <p className="text-xs">{kegiatan.deskripti}</p>
                </div>
              ))}
              {data?.data.nama_file && (
                <div className="cursor-pointer" onClick={() => window.open(data.data
                .nama_file)}>
                  <p className="text-sm font-semibold">Gambar</p>
                  <img src={data?.data.nama_file} alt="Gambar Izin" className="mt-2 rounded-lg max-h-[300px] mb-24" />
                </div>
              )}
            </div>

            {/* TOMBOL APPROVE */}
            {data?.data.status === "pengajuan" &&
              ((data.data.karyawan.atasan_id)?.toString() === (user?.karyawan?.id)?.toString() ||
                user?.karyawan.role_id.toString()=== '2') && (
                <button
                  className="btn static bg-slate-700 border-slate-700 justify-end capitalize"
                  disabled={isApproveLoading}
                  onClick={() => handleApprove('disetujui atasan')}
                >
                  {isApproveLoading ? "Loading..." : "Approve"}
                </button>
              )}

            {/* TOMBOL APPROVE REKTOR */}
            {data?.data.status === "disetujui hrd" &&
              (user?.karyawan.role_id.toString() === '3') && (
                <button
                  className="btn static bg-slate-700 border-slate-700 justify-end capitalize"
                  disabled={isApproveLoading}
                  onClick={() => handleApprove('disetujui')}
                >
                  {isApproveLoading ? "Loading..." : "Approve Rektor"}
                </button>
              )}
            {/* TOMBOL HAPUS DAN EDIT */}
            {/* SHOW IF KARYAWAN YANG BERSANGKUTAN MEMBUAT IZIN DAN IZIN STATUS MASIH PRENGAJUAN */}
            {data?.data.karyawan_id === user?.karyawan?.id &&
              data?.data.status.toLowerCase() === "pengajuan" && (
                <>
                  <button
                    className="btn static bg-yellow-300 border-yellow-300 justify-end capitalize ml-2 "
                    onClick={() => {
                      const jenisIzin = data?.data.izin.jenis_izin;
                      if (jenisIzin)
                        history.push(
                          `/aktifitas/${data.data.id}/edit-${jenisIzin}`
                        );
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn static bg-red-700 border-red-700 justify-end ml-1 capitalize "
                    onClick={() => setModalDelete(true)}
                  >
                    Hapus
                  </button>
                </>
              )}
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
        message={dangerMessage}
        type="danger"
        setIsOpen={setDangerAlert}
      />
      <DeleteAlert
        isOpen={isModalDelete}
        handleCancel={() => setModalDelete(false)}
        message={`Apakah kamu yakin ingin menghapus  ${data?.data.izin.nama_izin} `}
        deleteProps={{
          name: "riwayat-izins",
          endpoint: `riwayat-izins/${data?.data?.id}`,
          onSuccessCallback: () => {
            setModalDelete(false);
            setSuccessAlert(true);
            setTimeout(() => history.replace("/aktifitas"), 1500);
          },
          onErrorCallback: () => {
            setDangerAlert(true);
            setDangerMessage("Gagal Menghapus Izin / Cuti");
          },
        }}
      />
    </IonPage>
  );
};

export default DetailAktivitas;

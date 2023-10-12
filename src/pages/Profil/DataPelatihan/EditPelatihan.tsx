import { yupResolver } from "@hookform/resolvers/yup";
import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import * as yup from "yup";
import KembaliHeader from "../../../components/KembaliHeader";
import LabelError from "../../../components/LabelError";
import Loading from "../../../components/Loading";
import NotifAlert from "../../../components/NotifAlert";
import { useGet, usePut } from "../../../hooks/useApi";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { GetDetailPayload } from "../../../models/GenericPayload";
import { RiwayatTrainingKaryawanEntity } from "../../../models/RiwayatTrainingKaryawan.entity";

const schema = yup
  .object({
    nama_kegiatan: yup.string().required(),
    tahun: yup.string().required(),
    valid: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const EditPelatihan: React.FC = () => {
  const [user] = useLocalStorage("user");
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData & { karyawan_id: string }>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const params: any = useParams();
  const { data, isFetching, refetch } = useGet<
    GetDetailPayload<RiwayatTrainingKaryawanEntity>
  >({
    name: "riwayat-training-karyawans",
    endpoint: `riwayat-training-karyawans/${params?.id}`,
  });

  const { mutate, isLoading: isCreateLoading } = usePut({
    name: "karyawan",
    endpoint: `riwayat-training-karyawans/${params?.id}`,
    onSuccessCallback: () => {
      setSuccessAlert(true);
      history.replace("/data-pelatihan");
      reset();
    },
    onErrorCallback: () => setDangerAlert(true),
  });

  useEffect(() => {
    refetch();
  }, [params, refetch]);

  useEffect(() => {
    if (data?.data) {
      const { nama_kegiatan, tahun, valid } = data.data;
      setValue("nama_kegiatan", nama_kegiatan?.toString());
      setValue("tahun", tahun?.toString());
      setValue("valid", valid?.toString());
    }

    return () => {
      reset();
    };
  }, [data, reset, setValue]);

  const history = useHistory();

  const handleEditPelatihan = (data: FormData) => {
    mutate({
      ...data,
      karyawan_id: user?.karyawan.id,
    });
  };
  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace("/data-pelatihan")} />
        <IonContent fullscreen>
          {isFetching ? (
            <Loading />
          ) : (
            <div className="flex flex-col  mt-14 justify-center items-center ">
              <form
                onSubmit={handleSubmit(handleEditPelatihan)}
                className="w-full px-12"
              >
                <h3 className="text-xl font-semibold">
                  Form Edit Pelatihan{" "}
                </h3>
                <div className="flex flex-col justify-center items-center my-8 ">
                  <div className="form_group">
                    <label className="text-sm">Nama Kegiatan</label>
                    <input
                      type="text"
                      className="input input-bordered rounded-xl mt-2 w-full"
                      {...register("nama_kegiatan")}
                    />
                    <LabelError errorMessage={errors.nama_kegiatan?.message} />
                  </div>

                  <div className="form_group">
                    <label className="text-sm">Tahun</label>
                    <input
                      type="text"
                      className="input input-bordered rounded-xl mt-2 w-full"
                      {...register("tahun")}
                    />
                    <LabelError errorMessage={errors.tahun?.message} />
                  </div>

                  <div className="form_group">
                    <label className="text-sm">Valid</label>
                    <input
                      type="date"
                      className="input input-bordered rounded-xl mt-2 w-full"
                      {...register("valid")}
                    />
                    <LabelError errorMessage={errors.valid?.message} />
                  </div>
                </div>

                <button
                  className={`btn bg-red-600 border-red-600 w-full my-4 ${isCreateLoading ? 'animate-pulse' : ''}`}
                  type="submit"
                  disabled={isCreateLoading}
                >
                  {isCreateLoading ? "Loading..." : "Submit"}
                </button>
              </form>
            </div>
          )}
        </IonContent>
      </IonPage>
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Mengedit Pelatihan"
        type="success"
        setIsOpen={setSuccessAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message="Gagal Mengedit Pelatihan"
        type="danger"
        setIsOpen={setDangerAlert}
      />
    </>
  );
};

export default EditPelatihan;

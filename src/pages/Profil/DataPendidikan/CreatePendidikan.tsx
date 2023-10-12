import { yupResolver } from "@hookform/resolvers/yup";
import { IonContent, IonPage } from "@ionic/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as yup from "yup";
import KembaliHeader from "../../../components/KembaliHeader";
import LabelError from "../../../components/LabelError";
import NotifAlert from "../../../components/NotifAlert";
import { usePost } from "../../../hooks/useApi";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

const schema = yup
  .object({
    jenjang: yup.string().required(),
    nama_sekolah: yup.string().required(),
    tahun_masuk: yup.string().required(),
    tahun_keluar: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const CreatePendidikan: React.FC = () => {
  const [user] = useLocalStorage("user");
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<FormData & { karyawan_id: string }>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isCreateLoading } = usePost({
    name: "karyawan",
    endpoint: `pendidikan-karyawans`,
    onSuccessCallback: () => {
      setSuccessAlert(true)
      history.replace('/data-pendidikan');
      reset()
    },
    onErrorCallback: () => setDangerAlert(true),
  });

  const history = useHistory();

  const handleCreatePendidikan = (data: FormData) => {
    mutate({
      ...data,
      karyawan_id: user?.karyawan.id,
    });
  };
  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace('/data-pendidikan')} />
        <IonContent fullscreen>
          <div className="flex flex-col  mt-14 justify-center items-center ">
            <form
              onSubmit={handleSubmit(handleCreatePendidikan)}
              className="w-full px-12"
            >
              <h3 className="text-xl font-semibold">Form Tambah Pendidikan </h3>
              <div className="flex flex-col justify-center items-center my-8 ">
                <div className="form_group">
                  <label className="text-sm">Nama Sekolah</label>
                  <input
                    type="text"
                    className="input input-bordered mt-2 rounded-xl w-full"
                    {...register("nama_sekolah")}
                  />
                  <LabelError errorMessage={errors.nama_sekolah?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Jenjang</label>
                  <input
                    type="text"
                    className="input input-bordered mt-2 rounded-xl w-full"
                    {...register("jenjang")}
                  />
                  <LabelError errorMessage={errors.jenjang?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tahun Masuk</label>
                  <input
                    type="number"
                    className="input input-bordered mt-2 rounded-xl w-full"
                    {...register("tahun_masuk")}
                  />
                  <LabelError errorMessage={errors.tahun_masuk?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tahun Keluar</label>
                  <input
                    type="number"
                    className="input input-bordered mt-2 rounded-xl w-full"
                    {...register("tahun_keluar")}
                  />
                  <LabelError errorMessage={errors.tahun_keluar?.message} />
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
        </IonContent>
      </IonPage>
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Membuat Pendidikan"
        type="success"
        setIsOpen={setSuccessAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message="Gagal Membuat Pendidikan"
        type="danger"
        setIsOpen={setDangerAlert}
      />
    </>
  );
};

export default CreatePendidikan;

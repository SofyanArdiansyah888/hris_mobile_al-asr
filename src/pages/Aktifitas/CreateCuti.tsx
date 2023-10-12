import { yupResolver } from "@hookform/resolvers/yup";
import { IonContent, IonPage } from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as yup from "yup";
import KembaliHeader from "../../components/KembaliHeader";
import LabelError from "../../components/LabelError";
import NotifAlert from "../../components/NotifAlert";
import { useGet, usePost } from "../../hooks/useApi";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GetDetailPayload, GetPayload } from "../../models/GenericPayload";
import { IzinEntity } from "../../models/Izin.entity";
import { IzinKaryawanEntity } from "../../models/IzinKaryawan.entity";

const schema = yup
  .object({
    izin_id: yup.string().required(),
    nama_file: yup.string().notRequired(),
    tanggal_mulai: yup.string().required(),
    sisa_cuti: yup.number().nullable(),
    tanggal_selesai: yup.string().required(),
    keterangan: yup.string().required(),
    telepon: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function CreateCuti() {
  const history = useHistory();
  const [user] = useLocalStorage("user");
  const [showAlert, setShowAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const sisaCuti = watch("sisa_cuti");
  const izinWatch = watch("izin_id");
  const { data: payloadCuti } = useGet<GetPayload<IzinEntity>>({
    name: "cutis",
    endpoint: "izins",
    limit: 0,
    filter: {
      jenis_izin: "cuti",
    },
  });

  const { mutate, isLoading: isCreateLoading } = usePost({
    name: "riwayat-izins",
    endpoint: "riwayat-izins",
    onSuccessCallback: () => {
      setShowAlert(true);
      reset();
      setTimeout(() => history.replace("/aktifitas"), 1500);
    },
  });

  useEffect(() => {
    setValue("telepon", user?.karyawan?.telepon);
    return () => {
      setValue("sisa_cuti", 0);
    };
  }, [setValue, user, reset]);

  
  const { data: karyawanIzinPayload, refetch: refetchKaryawanIzin } = useGet<
    GetDetailPayload<IzinKaryawanEntity>
  >({
    name: "karyawan-izins",
    endpoint: `karyawans/${user?.karyawan?.id}/izins/${izinWatch}`,
    retry: false,
  });

  useEffect(() => {
    if (izinWatch) {
      refetchKaryawanIzin();
    }
    if(izinWatch === ''){
      setValue('sisa_cuti',0)
    }
  }, [izinWatch, refetchKaryawanIzin, setValue]);

  useEffect(() => {
    setValue("telepon", user?.karyawan?.telepon);

  }, [setValue, user?.karyawan?.telepon]);

  useEffect(() => {
    if (!karyawanIzinPayload?.data) {
      setValue("sisa_cuti", 0);
    } else {
      setValue("sisa_cuti", karyawanIzinPayload?.data?.sisa_quota);
    }
  }, [karyawanIzinPayload, setValue]);

  const handleCreateCuti = (data: FormData) => {
    let diff = 0;
    let { tanggal_mulai, tanggal_selesai } = data;
    diff = moment(tanggal_selesai).diff(tanggal_mulai, "days");
    diff += 1;
    if (sisaCuti !== null && sisaCuti !== undefined) {
      if (diff > sisaCuti) {
        setErrorMessage("Jumlah cuti tidak mencukupi!");
        setDangerAlert(true);
      } else {
        const { sisa_cuti, ...formData } = data;
        mutate({
          ...formData,
          karyawan_id: user?.karyawan?.id,
        });
      }
    }
  };

  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace("/aktifitas")} />
        <IonContent scrollY>
          <form
            onSubmit={handleSubmit(handleCreateCuti)}
            className="flex flex-col  justify-center items-center mt-2 "
          >
            <div className="w-full px-12">
              <h3 className="text-xl font-semibold">Form Pengajuan Cuti</h3>
              <div className="flex flex-col justify-center items-center my-2  ">
                <div className="form_group">
                  <select
                    className="select select-bordered select-sm rounded-xl input-sm mt-2 w-full"
                    {...register("izin_id")}
                  >
                    <option value="">Pilih Cuti</option>
                    {payloadCuti?.data.map((izin, index) => (
                      <option value={izin.id} key={index}>
                        {izin.nama_izin}
                      </option>
                    ))}
                  </select>
                  <LabelError errorMessage={errors.izin_id?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Sisa Cuti</label>
                  <input
                    type="text"
                    className="input input-bordered mt-2 rounded-xl input-sm w-full"
                    {...register("sisa_cuti")}
                    disabled
                  />
                  <LabelError errorMessage={errors.sisa_cuti?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="input input-bordered mt-2 rounded-xl input-sm w-full"
                    {...register("tanggal_mulai")}
                  />
                  <LabelError errorMessage={errors.tanggal_mulai?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tanggal Selesai</label>
                  <input
                    type="date"
                    className="input input-bordered mt-2 rounded-xl input-sm w-full"
                    {...register("tanggal_selesai")}
                  />
                  <LabelError errorMessage={errors.tanggal_selesai?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Telepon Yang Bisa Dihubungi</label>
                  <input
                    type="text"
                    className="input input-bordered rounded-xl input-sm w-full mt-2"
                    {...register("telepon")}
                  />
                  <LabelError errorMessage={errors.telepon?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Keterangan</label>
                  <textarea
                    className="textarea textarea-bordered rounded-xl textarea-sm w-full py-2 mt-2"
                    {...register("keterangan")}
                  />
                  <LabelError errorMessage={errors.keterangan?.message} />
                </div>
              </div>

              <button
                className={`btn bg-red-600 border-red-600 w-full  mb-4 ${
                  isCreateLoading ? "animate-pulse" : ""
                }`}
                type="submit"
                disabled={isCreateLoading}
              >
                {isCreateLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </IonContent>
      </IonPage>

      <NotifAlert
        isOpen={showAlert}
        handleCancel={() => setShowAlert(false)}
        message="Berhasil Membuat Cuti"
        type="success"
        setIsOpen={setShowAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message={errorMessage}
        type="warning"
        setIsOpen={setDangerAlert}
      />
    </>
  );
}

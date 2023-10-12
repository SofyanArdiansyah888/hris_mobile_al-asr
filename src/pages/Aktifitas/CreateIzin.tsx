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
import { GetPayload } from "../../models/GenericPayload";
import { IzinEntity } from "../../models/Izin.entity";
import Dropzone from "../../components/Dropzone";

const schema = yup
  .object({
    izin_id: yup.string().required(),
    tanggal_mulai: yup.string().required(),
    tanggal_selesai: yup.string().required(),
    keterangan: yup.string().required(),
    telepon: yup.string().required(),
    nama_file: yup.string().when(['tanggal_mulai','tanggal_selesai'],{
      is: (tanggal_mulai: string, tanggal_selesai:string) => {
        let diff = 0;
        if(tanggal_mulai && tanggal_selesai){
          diff = moment(tanggal_selesai).diff(tanggal_mulai,'days');
        }
        return diff > 2
      },
      then() {
        return yup.string().required()
      },
    })
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function CreateIzin() {
  const history = useHistory();
  const [user] = useLocalStorage("user");
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { data: payloadIzin } = useGet<GetPayload<IzinEntity>>({
    name: "izins",
    endpoint: "izins",
    limit: 0,
    filter: {
      jenis_izin: "izin",
    },
  });

  const { mutate, isLoading: isCreateLoading } = usePost({
    name: "riwayat-izins",
    endpoint: "riwayat-izins",
    onSuccessCallback: () => {
        setShowAlert(true)
        reset();
        setTimeout(() =>history.replace('/aktifitas'), 1500 )
    }
  });

  useEffect(() => {
    setValue('telepon',user?.karyawan?.telepon)
  },[setValue, user])

  const handleCreateIzin = (data: FormData) => {
    mutate({
      ...data,
      karyawan_id: user?.karyawan?.id,
    });
  };

  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace('/aktifitas')} />
        <IonContent scrollY>
          <form
            onSubmit={handleSubmit(handleCreateIzin)}
            className="flex flex-col mt-2  justify-center items-center "
          >
            <div className="w-full px-12">
              <h3 className="text-xl font-semibold">Form Pengajuan Izin</h3>
              <div className="flex flex-col justify-center items-center my-2 ">
                <div className="form_group">
                  <select
                    className="select select-bordered mt-2 select-sm rounded-xl w-full"
                    {...register("izin_id")}
                  >
                    <option value="">Pilih Izin</option>
                    {payloadIzin?.data.map((izin,index) => (
                      <option value={izin.id} key={index}>{izin.nama_izin}</option>
                    ))}
                  </select>
                  <LabelError errorMessage={errors.izin_id?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="input input-bordered input-sm mt-2 rounded-xl w-full"
                    {...register("tanggal_mulai")}
                  />
                  <LabelError errorMessage={errors.tanggal_mulai?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Tanggal Selesai</label>
                  <input
                    type="date"
                    className="input input-bordered input-sm mt-2 rounded-xl w-full"
                    {...register("tanggal_selesai")}
                  />
                  <LabelError errorMessage={errors.tanggal_selesai?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Telepon Yang Bisa Dihubungi</label>
                  <input
                    type="text"
                    className="input input-bordered input-sm mt-2 rounded-xl w-full"
                    {...register("telepon")}
                  />
                  <LabelError errorMessage={errors.telepon?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm">Keterangan</label>
                  <textarea
                    className="textarea textarea-bordered textarea-sm mt-2 rounded-xl w-full"
                    {...register("keterangan")}
                  />
                  <LabelError errorMessage={errors.keterangan?.message} />
                </div>


                <div className="form_group">
                  <label className="text-sm">File</label>
                  <Dropzone
                    options={{
                      url: `${process.env.REACT_APP_BASE_URL}upload-izin`,
                      acceptedFiles: "image/jpeg,image/png,image/gif,image/jpg",
                      // maxFilesize: 2,
                      maxFiles: 1,
                      headers: {
                        Authorization: `Bearer ${user?.token}`,
                      },
                      addRemoveLinks: true,
                      success: (file:any) => {
                        setValue(
                          "nama_file",
                          file.xhr?.response.replace(/^"|"$/g, "")
                        );
                      },
                      removedfile: (file) => {
                        file.previewElement.remove();
                        setValue("nama_file", "");
                      },
                    }}
                    className="dropzone w-full"
                  >
                    <div className="text-md font-medium ">Upload Dokumen</div>
                    {/* <div className="text-gray-600">Maximal 2 Mb</div> */}
                  </Dropzone>
                  <LabelError errorMessage={errors.nama_file?.message} />
                </div>
              </div>

              <button
                className={`btn bg-red-600 border-red-600 w-full mb-4 ${isCreateLoading ? 'animate-pulse' : ''}`}
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
        handleCancel={() => setShowAlert(false) }
        message="Berhasil Membuat Izin Baru"
        type="success"
        setIsOpen={setShowAlert}
      />
    </>
  );
}



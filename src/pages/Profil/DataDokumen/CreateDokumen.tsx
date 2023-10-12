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
import Dropzone from "../../../components/Dropzone";
const schema = yup
  .object({
    nama_dokumen: yup.string().required(),
    link_file: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const CreateDokumen: React.FC = () => {
  const [user] = useLocalStorage("user");
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const history = useHistory();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<FormData & { karyawan_id: string }>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isCreateLoading } = usePost({
    endpoint: "dokumen-karyawans",
    name: "karyawan",
    onSuccessCallback: () => {
      setSuccessAlert(true);
      history.replace("/data-dokumen");
      reset();
    },
  });

  function handleCreateDokumen(data: FormData) {
    mutate({
      ...data,
      karyawan_id: user.karyawan?.id,
    });
  }
  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace('/data-dokumen')} />
        <IonContent fullscreen>
          <div className="flex flex-col mt-14 overflow-scroll  justify-center items-center ">
            <form
              onSubmit={handleSubmit(handleCreateDokumen)}
              className="w-full px-12"
            >
              <h3 className="text-xl font-semibold">Form Tambah Dokumen </h3>
              <div className="flex flex-col justify-center items-center my-8 ">
                <div className="form_group">
                  <label className="text-sm">Nama Dokumen</label>
                  <input
                    type="text"
                    className="input input-bordered mt-2 rounded-full w-full"
                    {...register("nama_dokumen")}
                  />
                  <LabelError errorMessage={errors.nama_dokumen?.message} />
                </div>

                <div className="form_group">
                  <label className="text-sm mb-2">File</label>
                  <Dropzone
                    options={{
                      url: `${process.env.REACT_APP_BASE_URL}upload-dokumen`,
                      // acceptedFiles: "Application/*",
                      // maxFilesize: 2,
                      maxFiles: 1,
                      headers: {
                        Authorization: `Bearer ${user?.token}`,
                      },
                      addRemoveLinks: true,
                      success: (file:any) => {
                        setValue(
                          "link_file",
                          file.xhr?.response.replace(/^"|"$/g, "")
                        );
                      },
                      removedfile: (file) => {
                        file.previewElement.remove();
                        setValue("link_file", "");
                      },
                    }}
                    className="dropzone w-full"
                  >
                    <div className="text-md font-medium ">Upload Dokumen</div>
                    {/* <div className="text-gray-600">Maximal 2 Mb</div> */}
                  </Dropzone>
                  <LabelError errorMessage={errors.link_file?.message} />
                </div>
              </div>

              <button
                className={`btn bg-[#1f1d42] border-[#1f1d42] w-full my-4 ${isCreateLoading ? 'animate-pulse' : ''}`}
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
        message="Berhasil Membuat Dokumen Baru"
        type="success"
        setIsOpen={setSuccessAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message="Gagal Membuat Dokumen Baru"
        type="danger"
        setIsOpen={setDangerAlert}
      />
    </>
  );
};

export default CreateDokumen;

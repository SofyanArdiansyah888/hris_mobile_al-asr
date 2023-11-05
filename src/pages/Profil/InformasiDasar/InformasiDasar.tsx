import {yupResolver} from "@hookform/resolvers/yup";
import {IonContent, IonPage} from "@ionic/react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useHistory} from "react-router";
import * as yup from "yup";
import KembaliHeader from "../../../components/KembaliHeader";
import LabelError from "../../../components/LabelError";
import Loading from "../../../components/Loading";
import NotifAlert from "../../../components/NotifAlert";
import {useGet, usePost} from "../../../hooks/useApi";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import {GetDetailPayload} from "../../../models/GenericPayload";
import {UserEntity} from "../../../models/User.entity";

const schema = yup
    .object({
        username: yup.string().required(),
        nama_lengkap: yup.string().required(),
        tempat_lahir: yup.string().required(),
        tgl_lahir: yup.string().required(),
        jenis_kelamin: yup.string().notRequired(),
        npwp: yup.string().notRequired(),
        // SHOW BUT DISABLED
        jabatan: yup.string().notRequired(),
        instansi: yup.string().notRequired(),
        kode_pegawai: yup.string().notRequired(),
    })
    .required();
type FormData = yup.InferType<typeof schema>;

const InformasiDasar: React.FC = () => {
    const [user] = useLocalStorage("user");
    const [successAlert, setSuccessAlert] = useState(false);
    const [dangerAlert, setDangerAlert] = useState(false);
    const {
        register,
        formState: {errors},
        handleSubmit,
        setValue,
    } = useForm<FormData>({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    const {data: dataKaryawan, isLoading} =
        useGet<GetDetailPayload<UserEntity>>(
            {
                name: "user",
                endpoint: `user/${user?.id_pegawai}/profil`,
            });

    const {mutate, isLoading: isUpdateLoading} =
        usePost({
            name: "user",
            endpoint: `user/${user?.id_pegawai}/update-profil`,
            onSuccessCallback: () => {
                setSuccessAlert(true);
            },
            onErrorCallback: () => setDangerAlert(true),
        });

    useEffect(() => {
        if (dataKaryawan) {
            const {data} = dataKaryawan
            setValue("username", data.username);
            setValue('nama_lengkap', data.nama_lengkap)
            setValue("tempat_lahir", data.tempat_lahir);
            setValue("tgl_lahir", data.tgl_lahir);
            setValue("jenis_kelamin", data.jenis_kelamin);
            setValue("npwp", data.npwp);
            setValue("jabatan", data.jabatan);
            setValue("instansi", data.instansi);
            setValue("kode_pegawai", data.kode_pegawai);
        }
    }, [dataKaryawan, setValue]);

    const history = useHistory();

    const handleUpdateRekening = (data: FormData) => {
        const postData = new FormData();
        postData.append('username', data.username)
        postData.append('nama_lengkap', data.nama_lengkap)
        postData.append('tempat_lahir', data.tempat_lahir)
        postData.append('tgl_lahir', data.tgl_lahir)
        postData.append('jenis_kelamin', data.jenis_kelamin as string)
        postData.append('npwp', data.npwp as string)
        mutate(postData);
    };
    return (
        <>
            <IonPage>
                <KembaliHeader handleKembali={() => history.replace('profil')}/>
                <IonContent scrollY>
                    {isLoading ? (
                        <Loading/>
                    ) : (
                        <div className="flex flex-col mt-14   justify-center items-center ">
                            <form
                                onSubmit={handleSubmit(handleUpdateRekening)}
                                className="w-full px-12"
                            >
                                <h3 className="text-xl font-semibold">Form Informasi Dasar</h3>
                                <div className="flex flex-col justify-center items-center my-8 ">
                                    {/* USERNAME */}
                                    <div className="form_group">
                                        <label className="text-sm">Username</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("username")}
                                        />
                                        <LabelError errorMessage={errors.username?.message}/>
                                    </div>
                                    {/* NAMA LENGKAP */}
                                    <div className="form_group">
                                        <label className="text-sm">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("nama_lengkap")}
                                        />
                                        <LabelError errorMessage={errors.nama_lengkap?.message}/>
                                    </div>
                                    {/* TEMPAT LAHIR */}
                                    <div className="form_group">
                                        <label className="text-sm">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("tempat_lahir")}
                                        />
                                        <LabelError errorMessage={errors.tempat_lahir?.message}/>
                                    </div>
                                    {/* TANGGAL LAHIR */}
                                    <div className="form_group">
                                        <label className="text-sm">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("tgl_lahir")}
                                        />
                                        <LabelError errorMessage={errors.tgl_lahir?.message}/>
                                    </div>
                                    {/* JENIS KELAMIN */}
                                    <div className="form_group">
                                        <label className="text-sm">Jenis Kelamin</label>
                                        <select
                                            className="select select-bordered mt-2 rounded-xl select-sm w-full pr-2"
                                            {...register("jenis_kelamin")}
                                        >
                                            <option value="laki-laki">Laki Laki</option>
                                            <option value="perempuan">Perempuan</option>
                                        </select>
                                        <LabelError errorMessage={errors.jenis_kelamin?.message}/>
                                    </div>
                                    {/* NPWP */}
                                    <div className="form_group">
                                        <label className="text-sm">Npwp</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("npwp")}
                                        />
                                        <LabelError errorMessage={errors.npwp?.message}/>
                                    </div>
                                    {/* JABATAN */}
                                    <div className="form_group">
                                        <label className="text-sm">Jabatan</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("jabatan")}
                                            disabled
                                        />
                                        <LabelError errorMessage={errors.jabatan?.message}/>
                                    </div>
                                    {/* INSTANSI */}
                                    <div className="form_group">
                                        <label className="text-sm">Instansi</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("instansi")}
                                            disabled
                                        />
                                        <LabelError errorMessage={errors.instansi?.message}/>
                                    </div>
                                    {/* KODE PEGAWAI */}
                                    <div className="form_group">
                                        <label className="text-sm">Kode Pegawai</label>
                                        <input
                                            type="text"
                                            className="input input-bordered mt-2 rounded-xl input-sm w-full"
                                            {...register("kode_pegawai")}
                                            disabled
                                        />
                                        <LabelError errorMessage={errors.kode_pegawai?.message}/>
                                    </div>
                                </div>

                                <button
                                    className={`btn bg-red-600 border-red-600 w-full my-4 ${
                                        isUpdateLoading ? "animate-pulse" : ""
                                    }`}
                                    type="submit"
                                    disabled={isUpdateLoading}
                                >
                                    {isUpdateLoading ? "Loading..." : "Submit"}
                                </button>
                            </form>
                        </div>
                    )}
                </IonContent>
            </IonPage>
            <NotifAlert
                isOpen={successAlert}
                handleCancel={() => setSuccessAlert(false)}
                message="Berhasil Mengedit Informasi Dasar"
                type="success"
                setIsOpen={setSuccessAlert}
            />
            <NotifAlert
                isOpen={dangerAlert}
                handleCancel={() => setDangerAlert(false)}
                message="Gagal Mengedit Informasi Dasar"
                type="danger"
                setIsOpen={setDangerAlert}
            />
        </>
    );
};

export default InformasiDasar;

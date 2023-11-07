import {IonContent, IonModal} from "@ionic/react";
import LabelError from "../../components/LabelError";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import {useForm, useWatch} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {usePost} from "../../hooks/useApi";
import * as yup from "yup";
import {useDistanceStore} from "../../store/DistanceStore";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import useLocationStore from "../../store/LocationStore";
import {useQueryClient} from "react-query";
import usePesantrenLocationStore from "../../store/usePesantrenLocationStore";

type PresensiModalType = {
    tipe: string,
    isShown: boolean
}

const schema = yup
    .object({
        keterangan: yup.string().required(),
        alasan: yup.string().notRequired()
    })
    .required();
type FormData = yup.InferType<typeof schema> & { foto: string, tipe: string, maps_absen: string };
const PresensiModal = ({absen, setAbsensi, setDangerAlert, setSuccessAlert}: {
    absen: PresensiModalType,
    setAbsensi: React.Dispatch<PresensiModalType>
    setDangerAlert: React.Dispatch<boolean>,
    setSuccessAlert: React.Dispatch<boolean>
}) => {
    const {distance} = useDistanceStore()
    const [user] = useLocalStorage("user");
    const {latLng: {latitude, longitude}} = useLocationStore()
    const {latLng} = usePesantrenLocationStore()
    const {
        register,
        formState: {errors},
        handleSubmit,
        control
    } = useForm<FormData>({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            keterangan: 'Bekerja Di Kantor',
            alasan: ''
        }
    });

    const keterangan = useWatch({
        control,
        name: 'keterangan'
    })

    const queryClient = useQueryClient()
    const {mutate, isLoading} = usePost({
        name: "absen-karyawan",
        endpoint: `do-absensi`,
        onSuccessCallback: () => {
            queryClient.invalidateQueries({
                queryKey: ['absens', 'check-absen']
            }).then(() => {
                setAbsensi({
                    isShown: false,
                    tipe: 'datang'
                })
                setSuccessAlert(true);
            }).catch((error) => console.log(error));

        },
        onErrorCallback: () => {
            setAbsensi({
                isShown: false,
                tipe: 'datang'
            })
            setDangerAlert(true)
        },
    });


    const handleUpdate = (data: FormData) => {
        Camera.getPhoto({
            quality: 10,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
        }).then((photoResult) => {
            const postData = new FormData();
            postData.append('foto', photoResult.base64String as string)
            postData.append('tipe', absen.tipe)
            postData.append('map_absen', `${latitude},${longitude}`)
            postData.append('nama_pegawai', user?.nama_lengkap)
            postData.append('kode_pegawai', user?.kode_pegawai)
            postData.append('keterangan', data.keterangan)
            postData.append('alasan', data?.alasan as string)
            mutate(postData)
        });
    };

    return <IonModal isOpen={absen.isShown}>

        <IonContent scrollY>
            <div className="flex flex-col mt-12   justify-center items-center ">
                <form
                    onSubmit={handleSubmit(handleUpdate)}
                    className="w-full px-12"
                >
                    <h3 className="text-xl font-semibold capitalize">Form Absensi {absen.tipe}</h3>
                    <div className="flex flex-col justify-center items-center ">

                        {/*KETERANGAN*/}
                        <div className="form_group">
                            <label className="text-sm">Keterangan</label>
                            <select
                                className="select select-bordered mt-2 rounded-xl select-sm w-full pr-2"
                                {...register("keterangan")}
                            >
                                <option value="Bekerja Di Kantor">Bekerja Di Kantor</option>
                                <option value="Bekerja Di Rumah / WFH">Bekerja Di Rumah / WFH</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Cuti">Cuti</option>
                            </select>
                            <LabelError
                                errorMessage={errors.keterangan?.message}
                            />
                        </div>

                        {/* ALASAN */}
                        {
                            (absen.tipe === 'datang' && keterangan !== 'Bekerja Di Kantor') &&
                            <div className="form_group">
                                <label className="text-sm">Alasan</label>
                                <textarea
                                    className="textarea textarea-bordered mt-2 rounded-xl textarea-sm w-full"
                                    {...register("alasan")}
                                />
                                <LabelError errorMessage={errors.alasan?.message}/>
                            </div>
                        }
                    </div>

                    <button
                        className={`btn bg-red-600 border-red-600 w-full my-4 ${
                            distance >= latLng.radius && keterangan === 'Bekerja Di Kantor' ? "animate-pulse !border-none" : ""
                        }`}
                        type="submit"
                        disabled={distance >= latLng.radius && keterangan === 'Bekerja Di Kantor'}
                    >
                        {isLoading ? `Loading...` :
                            distance >= latLng.radius && keterangan === 'Bekerja Di Kantor' ? "Anda Belum Berada di Lokasi Absen" : "Lakukan Absensi"}
                    </button>


                    <button
                        className={`btn !bg-primary !border-primary w-full`}
                        onClick={() => setAbsensi({
                            tipe: absen.tipe,
                            isShown: false
                        })}
                        type={"button"}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </IonContent>
    </IonModal>
}


export default PresensiModal
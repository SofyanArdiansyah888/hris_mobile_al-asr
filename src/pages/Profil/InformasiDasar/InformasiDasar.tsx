import { yupResolver } from "@hookform/resolvers/yup";
import { IonContent, IonPage } from "@ionic/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import * as yup from "yup";
import KembaliHeader from "../../../components/KembaliHeader";
import LabelError from "../../../components/LabelError";
import Loading from "../../../components/Loading";
import NotifAlert from "../../../components/NotifAlert";
import { useGet, usePut } from "../../../hooks/useApi";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { GetDetailPayload } from "../../../models/GenericPayload";
import { KaryawanEntity } from "../../../models/Karyawan.entity";

const schema = yup
  .object({
    username: yup.string().required(),
    nama_lengkap: yup.string().required(),
    tempat_lahir: yup.string().required(),
    jenis_kelamin: yup.string().notRequired(),
    tanggal_lahir: yup.string().required(),
    status_pernikahan: yup.string().notRequired(),
    agama: yup.string().notRequired(),
    golongan_darah: yup.string().notRequired(),
    jumlah_anak: yup.number().notRequired(),
    tanggal_bergabung: yup.string().notRequired(),
    pendidikan_terakhir: yup.string().notRequired(),
    nik: yup.string().notRequired(),
    nip: yup.string().notRequired(),
    npwp: yup.string().notRequired(),
    atasan: yup.string().notRequired(),
    telepon: yup.string().notRequired(),
    email: yup.string().notRequired(),
    alamat_lengkap: yup.string().notRequired(),
    status_karyawan: yup.string().notRequired(),
    shift: yup.string().notRequired(),

  })
  .required();
type FormData = yup.InferType<typeof schema>;

const InformasiDasar: React.FC = () => {
  const [user] = useLocalStorage("user");
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { data: karyawan, isLoading } = useGet<
    GetDetailPayload<KaryawanEntity>
  >({
    name: "karyawan",
    endpoint: `karyawans/${user?.karyawan.id}`,
  });

  const { mutate, isLoading: isUpdateLoading } = usePut({
    name: "karyawan",
    endpoint: `karyawans/${user?.karyawan?.id}/update-profil`,
    onSuccessCallback: () => {
      setSuccessAlert(true);
    },
    onErrorCallback: () => setDangerAlert(true),
  });

  useEffect(() => {
    if (karyawan) {
      // setValue("username", karyawan.data.user.name);
      // setValue('nama_lengkap',karyawan.data.nama_lengkap)
      // setValue("tempat_lahir", karyawan.data.tempat_lahir);
      // setValue("tanggal_lahir", karyawan.data.tanggal_lahir);
      // setValue("jenis_kelamin", karyawan.data.jenis_kelamin);
      // setValue("status_pernikahan", karyawan.data.status_pernikahan);
      // setValue("agama", karyawan.data.agama);
      // setValue("golongan_darah", karyawan.data.golongan_darah);
      // setValue("jumlah_anak", karyawan.data.jumlah_anak);
      // setValue("tanggal_bergabung", karyawan.data.tanggal_bergabung);
      // setValue("pendidikan_terakhir", karyawan.data.pendidikan_terakhir);
      // setValue("nik", karyawan.data.nik);
      // setValue("nip", karyawan.data.nip);
      // setValue("npwp", karyawan.data.npwp);
      // if(karyawan.data?.atasan) setValue("atasan", karyawan.data?.atasan?.nama_lengkap);
      // setValue("telepon", karyawan.data.telepon);
      // setValue("email", karyawan.data.user.email);
      // setValue("alamat_lengkap", karyawan.data.alamat_lengkap);
      // setValue("status_karyawan", karyawan.data.status_karyawan);
      // if(karyawan.data.shift) setValue("shift", karyawan.data.shift.nama_shift);
    }
  }, [karyawan, setValue]);

  const history = useHistory();

  const handleUpdateRekening = (data: FormData) => {
    mutate(data);
  };
  return (
    <>
      <IonPage>
        <KembaliHeader handleKembali={() => history.replace('profil')} />
        <IonContent scrollY>
          {isLoading ? (
            <Loading />
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
                    <LabelError errorMessage={errors.username?.message} />
                  </div>
                  {/* NAMA LENGKAP */}
                  <div className="form_group">
                    <label className="text-sm">Nama Lengkap</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("nama_lengkap")}
                    />
                    <LabelError errorMessage={errors.nama_lengkap?.message} />
                  </div>
                  {/* TEMPAT LAHIR */}
                  <div className="form_group">
                    <label className="text-sm">Tempat Lahir</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("tempat_lahir")}
                    />
                    <LabelError errorMessage={errors.tempat_lahir?.message} />
                  </div>
                  {/* TANGGAL LAHIR */}
                  <div className="form_group">
                    <label className="text-sm">Tanggal Lahir</label>
                    <input
                      type="date"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("tanggal_lahir")}
                    />
                    <LabelError errorMessage={errors.tanggal_lahir?.message} />
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
                    <LabelError errorMessage={errors.jenis_kelamin?.message} />
                  </div>
                  {/* STATUS PERNIKAHAN */}
                  <div className="form_group">
                    <label className="text-sm">Status Pernikahan</label>
                    <select
                      className="select select-bordered mt-2 rounded-xl select-sm w-full pr-2"
                      {...register("status_pernikahan")}
                    >
                      <option value="menikah">Menikah</option>
                      <option value="belum menikah">Belum Menikah</option>
                      <option value="janda/duda">Janda / Duda</option>
                    </select>
                    <LabelError
                      errorMessage={errors.status_pernikahan?.message}
                    />
                  </div>
                  {/* GOLONGAN DARAH */}
                  <div className="form_group">
                    <label className="text-sm">Golongan Darah</label>
                    <select
                      className="select select-bordered mt-2 rounded-xl select-sm w-full pr-2"
                      {...register("golongan_darah")}
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="ab">AB</option>
                      <option value="o">O</option>
                    </select>
                    <LabelError errorMessage={errors.golongan_darah?.message} />
                  </div>
                  {/* JUMLAH ANAK */}
                  <div className="form_group">
                    <label className="text-sm">Jumlah Anak</label>
                    <input
                      type="number"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("jumlah_anak")}
                    />
                    <LabelError errorMessage={errors.jumlah_anak?.message} />
                  </div>
                  {/* AGAMA */}
                  <div className="form_group">
                    <label className="text-sm">Agama</label>
                    <select
                      className="select select-bordered mt-2 rounded-xl select-sm w-full pr-2"
                      {...register("agama")}
                    >
                      <option value="islam">Islam</option>
                      <option value="kristen protestan">
                        Kristen Protestan
                      </option>
                      <option value="kristen katolik">Kristen Katolik</option>
                      <option value="hindu">Hindu</option>
                      <option value="budha">Budha</option>
                      <option value="konghuchu">Konghuchu</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    <LabelError errorMessage={errors.agama?.message} />
                  </div>

                  {/* PENDIDIKAN TERAKHIR */}
                  <div className="form_group">
                    <label className="text-sm">Pendidikan Terakhir</label>
                    <select
                      className="select select-bordered mt-2 rounded-xl select-sm w-full"
                      {...register("pendidikan_terakhir")}
                    >
                      <option value="putus sd">Putus SD</option>
                      <option value="sd  / sederajat">SD / Sederajat</option>
                      <option value="smp / sederajat">SMP / Sederajat</option>
                      <option value="sma / sederajat">SMA / Sederajat</option>
                      <option value="paket a">Paket A</option>
                      <option value="paket b">Paket B</option>
                      <option value="paket c">Paket C</option>
                      <option value="d1">D1</option>
                      <option value="d2">D2</option>
                      <option value="d3">D3</option>
                      <option value="d4">D4</option>
                      <option value="s1">S1</option>
                      <option value="s2">S2</option>
                      <option value="s2 terapan">S2 Terapan</option>
                      <option value="s3">S3</option>
                      <option value="s3 terapan">S3 Terapan</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                    <LabelError
                      errorMessage={errors.pendidikan_terakhir?.message}
                    />
                  </div>

                  {/* NIK */}
                  <div className="form_group">
                    <label className="text-sm">Nik</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("nik")}
                    />
                    <LabelError errorMessage={errors.nik?.message} />
                  </div>

                  {/* NIP */}
                  <div className="form_group">
                    <label className="text-sm">Nip</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("nip")}
                    />
                    <LabelError errorMessage={errors.nip?.message} />
                  </div>

                  {/* NPWP */}
                  <div className="form_group">
                    <label className="text-sm">Npwp</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("npwp")}
                    />
                    <LabelError errorMessage={errors.npwp?.message} />
                  </div>

                  {/* ATASAN */}
                  <div className="form_group">
                    <label className="text-sm">Atasan</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("atasan")}
                      disabled
                    />
                    <LabelError errorMessage={errors.atasan?.message} />
                  </div>

                  {/* TELEPON */}
                  <div className="form_group">
                    <label className="text-sm">Telepon</label>
                    <input
                      type="number"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("telepon")}
                    />
                    <LabelError errorMessage={errors.telepon?.message} />
                  </div>

                  {/* EMAIL */}
                  <div className="form_group">
                    <label className="text-sm">Email</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("email")}
                    />
                    <LabelError errorMessage={errors.email?.message} />
                  </div>

                  {/* ALAMAT LENGKAP */}
                  <div className="form_group">
                    <label className="text-sm">Alamat Lengkap</label>
                    <textarea
                      className="textarea textarea-bordered mt-2 rounded-xl textarea-sm w-full"
                      {...register("alamat_lengkap")}
                    />
                    <LabelError errorMessage={errors.alamat_lengkap?.message} />
                  </div>

                  {/* STATUS KARYAWAN */}
                  <div className="form_group">
                    <label className="text-sm">Status Karyawan</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("status_karyawan")}
                      disabled
                    />
                    <LabelError
                      errorMessage={errors.status_karyawan?.message}
                    />
                  </div>
                  {/* SHIFT */}
                  <div className="form_group">
                    <label className="text-sm">Shift</label>
                    <input
                      type="text"
                      className="input input-bordered mt-2 rounded-xl input-sm w-full"
                      {...register("shift")}
                      disabled
                    />
                    <LabelError errorMessage={errors.shift?.message} />
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

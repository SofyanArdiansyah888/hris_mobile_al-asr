import {IonContent, IonPage} from "@ionic/react";
import {LockIcon} from "lucide-react";
import {ReactNode, useEffect, useState} from "react";
import {CiLogout} from "react-icons/ci";
import {MdInfoOutline,} from "react-icons/md/index";
import {useHistory} from "react-router";
import {useGet, useUploadPost} from "../../hooks/useApi";
import {useLocalStorage} from "../../hooks/useLocalStorage";
import {GetDetailPayload} from "../../models/GenericPayload";
import {useAuth} from "../../providers/AuthProvider";
import {Capacitor} from "@capacitor/core";
import {UserEntity} from "../../models/User.entity";

const Profil: React.FC = () => {
  const history = useHistory();
  const auth = useAuth();
  const [user] = useLocalStorage("user");
  const { data } = useGet<GetDetailPayload<UserEntity>>({
    name: "user",
    endpoint: `user/${user?.id_pegawai}/profil`,
  });

  const [image, setImage] = useState<any>("assets/logo-icon.png");

  useEffect(() => {
    if (data) {
      let fotoUrl = "assets/logo-icon.png";

      if (!(data.data.image === null || data.data.image === "")) {
        fotoUrl = `${process.env.REACT_APP_BASIC_URL}storage/profile/${data.data.image}`;
      }

      setTimeout(() => {
        setImage(fotoUrl);
      }, 300);
    }
  }, [data]);


  const menus: IList[] = [
    {
      text: "Ubah Password",
      icon: <LockIcon className="w-5 h-5 text-accent" />,
      handleClick: () => history.push("/ubah-password"),
    },
    {
      text: "Informasi Dasar",
      icon: <MdInfoOutline className="w-5 h-5 text-accent" />,
      handleClick: () => history.push("/informasi-dasar"),
    },
    // {
    //   text: "Data Keluarga",
    //   icon: <MdFamilyRestroom className="w-5 h-5 text-accent" />,
    //   handleClick: () => history.push("/data-keluarga"),
    // },
    // {
    //   text: "Data Pelatihan",
    //   icon: <MdModelTraining className="w-5 h-5 text-accent" />,
    //   handleClick: () => history.push("/data-pelatihan"),
    // },
    //
    // {
    //   text: "Data Pendidikan",
    //   icon: <MdOutlineSchool className="w-5 h-5 text-accent" />,
    //   handleClick: () => history.push("/data-pendidikan"),
    // },
    // {
    //   text: "Data Dokumen",
    //   icon: <HiOutlineDocument className="w-5 h-5 text-accent" />,
    //   handleClick: () => history.push("/data-dokumen"),
    // },
    // {
    //   text: "Data Rekening",
    //   icon: <HiOutlineWallet className="w-5 h-5 text-accent" />,
    //   handleClick: () => history.push("/data-rekening"),
    // },
    {
      text: "Keluar",
      icon: <CiLogout className="w-5 h-5 text-accent" />,
      handleClick: () => {
        auth.logout();
        window.location.reload();
      },
    },
  ];

  const {mutate} = useUploadPost({
    name:'user',
    endpoint:`user/${user?.id_pegawai}/update-photo-profil`
  })
// Your location lets us ensure an accurate position where are you while doing this attendance
  const handleImageChange = (e: any) => {
    const selectedImage = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (reader.readyState === 2) {
        setImage(reader.result);

        const formData = new FormData();
        let base64Image = reader?.result as string;
        formData.append('file', base64Image.replace(/^data:image\/[a-z]+;base64,/, ''));
        formData.append('id',user?.id_pegawai)
        mutate(formData)
      }
    };
    reader.readAsDataURL(selectedImage);



  };
  return (
    <IonPage>
      <IonContent>
        <div className={`px-8 ${Capacitor.getPlatform() === 'ios' ? "pt-16" : ""}`}>
          <div className="flex flex-row items-center w-full gap-8 my-10">
            <div className="bg-slate-300 w-20 h-20 rounded-full  ">
              <label>
                <img
                  src={image}
                  onError={() => setImage('assets/logo-icon.png')}
                  alt="Gambar Profil"
                  className="rounded-full w-20 h-20 object-cover "
                ></img>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
            {/* HEADER TEXT */}
            <div className="text-left flex-1">
              <h1 className="text-lg mt-1 mb-0 font-semibold capitalize">
                {data?.data.nama_lengkap}
              </h1>
              <h4 className="text-xs text-slate-500 mt-1 capitalize">
                {data?.data?.jabatan}
              </h4>
            </div>
          </div>
          <ul className="max-w-md divide-y-[1px] divide-secondary mb-4 ">
            {menus.map((props, index) => (
              <List {...props} key={index} />
            ))}
          </ul>
        </div>
      </IonContent>
    </IonPage>
  );
};

interface IList {
  icon: ReactNode;
  text: string;
  handleClick(): void;
}
function List({ icon, text, handleClick }: IList) {
  return (
    <li className="py-3 cursor-pointer">
      <div
        className="flex flex-row justify-between gap-3 items-center w-full"
        onClick={handleClick}
      >
        <div className="flex gap-8 items-center">
          <div className="rounded-full p-3 bg-secondary  ">
            {icon}
          </div>
          <div className="text-sm  font-semibold">{text}</div>
        </div>

        {/*<div className="rounded-full p-3">*/}
        {/*  <ArrowRightCircleIcon className="w-6 h-6 text-primary bg-secondary" strokeWidth={1} />*/}
        {/*</div>*/}
      </div>
    </li>
  );
}

export default Profil;

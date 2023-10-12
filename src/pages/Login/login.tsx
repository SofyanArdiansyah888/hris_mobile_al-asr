import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { usePost } from "../../hooks/useApi";
import { UserEntity } from "../../models/User.entity";
import { useAuth } from "../../providers/AuthProvider";

// import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
// import { registerPlugin } from "@capacitor/core";
// const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
import { IonContent } from "@ionic/react";
import NotifAlert from "../../components/NotifAlert";
const schema = yup
  .object({
    name: yup.string().required(),
    password: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const auth = useAuth();
  const [successAlert, setSuccessAlert] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading } = usePost<FormData>({
    endpoint: "login",
    name: "login",
    onSuccessCallback: (data: UserEntity) => {
      auth.login(data);
    },
    onErrorCallback: (error: any) => {
      if (error?.response?.status === 422) {
        setError("name", { message: error.response?.data.errors.name[0] });
      } else {
        setDangerAlert(true);
      }
    },
  });

  const handleLogin = (data: FormData) => {
    mutate(data);
  };

  return (
    <>
    <IonContent  >
      <div className="container-auth relative">
        {/* <div className="absolute right-[-250px]  -z-10">
          <img src={"assets/logo.png"} className="w-[500px] h-[500px] opacity-10" alt="Logo Nobel" />  
      </div> */}
        <img src={"assets/logo.png"} className="w-40 h-40 " alt="Logo Nobel" />
        <h1 className="title font-semibold">HRIS Nobel</h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="form_area px-3 w-[320px] gap-6">
            <h3 className="flex justify-start w-full   font-semibold text-xl  ">
              Login
            </h3>

            <div className="form_group ">
              <input
                type="text"
                className="input input-bordered  rounded-xl w-full mt-2 "
                placeholder="Username"
                {...register("name")}
              />
              <small className="text-xs text-red-700 mt-2 font-semibold pl-4">
                {errors.name?.message}
              </small>
            </div>

            <div className="form_group">
              <input
                className="input input-bordered  rounded-xl w-full mt-2"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              <small className="text-xs text-red-700 mt-2 font-semibold pl-4">
                {errors.password?.message}
              </small>
            </div>

            <button
              className={`btn bg-[#1f1d42] border-[#1f1d42] w-full my-4 ${
                isLoading ? "animate-pulse" : ""
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <NotifAlert
        isOpen={successAlert}
        handleCancel={() => setSuccessAlert(false)}
        message="Berhasil Login"
        type="success"
        setIsOpen={setSuccessAlert}
      />
      <NotifAlert
        isOpen={dangerAlert}
        handleCancel={() => setDangerAlert(false)}
        message="Server tidak merespon !"
        type="danger"
        setIsOpen={setDangerAlert}
      />
      </IonContent>
    </>
  );
}

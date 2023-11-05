import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { usePost } from "../../hooks/useApi";
import { useAuth } from "../../providers/AuthProvider";

// import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
// import { registerPlugin } from "@capacitor/core";
// const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
import { IonContent } from "@ionic/react";
import NotifAlert from "../../components/NotifAlert";
const schema = yup
  .object({
    username: yup.string().required(),
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

  const { mutate, isLoading } = usePost({
    endpoint: "login",
    name: "login",
    onSuccessCallback: (data) => {
      if(data.status === true)
        auth.login(data.data);
      else
        setError('username',{message: data.message})
    }
  });

  const handleLogin = (data: FormData) => {
    const postData = new FormData();
    postData.append('username',data.username)
    postData.append('password',data.password)
    mutate(postData);
  };

  return (
    <>
    <IonContent  >
      <div className="container-auth relative">
        {/* <div className="absolute right-[-250px]  -z-10">
          <img src={"assets/logo.png"} className="w-[500px] h-[500px] opacity-10" alt="Logo Nobel" />
      </div> */}
        <img src={"assets/logo.png"} className="mx-auto mb-12" alt="Logo Nobel" />
        {/*<h1 className="title !font-bold">HRIS <span className={"text-primary"}>Al-Asr</span> </h1>*/}
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
                {...register("username")}
              />
              <small className="text-xs text-red-700 mt-2 font-semibold pl-4">
                {errors.username?.message}
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
              className={`btn bg-primary border-primary w-full my-4 ${
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

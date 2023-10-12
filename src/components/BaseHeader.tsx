import { Capacitor } from "@capacitor/core";
import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";

interface IBaseHeader {
  title: string;
  buttons?: JSX.Element;
}

export default function BaseHeader({ title, buttons }: IBaseHeader) {
  return (
    <IonHeader className={`ion-no-border border-b-4 border-black ${Capacitor.getPlatform() === 'ios' ? "items-end h-24" : "items-center" } `} >
      <IonToolbar  >
        {buttons}
        <IonTitle className="capitalize">{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
}

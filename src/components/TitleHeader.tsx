import { IonHeader } from "@ionic/react";
import {Capacitor } from '@capacitor/core'
interface ITitleHeader {
  title: string;
  rightIcon?: JSX.Element;
}

export default function TitleHeader({ title, rightIcon }: ITitleHeader) {
  return (
    <IonHeader className={`ion-no-border p-4  flex justify-between bg-primary text-secondary ${Capacitor.getPlatform() === 'ios' ? "items-end h-24" : "items-center" }`}>
      <div className="font-semibold text-lg">{title}</div>
      {rightIcon}
    </IonHeader>
  );
}

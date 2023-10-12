import { Capacitor } from "@capacitor/core";
import { IonHeader } from "@ionic/react";
import { ArrowLeftCircle } from "lucide-react";

interface IKembaliHeader {
  handleKembali(): void;
  rightIcon?: JSX.Element;
}

export default function KembaliHeader({
  handleKembali,
  rightIcon,
}: IKembaliHeader) {
  return (
    <IonHeader className={`ion-no-border p-4  flex justify-between bg-white ${Capacitor.getPlatform() === 'ios' ? "items-end h-24" : "items-center" } `}>
      <div
        className="flex flex-row items-center gap-2 cursor-pointer text-sm"
        onClick={handleKembali}
      >
        <ArrowLeftCircle className="h-6 w-6" strokeWidth={1} />
        Kembali
      </div>
      {rightIcon}
    </IonHeader>
  );
}

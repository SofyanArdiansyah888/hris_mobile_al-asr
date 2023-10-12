import { IonDatetime } from "@ionic/react";
import { useState } from "react";

interface IDateCallendar {
  isOpen: boolean;
  handleCancel(): void;
  handleSubmit(value: string | string[] | null | undefined): void;
  presentation:
    | "date-time"
    | "time-date"
    | "date"
    | "time"
    | "month"
    | "year"
    | "month-year";
    defaultValue ?: string,
    preferWheel?: boolean
}

export default function DateCallendar({
  handleSubmit,
  handleCancel,
  isOpen,
  presentation,
  defaultValue,
  preferWheel
}: IDateCallendar) {
  const [date, setDate] = useState<string | string[] | null | undefined>(defaultValue);
  return (
    <>
      <input type="checkbox" checked={isOpen} className="modal-toggle" />
      <div className="modal ">
        <div className="modal-box w-[350px] overflow-hidden">
          <h3 className="text-xl  mb-6">Filter Tanggal</h3>

            <IonDatetime
              locale="id-ID"
              presentation={presentation}
              preferWheel={preferWheel ? true : preferWheel}
              value={date}
              onIonChange={(e) => setDate(e.detail.value)}
              className="text-[9px] mx-auto"
              size="cover"
            />


          <div className="modal-action mt-4">
            <button className="btn bg-black" onClick={handleCancel}>
              Cancel
            </button>

            <button
              className="btn"
              onClick={() => {
                handleSubmit(date);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import { MdOutlineDangerous } from "react-icons/md";
import { IGenericPos, useDelete } from "../hooks/useApi";

interface IDeleteAlert {
  isOpen: boolean;
  handleCancel(): void;
  message: string;
  deleteProps: IGenericPos
}

export default function DeleteAlert({
  handleCancel,
  isOpen,
  message,
  deleteProps
}: IDeleteAlert) {
  
  const { mutate, isLoading } = useDelete(deleteProps);

  return (
    <>
      <input type="checkbox" checked={isOpen} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-[320px]">
          <h3 className="text-lg font-semibold mb-6">Delete Confirmation</h3>
          <div className="w-full text-center ">
            <MdOutlineDangerous className="text-red-300 mx-auto w-20 h-20" />
            <p className="my-4 text-sm font-semibold">{message}</p>
          </div>  

          <div className="modal-action mt-0 ">

            <button className="btn btn-outline bg-red-700 border-red-700 text-white text-sm" disabled={isLoading} onClick={() => mutate({})}>
              {isLoading ? "Loading..." : "Submit"}
            </button>
            <button className="btn btn-outline text-sm" onClick={handleCancel}>
              Batal
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

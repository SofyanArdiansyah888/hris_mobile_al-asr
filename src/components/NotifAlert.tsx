import { CheckCircle2Icon } from "lucide-react";
import { useEffect } from "react";
import { MdOutlineDangerous, MdWarning } from "react-icons/md";

interface INotifAlert {
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  handleCancel(): void;
  message: string;
  type: 'danger' | 'warning' | 'success',
  timeout?: number
}

export default function NotifAlert({
  handleCancel,
  isOpen,
  message,
  type,
  setIsOpen,
  timeout
}: INotifAlert) {
  useEffect(() => {
    let defaultTimeout = 2000;
    if(timeout){
      defaultTimeout = timeout;
    }
    setTimeout(() => {
      setIsOpen(false)
    },defaultTimeout)

  },[isOpen,setIsOpen,timeout])
  
  const AlertIcon = () => {
    switch(type){
      case 'danger' : 
      return <MdOutlineDangerous className="text-red-300 mx-auto w-20 h-20" />
      case 'warning' : 
      return <MdWarning className="text-yellow-300 mx-auto w-20 h-20" />
      case 'success' : 
      return <CheckCircle2Icon className="text-green-300 mx-auto w-20 h-20" />
    }
    
  }

  return (
    <>
      <input type="checkbox" checked={isOpen} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-[320px]">
          <h3 className="text-xl font-semibold mb-6">Notification</h3>
          <div className="w-full text-center ">
            <AlertIcon />
            <p className="my-4 text-lg">{message}</p>
          </div>  

          <div className="modal-action mt-0">
            <button className="btn btn-outline" onClick={handleCancel}>
              Ok
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

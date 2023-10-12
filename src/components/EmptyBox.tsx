import { HiOutlineFolder } from "react-icons/hi2";

export default function EmptyBox({message} : {message: string}) {
  return (
    <>
      <div className="flex flex-col text-lg items-center h-full gap-4 justify-center opacity-50 capitalize w-52 text-center mx-auto">
        <HiOutlineFolder className="w-16 h-16" strokeWidth={0.5} />
        {message}
      </div>
    </>
  );
}

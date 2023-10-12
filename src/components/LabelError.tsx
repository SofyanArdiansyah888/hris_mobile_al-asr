export default function LabelError({errorMessage} : {errorMessage: string | undefined}) {
  return (
    <>
      <label className="mt-2 text-xs font-semibold text-red-500 capitalize">
        {errorMessage}
      </label>
    </>
  );
}

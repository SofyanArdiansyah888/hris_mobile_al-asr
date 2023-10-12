import React, { createRef, useEffect } from "react";
import { init } from "./dropzone";
import DropzoneJs, { DropzoneOptions } from "dropzone";

export interface DropzoneElement extends HTMLDivElement {
  dropzone: DropzoneJs;
}

export interface DropzoneProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  options: DropzoneOptions;
  getRef: (el: DropzoneElement) => void;
}

function Dropzone(props: DropzoneProps) {
  const fileUploadRef = createRef<DropzoneElement>();

  useEffect(() => {
    if (fileUploadRef.current) {
      props.getRef(fileUploadRef.current);
      init(fileUploadRef.current, props);
    }
  }, [props.options, props.children, fileUploadRef, props]);

  const { options, getRef, ...computedProps } = props;
  return (
    <div
      {...computedProps}
      ref={fileUploadRef}
      className="w-full [&.dropzone]:border-2 [&.dropzone]:border-dashed dropzone [&.dropzone]:border-zinc-300 "
    >
      <div className="dz-message">{props.children}</div>
    </div>
  );
}

Dropzone.defaultProps = {
  options: {},
  getRef: () => {},
};

export default Dropzone;

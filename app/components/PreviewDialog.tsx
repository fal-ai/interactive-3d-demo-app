"use client";
import React, { ReactNode, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { USDZExporter } from "three/addons/exporters/USDZExporter.js";
import "@google/model-viewer";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/Addons.js";
import ModelViewer from "./ModelViewer";

const PreviewDialog = ({
  children,
  modelURL,
}: {
  children: ReactNode;
  modelURL: string;
}) => {
  const [usdzURL, setUsdzURL] = useState<string | null>(null);
  const gltf = useGLTF(modelURL);

  const generateUSDZ = async (gltf: GLTF) => {
    const exporter = new USDZExporter();
    const arraybuffer = await exporter.parse(gltf.scene);
    const blob = new Blob([arraybuffer], {
      type: "application/octet-stream",
    });

    console.log(blob);
    setUsdzURL(URL.createObjectURL(blob));
  };

  useEffect(() => {
    if (modelURL && gltf) {
      // @ts-expect-error
      generateUSDZ(gltf as GLTF);
    }
  }, [modelURL, gltf]);

  const handleDownload = () => {
    if (modelURL) {
      const link = document.createElement("a");
      link.href = modelURL;
      link.download = "model.glb";
      link.click();
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-950 border border-neutral-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-neutral-200 m-0 text-[17px] font-medium mb-4">
            Preview Model
          </Dialog.Title>
          <ModelViewer modelURL={modelURL} />

          <div className="flex items-center justify-end mt-6">
            <button
              onClick={handleDownload}
              className="bg-lime-700 border-t border-lime-600 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
            >
              Download
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="disabled:opacity-55 disabled:cursor-not-allowed text-neutral-100 hover:bg-neutral-700  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PreviewDialog;

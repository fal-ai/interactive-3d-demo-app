import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { imageTo3D, textToImage } from "../util/workflow";
import { Canvas } from "@react-three/fiber";
import ModelGLB from "./Model";
import { OrbitControls } from "@react-three/drei";

const CreateObjectWithAiDialog = ({
  children,
  onInsert,
}: {
  children: ReactNode;
  onInsert: (modelURL: string) => void;
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [modelURL, setModelURL] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    const image = await textToImage(prompt);
    if (image) {
      setImage(image);
    }

    return image;
  };

  const handleGenerateModel = async (image: string) => {
    if (!image) return;
    const url = await imageTo3D(image as string);

    setModelURL(url as any);
  };

  const handleGenerate = async () => {
    const image = await handleGenerateImage();
    if (!image) return null;
    await handleGenerateModel(image);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPrompt("");
      setImage(null);
      setModelURL(null);
    }
  };

  const handleInsert = () => {
    onInsert(modelURL as string);
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/50 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-neutral-950 border border-neutral-700 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-neutral-200 m-0 text-[17px] font-medium">
            Create 3D Object with AI
          </Dialog.Title>
          <fieldset className="flex flex-col items-start mt-4">
            <label className="text-neutral-500 mb-1 text-sm" htmlFor="name">
              Prompt
            </label>
            <textarea
              className="resize-none text-[13px] bg-neutral-800 text-neutral-200 border border-neutral-700 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] p-2 leading-none outline-none placeholder:text-neutral-600"
              id="prompt"
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A 3d model of a red car, volumetric, good lighting, professional photo shoot, studio"
            />
          </fieldset>

          <div className="flex mt-2 space-x-1">
            {image && (
              <div className="w-1/2 flex items-center justify-center">
                <img
                  src={image}
                  alt="Generated Image"
                  className="w-[200px] h-[200px] rounded-[4px]"
                />
              </div>
            )}

            {modelURL && (
              <div className="w-1/2 rounded-1 bg-black aspect-square">
                <Canvas>
                  <OrbitControls />
                  <ambientLight intensity={2} />
                  <directionalLight position={[0, 10, 0]} intensity={2.5} />
                  <directionalLight position={[0, 0, 10]} intensity={2.5} />
                  <directionalLight position={[10, 0, 0]} intensity={2.5} />
                  <directionalLight position={[0, -10, 0]} intensity={2.5} />
                  <ModelGLB url={modelURL as string} />
                </Canvas>
              </div>
            )}
          </div>
          <div className="mt-[25px] flex justify-end space-x-2">
            {!modelURL && (
              <button
                onClick={handleGenerate}
                className="bg-neutral-700 border-t border-neutral-600 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Generate
              </button>
            )}

            {modelURL && (
              <>
                <button
                  onClick={handleGenerate}
                  className="bg-neutral-700 border-t border-neutral-600 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                >
                  Regenerate
                </button>
                <Dialog.Close asChild>
                  <button
                    onClick={handleInsert}
                    className="bg-lime-600 border-t border-lime-500 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                  >
                    Insert
                  </button>
                </Dialog.Close>
              </>
            )}
          </div>
          <Dialog.Close asChild>
            <button
              className="text-neutral-100 hover:bg-neutral-700  absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
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

export default CreateObjectWithAiDialog;

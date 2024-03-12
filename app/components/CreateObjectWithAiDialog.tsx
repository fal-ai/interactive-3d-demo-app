import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as fal from "@fal-ai/serverless-client";
import { motion } from "framer-motion";

fal.config({ proxyUrl: "/api/proxy" });

import { putBackgroundToImage } from "../util/putBackgroundToImage";
import { Canvas } from "@react-three/fiber";
import ModelGLB from "./Model";
import { OrbitControls } from "@react-three/drei";
import Icon from "./Icon";

interface LogData {
  type: "loading" | "success" | "error";
  message: string;
  meta?: Record<string, any>;
}

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
  const [status, setStatus] = useState<LogData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageGenerate = async () => {
    const generatedImage = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt: `A 3d model of ${prompt}, volumetric, good lighting, professional photo shoot, studio`,
      },
    });

    // @ts-expect-error
    if (!generatedImage || generatedImage.images.length === 0) {
      setStatus({
        type: "error",
        message: "Failed to generate image",
      });
      setLoading(false);
      return null;
    }

    // @ts-expect-error
    const image = generatedImage.images[0];

    setImage(image.url);

    return image;
  };

  const removeBackground = async (image_url: string) => {
    const removedBgImage = await fal.subscribe("fal-ai/imageutils/rembg", {
      input: { image_url },
    });

    // @ts-expect-error
    if (!removedBgImage || !removedBgImage.image) {
      setStatus({
        type: "error",
        message: "Failed to remove background",
      });
      setLoading(false);
      return null;
    }

    // @ts-expect-error
    const imageWithoutBackground = removedBgImage.image;

    setImage(imageWithoutBackground.url);

    return imageWithoutBackground.url;
  };

  const putBackground = async (image_url: string) => {
    const imageWithBackgroundBlob = await putBackgroundToImage(image_url);

    if (!imageWithBackgroundBlob) {
      setStatus({
        type: "error",
        message: "Failed to add background",
      });
      setLoading(false);
      return null;
    }

    const imageWithBackground = URL.createObjectURL(imageWithBackgroundBlob);
    setImage(imageWithBackground);

    return imageWithBackgroundBlob;
  };

  const handleGenerateModel = async (image: Blob) => {
    const generatedModel = await fal.subscribe("fal-ai/triposr", {
      input: { image_url: image },
      logs: true,
    });

    // @ts-expect-error
    if (!generatedModel || !generatedModel.model_mesh) {
      setStatus({
        type: "error",
        message: "Failed to generate 3D model",
      });
      setLoading(false);
      return null;
    }

    // @ts-expect-error
    setModelURL(generatedModel.model_mesh.url);

    setStatus({
      type: "success",
      message: "3D Model generated",
    });
  };

  const handleGenerate = async () => {
    setLoading(true);

    setStatus({
      type: "loading",
      message: "Image generating...",
    });

    const image = await handleImageGenerate();

    setStatus({
      type: "loading",
      message: "Background removing...",
    });

    const imageWithoutBackground = await removeBackground(image.url);

    setStatus({
      type: "loading",
      message: "Flat background adding...",
    });

    const imageWithBackgroundBlob = await putBackground(imageWithoutBackground);

    setStatus({
      type: "loading",
      message: "3D Model generating...",
    });

    setTimeout(async () => {
      await handleGenerateModel(imageWithBackgroundBlob as Blob);
      setLoading(false);
    }, 200);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPrompt("");
      setImage(null);
      setModelURL(null);
      setStatus(null);
      setLoading(false);
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
              onKeyDown={(e) => e.stopPropagation()}
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
                  className="rounded-[4px]"
                />
              </div>
            )}

            {image && (
              <div className="w-1/2 rounded-[4px] bg-black aspect-square">
                {modelURL && (
                  <Canvas>
                    <OrbitControls maxDistance={1} />
                    <ambientLight intensity={2} />
                    <directionalLight position={[0, 10, 0]} intensity={2.5} />
                    <directionalLight position={[0, 0, 10]} intensity={2.5} />
                    <directionalLight position={[10, 0, 0]} intensity={2.5} />
                    <directionalLight position={[0, -10, 0]} intensity={2.5} />
                    <ModelGLB url={modelURL as string} />
                  </Canvas>
                )}
              </div>
            )}
          </div>

          <div className="mt-[25px] flex justify-between items-center space-x-2">
            <div className="flex items-center relative">
              {status && (
                <motion.div
                  className="absolute w-56 flex items-center space-x-1 text-xs"
                  key={status.message}
                  initial={{ opacity: 0, bottom: -20 }}
                  animate={{ opacity: 1, bottom: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    icon={
                      status.type === "loading"
                        ? "spinner"
                        : status.type === "success"
                        ? "check"
                        : "close"
                    }
                    className={
                      "mr-1 " +
                      (status.type === "loading"
                        ? "animate-spin text-neutral-500"
                        : status.type === "success"
                        ? " text-lime-500"
                        : "text-red-400")
                    }
                    size={16}
                  />
                  <div className="text-neutral-200">{status.message}</div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!modelURL && (
                <button
                  disabled={loading}
                  onClick={handleGenerate}
                  className="bg-neutral-700 border-t border-neutral-600 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                >
                  Generate
                </button>
              )}

              {modelURL && (
                <>
                  <button
                    disabled={loading}
                    onClick={handleGenerate}
                    className="disabled:opacity-55 disabled:cursor-not-allowed  bg-neutral-700 border-t border-neutral-600 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                  >
                    Regenerate
                  </button>
                  <Dialog.Close asChild>
                    <button
                      disabled={loading}
                      onClick={handleInsert}
                      className="disabled:opacity-55 disabled:cursor-not-allowed  bg-lime-600 border-t border-lime-500 inline-flex text-sm items-center justify-center rounded-[4px] px-3 py-2 leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                    >
                      Insert
                    </button>
                  </Dialog.Close>
                </>
              )}
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              disabled={loading}
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

export default CreateObjectWithAiDialog;

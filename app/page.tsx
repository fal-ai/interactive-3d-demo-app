"use client";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
  Text3D,
} from "@react-three/drei";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { nanoid } from "nanoid";

import ModelGLB, { ModelData } from "./components/Model";
import TransformWrapper from "./components/TransformWrapper";
import Icon from "./components/Icon";
import CreateObjectWithAiDialog from "./components/CreateObjectWithAiDialog";
import PreviewDialog from "./components/PreviewDialog";
import dynamic from "next/dynamic";

const Guide = dynamic(() => import("./components/Guide"), { ssr: false });

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([
    {
      id: nanoid(),
      type: "intro",
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
    },
  ]);
  const [enableRotate, setEnableRotate] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [mode, setMode] = useState<"translate" | "rotate" | "scale">(
    "translate"
  );

  const handleInsert = async (modelURL: string) => {
    setModels([
      ...models,
      {
        id: nanoid(),
        type: "glb",
        url: modelURL,
        transform: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      },
    ]);
  };

  const handleRect = () => {
    setModels([
      ...models,
      {
        id: nanoid(),
        type: "rect",
        transform: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      },
    ]);
  };

  const handleSphere = () => {
    setModels([
      ...models,
      {
        id: nanoid(),
        type: "circle",
        transform: {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        },
      },
    ]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        setEnableRotate(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        setEnableRotate(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.cookie = "fal-app=true; path=/; samesite=strict; secure;";
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeModelId === null) return;

      if (event.key === "Escape") {
        setActiveModelId(null);
        setMode("translate");
      }

      if (event.code === "Backspace") {
        setMode("translate");
      }

      if (event.code === "KeyM") {
        setMode("translate");
      } else if (event.code === "KeyR") {
        setMode("rotate");
      } else if (event.code === "KeyS") {
        setMode("scale");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveModelId, activeModelId]);

  const handleDelete = () => {
    setModels((models) => models.filter((model) => model.id !== activeModelId));
    setActiveModelId(null);
  };

  const activeModel = models.find((model) => model.id === activeModelId);

  return (
    <main className="flex text-neutral-200 bg-black min-h-screen flex-col items-center justify-between relative w-screen h-screen">
      <header className="py-5 px-3 md:px-10 text-sm space-x-2 flex w-full items-start justify-between bg-gradient-to-b via-black from-black h-32 to-transparent fixed z-50 left-0 top-0">
        <a
          href="https://github.com/fal-ai/interactive-3d-demo-app"
          className="flex items-center space-x-2"
          target="_blank"
        >
          <Icon icon="github" size={20} />
        </a>
        <div className="flex items-center">
          <span className="text-xs font-mono text-neutral-300">powered by</span>
          <a target="_blank" href="https://fal.ai">
            <Image src="/fal-ai.svg" alt="fal.ai" width={50} height={20} />
          </a>
        </div>
      </header>
      <div
        id="canvas-wrapper"
        className="w-screen h-screen absolute top-0 left-0"
      >
        <Canvas color="#000000">
          <PerspectiveCamera makeDefault position={[0, 15, 15]} />
          <OrbitControls enableRotate={enableRotate} />

          <directionalLight intensity={2.5} position={[0, 10, 0]} />
          <directionalLight intensity={1.5} position={[0, 0, 10]} />
          <pointLight position={[100, 100, 100]} intensity={0.8} />
          <hemisphereLight
            color="#ffffff"
            groundColor="#b9b9b9"
            position={[-7, 25, 13]}
            intensity={0.85}
          />

          {showGrid && (
            <gridHelper
              args={[1000, 1000]}
              rotation={[0, 0, 0]}
              material-opacity={0.1}
              material-color="#555"
            />
          )}
          {models.map((model, i) => (
            <TransformWrapper
              activeModelId={activeModelId}
              setActiveModelId={setActiveModelId}
              key={model.id}
              model={model}
              mode={mode}
              setModels={setModels}
            >
              {model.type === "intro" ? (
                <Text3D
                  key={model.type}
                  curveSegments={32}
                  bevelEnabled
                  bevelSize={0.04}
                  bevelThickness={0.5}
                  size={3}
                  height={0.5}
                  rotation={[-Math.PI / 2, 0, 0]}
                  font="/Alkhemikal_Medium.json"
                >
                  fal
                  <meshNormalMaterial />
                </Text3D>
              ) : model.type === "glb" && model.url ? (
                <ModelGLB url={model.url} />
              ) : model.type === "rect" ? (
                <Box args={[1, 1, 1]}>
                  <meshStandardMaterial
                    attach="material"
                    color={model.id === activeModelId ? "#ff6080" : "white"}
                  />
                </Box>
              ) : (
                <Sphere args={[1, 100, 100]}>
                  <meshStandardMaterial
                    attach="material"
                    color={model.id === activeModelId ? "#ff6080" : "white"}
                  />
                </Sphere>
              )}
            </TransformWrapper>
          ))}
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={0.25}
            width={200}
            height={200}
            blur={1}
            far={50}
          />
        </Canvas>
      </div>
      <div className="toolbar select-none text-neutral-200 p-1 divide-y divide-neutral-500 space-y-2 flex flex-col items-center justify-center h-auto rounded-full bg-neutral-900 border border-neutral-700 fixed left-10 top-1/3 translate-y-1/2">
        <div className="flex flex-col space-y-2">
          <button
            className="flex items-center justify-center w-5 h-5 rounded-full"
            onClick={handleRect}
          >
            <Icon icon="box" size={20} />
          </button>
          <button
            className="flex items-center justify-center w-5 h-5 rounded-full"
            onClick={handleSphere}
          >
            <Icon icon="circle" size={16} />
          </button>
          <CreateObjectWithAiDialog onInsert={handleInsert}>
            <button className="flex items-center justify-center w-5 h-5 rounded-full">
              <Icon icon="sparkle" size={16} />
            </button>
          </CreateObjectWithAiDialog>
        </div>

        <div className="pt-2">
          <button
            className={clsx(
              "flex items-center justify-center w-5 h-5 rounded-full",
              {
                "text-neutral-600": !showGrid,
              }
            )}
            onClick={() => setShowGrid((showGrid) => !showGrid)}
          >
            <Icon icon="grid" size={14} />
          </button>
        </div>
      </div>

      <Guide activeModelId={activeModelId} />

      {activeModelId && (
        <div className="toolbar select-none p-1 divide-x divide-neutral-600 space-x-2 flex items-center justify-center w-auto rounded-full bg-neutral-900 border border-neutral-700 fixed bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex space-x-2">
            <button
              className={clsx(
                "flex items-center justify-center h-6 w-6 rounded-full",
                {
                  "bg-lime-400 text-black": mode === "translate",
                }
              )}
              onClick={() => setMode("translate")}
            >
              <Icon icon="move" size={20} />
            </button>
            <button
              className={clsx(
                "flex items-center justify-center h-6 w-6 rounded-full",
                {
                  "bg-lime-400 text-black": mode === "rotate",
                }
              )}
              onClick={() => setMode("rotate")}
            >
              <Icon icon="rotate" size={16} />
            </button>
            <button
              className={clsx(
                "flex items-center justify-center h-6 w-6 rounded-full",
                {
                  "bg-lime-400 text-black": mode === "scale",
                }
              )}
              onClick={() => setMode("scale")}
            >
              <Icon icon="scale" size={18} />
            </button>
            <button
              className={clsx(
                "flex items-center justify-center h-6 w-6 rounded-full"
              )}
              onClick={handleDelete}
            >
              <Icon icon="trash" size={15} />
            </button>
          </div>

          <div className="px-2 flex items-center space-x-2">
            {activeModel?.url && (
              <PreviewDialog modelURL={activeModel?.url}>
                <button className="flex items-center justify-center w-5 h-5 rounded-full">
                  <Icon icon="arrow-download" size={16} />
                </button>
              </PreviewDialog>
            )}
            <span className="text-neutral-500 text-[10px] ml-6">ESC</span>
          </div>
        </div>
      )}
    </main>
  );
}

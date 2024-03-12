"use client";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { useEffect, useState } from "react";
import ModelGLB, { ModelData } from "./components/Model";
import { nanoid } from "nanoid";
import TransformWrapper from "./components/TransformWrapper";
import Icon from "./components/Icon";
import CreateObjectWithAiDialog from "./components/CreateObjectWithAiDialog";
import Image from "next/image";

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [enableRotate, setEnableRotate] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

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
          scale: [10, 10, 10],
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative w-screen h-screen">
      <div className="toolbar p-1 px-2 text-sm space-x-2 inline-flex items-center justify-center h-auto rounded-full bg-neutral-900 border border-neutral-700 fixed z-50 right-40 top-4 -translate-x-1/2">
        <span className="text-xs font-mono text-neutral-300">powered by</span>
        <a target="_blank" href="https://fal.ai">
          <Image src="/fal-ai.svg" alt="fal.ai" width={50} height={20} />
        </a>
      </div>
      <div
        id="canvas-wrapper"
        className="w-screen h-screen absolute top-0 left-0"
      >
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 5, 5]} />
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
              setModels={setModels}
            >
              {model.type === "glb" && model.url ? (
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
      <div className="toolbar p-1 space-y-2 flex flex-col items-center justify-center h-auto rounded-full bg-neutral-900 border border-neutral-700 fixed left-10 top-1/3 translate-y-1/2">
        <button
          className="flex items-center justify-center"
          onClick={handleRect}
        >
          <Icon icon="box" size={20} />
        </button>
        <button
          className="flex items-center justify-center"
          onClick={handleSphere}
        >
          <Icon icon="circle" size={16} />
        </button>
        <CreateObjectWithAiDialog onInsert={handleInsert}>
          <button className="flex items-center justify-center">
            <Icon icon="sparkle" size={16} className="text-lime-400" />
          </button>
        </CreateObjectWithAiDialog>
      </div>
    </main>
  );
}

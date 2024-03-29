import { TransformControls } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ModelData } from "./Model";

const TransformWrapper = ({
  setModels,
  children,
  model,
  mode,
  activeModelId,
  setActiveModelId,
}: {
  activeModelId: string | null;
  setActiveModelId: Dispatch<SetStateAction<string | null>>;
  model: ModelData;
  mode: "translate" | "rotate" | "scale";
  children: React.ReactNode;
  setModels: Dispatch<SetStateAction<ModelData[]>>;
}) => {
  const transformControlRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        setActiveModelId(null);
        setModels((models) =>
          models.filter((model) => model.id !== activeModelId)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveModelId, activeModelId]);

  useEffect(() => {
    if (transformControlRef.current) {
      transformControlRef.current.setMode(mode);
    }
  }, [mode]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setActiveModelId(model.id);
  };

  useEffect(() => {
    if (activeModelId === model.id && meshRef.current) {
      setModels((models) =>
        models.map((model) =>
          model.id === model.id
            ? {
                ...model,
                transform: {
                  position: meshRef.current.position.toArray(),
                  rotation: meshRef.current.rotation.toArray(),
                  scale: meshRef.current.scale.toArray(),
                },
              }
            : model
        )
      );
    }
  }, [activeModelId, meshRef.current]);

  const transformActive = activeModelId === model.id;

  return (
    <group {...model.transform}>
      <TransformControls
        key={model.id}
        enabled={transformActive}
        size={transformActive ? 0.5 : 0}
        ref={transformControlRef}
      >
        <mesh ref={meshRef} onClick={handleClick}>
          {children}
          <meshStandardMaterial attach="material" color="lightblue" />
        </mesh>
      </TransformControls>
    </group>
  );
};

export default TransformWrapper;

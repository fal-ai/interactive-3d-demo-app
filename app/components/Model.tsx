import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export interface ModelData {
  id: string;
  type: "glb" | "rect" | "circle";
  url?: string;
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };
}

const ModelGLB = ({ url }: { url: string }) => {
  const model = useGLTF(url);

  const meshRef = useRef<ThreeElements["primitive"]>();

  model.scene.traverse((node: any) => {
    if (node.isMesh) {
      node.material.color.set("white");
      node.material.needsUpdate = true;
    }
  });

  return (
    <>
      <primitive
        ref={meshRef}
        object={model.scene}
        rotation={[Math.PI / 2, -Math.PI, Math.PI / 2]}
      >
        <meshBasicMaterial attach="material" color={0xffffff} />
      </primitive>
    </>
  );
};

export default ModelGLB;

"use client";
import { useEffect, useState } from "react";
import { USDZExporter } from "three/addons/exporters/USDZExporter.js";
import "@google/model-viewer";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/Addons.js";

const ModelViewer = ({ modelURL }: { modelURL: string }) => {
  const [usdzURL, setUsdzURL] = useState<string | null>(null);
  const gltf = useGLTF(modelURL);

  const generateUSDZ = async (gltf: GLTF) => {
    const exporter = new USDZExporter();
    const arraybuffer = await exporter.parse(gltf.scene);
    const blob = new Blob([arraybuffer], {
      type: "application/octet-stream",
    });

    setUsdzURL(URL.createObjectURL(blob));
  };

  useEffect(() => {
    if (gltf) {
      gltf.scene.rotation.set(Math.PI / 2, -Math.PI, Math.PI / 2);
    }

    setTimeout(() => {
      if (modelURL && gltf) {
        // @ts-expect-error
        generateUSDZ(gltf as GLTF);
      }
    }, 0);
  }, [modelURL, gltf]);

  if (!modelURL || !usdzURL) return null;

  return (
    <model-viewer
      src={modelURL}
      ios-src={usdzURL}
      ar
      ar-modes="webxr scene-viewer quick-look"
      //   environment-image="path/to/your/environment.hdr"
      camera-orbit="0deg 75deg 3m"
      camera-controls
    >
      <button slot="ar-button">👋 Activate AR</button>
    </model-viewer>
  );
};

export default ModelViewer;

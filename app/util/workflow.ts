import * as fal from "@fal-ai/serverless-client";

fal.config({ proxyUrl: "/api/proxy" });

export const textToImage = async (prompt: string) => {
  const result = await fal.subscribe("fal-ai/fast-sdxl", {
    input: {
      prompt: `A 3d model of ${prompt}, volumetric, good lighting, professional photo shoot, studio`,
    },
    logs: true,
  });

  // @ts-expect-error
  return result?.images[0].url;
};

export const imageTo3D = async (image_url: string) => {
  const result = await fal.subscribe("fal-ai/triposr", {
    input: { image_url },
    logs: true,
  });

  // @ts-expect-error
  return result?.model_mesh?.url || null;
};

export const create3DAssets = async (
  prompt: string
): Promise<string | null> => {
  if (!prompt) return null;
  const imageURL = await textToImage(prompt);
  if (!imageURL) return null;
  const model = await imageTo3D(imageURL);
  if (!model) return null;
  return model;
};

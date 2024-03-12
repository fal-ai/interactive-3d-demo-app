export const putBackgroundToImage = async (
  imageUrl: string
): Promise<Blob | null> => {
  try {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.drawImage(image, 0, 0);
    context.fillStyle = "#7f7f7f";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    return await canvasToImage(canvas);
  } catch (error) {
    console.error("Error putting background to image:", error);
    return null;
  }
};

async function canvasToImage(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert canvas to blob"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.7
    );
  });
}

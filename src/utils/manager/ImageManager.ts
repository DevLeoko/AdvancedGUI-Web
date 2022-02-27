import { reactive } from "vue";
import { getBase64 } from "./FontManager";
import { RemoteImage } from "../components/RemoteImage";
import { requestRedraw } from "@/components/Canvas.vue";

export interface Image {
  name: string;
  data: HTMLImageElement;
  ratio: number;
  isGif: boolean;
}

export const DEFAULT_IMAGE_FILES = [
  "Down.png",
  "Down_H.png",
  "Down_C.png",
  "Up.png",
  "Up_H.png",
  "Up_C.png",
  "Left.png",
  "Left_H.png",
  "Left_C.png",
  "Right.png",
  "Right_H.png",
  "Right_C.png",
  "Play.png",
  "Play_H.png",
  "Play_C.png",
  "PlayRed.png",
  "PlayRed_H.png",
  "PlayRed_C.png",
  "List1.png",
  "List2.png",
  "List3.png"
];

export const DEFAULT_IMAGES = DEFAULT_IMAGE_FILES.map(name =>
  name.substr(0, name.length - 4)
);

export const regImages: string[] = reactive([]);
export const images: { [key: string]: Image } = {};
let imageContainer: HTMLElement;

export async function unregisterImage(imageName: string) {
  const elem = images[imageName].data;

  delete images[imageName];
  regImages.splice(regImages.indexOf(imageName), 1);
  elem.remove();
}

export async function registerImageBase64(
  dataUrl: string,
  imageName: string,
  isGif: boolean
) {
  if (regImages.indexOf(imageName) !== -1) unregisterImage(imageName);

  const imageElement = document.createElement("img") as HTMLImageElement;
  imageElement.crossOrigin = "anonymous";
  imageElement.onload = () => {
    const image: Image = {
      name: imageName,
      data: imageElement,
      ratio: imageElement.naturalWidth / imageElement.naturalHeight,
      isGif
    };

    images[imageName] = image; // TODO ref?
    regImages.push(imageName);
  };

  imageElement.src = dataUrl;
  imageContainer.appendChild(imageElement);
}

export function placeRemoteImage(
  imageUrl: string,
  id: string,
  comp: RemoteImage
) {
  imageUrl = imageUrl
    .replace(/%UUID_U%/g, "3feef46e6eac4dfd8da4493bd46c52ae")
    .replace(/%UUID%/g, "3feef46e-6eac-4dfd-8da4-493bd46c52ae")
    .replace(/%NAME%/g, "Leoko");

  let resImage = imageContainer.querySelector(
    `[id="${id}"]`
  ) as HTMLImageElement;

  if (!resImage) {
    resImage = document.createElement("img") as HTMLImageElement;
    resImage.crossOrigin = "anonymous";
    resImage.id = id;
    imageContainer.appendChild(resImage);
  }

  resImage.onload = () => {
    requestRedraw();
    comp.ratio = resImage.naturalWidth / resImage.naturalHeight;
  };

  resImage.onerror = () => {
    requestRedraw();
  };

  if (resImage.src != imageUrl)
    resImage.src = imageUrl;
}

export function getRemoteImage(id: string): HTMLImageElement | null {
  return imageContainer.querySelector(`[id="${id}"]`) as HTMLImageElement;
}

export async function registerImage(
  file: File | Blob,
  imageName: string,
  isGif: boolean
) {
  const url = await getBase64(file);
  await registerImageBase64(url, imageName, isGif);
}

export function setupImageManager(hiddenImageContainer: HTMLElement) {
  imageContainer = hiddenImageContainer;
  for (const name of DEFAULT_IMAGE_FILES) {
    fetch(`images/${name}`)
      .then(resp => resp.blob())
      .then(blob =>
        registerImage(blob, name.substr(0, name.length - 4), false)
      );
  }
}

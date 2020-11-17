import { reactive } from "vue";
import { getBase64 } from "./FontManager";
import { RemoteImage } from "../components/RemoteImage";

export interface Image {
  name: string;
  data: HTMLImageElement;
  ratio: number;
  isGif: boolean;
}

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

  let resImage = imageContainer.querySelector(`#${id}`) as HTMLImageElement;

  if (!resImage) {
    resImage = document.createElement("img") as HTMLImageElement;
    resImage.id = id;
    imageContainer.appendChild(resImage);
  }

  resImage.onload = () => {
    comp.ratio = resImage.naturalWidth / resImage.naturalHeight;
  };

  resImage.src = imageUrl;
}

export function getRemoteImage(id: string): HTMLImageElement | null {
  return imageContainer.querySelector(`#${id}`) as HTMLImageElement;
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
  for (const font of [
    "Down.png",
    "Down_H.png",
    "Up.png",
    "Up_H.png",
    "Left.png",
    "Left_H.png",
    "Right.png",
    "Right_H.png",
    "Play.png",
    "Play_H.png",
    "PlayRed.png",
    "PlayRed_H.png",
    "List1.png",
    "List2.png",
    "List3.png"
  ]) {
    fetch(`images/${font}`)
      .then(resp => resp.blob())
      .then(blob =>
        registerImage(blob, font.substr(0, font.length - 4), false)
      );
  }
}

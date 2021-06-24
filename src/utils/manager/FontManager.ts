import { reactive } from "vue";

export function getBase64(file: File | Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise(resolve => {
    reader.onload = function() {
      resolve(reader.result as string);
    };
  });
}

export interface Font {
  name: string;
  data: string;
}

export const DEFAULT_FONTS = [
  "Anton",
  "Bitter",
  "IndieFlower",
  "Oswald",
  "PermanentMarker",
  "PressStart2P",
  "Roboto",
  "VT323",
  "Yoster"
];

export const fonts: { [key: string]: Font } = {};
export const regFonts: string[] = reactive([]);

export async function unregisterFont(fontName: string) {
  delete fonts[fontName];
  regFonts.splice(regFonts.indexOf(fontName), 1);
}

export async function registerFontBase64(dataUrl: string, fontName: string) {
  if (regFonts.indexOf(fontName) !== -1) unregisterFont(fontName);

  const font = new FontFace(
    fontName,
    await (await fetch(dataUrl)).arrayBuffer()
  );
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);

  fonts[fontName] = {
    name: fontName,
    data: dataUrl
  };
  regFonts.push(fontName);
}

export async function registerFont(file: File | Blob, fontName: string) {
  const dataUrl = await getBase64(file);
  await registerFontBase64(dataUrl, fontName);
}

export function registerDefaultFonts() {
  for (const font of DEFAULT_FONTS) {
    fetch(`fonts/${font}.ttf`)
      .then(resp => resp.blob())
      .then(blob => registerFont(blob, font));
  }
}

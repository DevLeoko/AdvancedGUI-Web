export function hexToRgba(hex: string, alpha: number): string {
  hex = hex.toUpperCase();

  return (
    "rgba(" +
    parseInt(hex.slice(-6, -4), 16) +
    "," +
    parseInt(hex.slice(-4, -2), 16) +
    "," +
    parseInt(hex.slice(-2), 16) +
    "," +
    alpha +
    ")"
  );
}

export function rgbaToHex(rgba: string): { hex: string; alpha: number } {
  const rgb: string[] | null = rgba
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);

  if (!rgb)
    return {
      hex: "#FFFFFF",
      alpha: 1
    };

  return {
    hex:
      "#" +
      (Number.parseInt(rgb[1]) | (1 << 8)).toString(16).slice(1) +
      (Number.parseInt(rgb[2]) | (1 << 8)).toString(16).slice(1) +
      (Number.parseInt(rgb[3]) | (1 << 8)).toString(16).slice(1),
    alpha: Number.parseFloat(rgb[4])
  };
}

export function getRandomColorHex() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomColor() {
  return hexToRgba(getRandomColorHex(), 1);
}

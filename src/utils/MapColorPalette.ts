// map color palette LUT - from https://minecraft.wiki/w/Map_item_format
const BASE_COLORS: ReadonlyArray<readonly [number, number, number]> = [
  [0,   0,   0  ], // transparent
  [127, 178, 56 ],
  [247, 233, 163],
  [199, 199, 199],
  [255, 0,   0  ],
  [160, 160, 255],
  [167, 167, 167],
  [0,   124, 0  ],
  [255, 255, 255],
  [164, 168, 184],
  [151, 109, 77 ],
  [112, 112, 112],
  [64,  64,  255],
  [143, 119, 72 ],
  [255, 252, 245],
  [216, 127, 51 ],
  [178, 76,  216],
  [102, 153, 216],
  [229, 229, 51 ],
  [127, 204, 25 ],
  [242, 127, 165],
  [76,  76,  76 ],
  [153, 153, 153],
  [76,  127, 153],
  [127, 63,  178],
  [51,  76,  178],
  [102, 76,  51 ],
  [102, 127, 51 ],
  [153, 51,  51 ],
  [25,  25,  25 ],
  [250, 238, 77 ],
  [92,  219, 213],
  [74,  128, 255],
  [0,   217, 58 ],
  [129, 86,  49 ],
  [112, 2,   0  ],
  [209, 177, 161],
  [159, 82,  36 ],
  [149, 87,  108],
  [112, 108, 138],
  [186, 133, 36 ],
  [103, 117, 53 ],
  [160, 77,  78 ],
  [57,  41,  35 ],
  [135, 107, 98 ],
  [87,  92,  92 ],
  [122, 73,  88 ],
  [76,  62,  92 ],
  [76,  50,  35 ],
  [76,  82,  42 ],
  [142, 60,  46 ],
  [37,  22,  16 ],
  [189, 48,  49 ],
  [148, 63,  97 ],
  [92,  25,  29 ],
  [22,  126, 134],
  [58,  142, 140],
  [86,  44,  62 ],
  [20,  180, 133],
  [100, 100, 100],
  [216, 175, 147],
  [127, 167, 150]
];

const SHADE_MULTIPLIERS = [180, 220, 255, 135];
const PALETTE_SIZE = BASE_COLORS.length * SHADE_MULTIPLIERS.length;
const FIRST_VISIBLE = SHADE_MULTIPLIERS.length;

const PR = new Uint8Array(PALETTE_SIZE);
const PG = new Uint8Array(PALETTE_SIZE);
const PB = new Uint8Array(PALETTE_SIZE);

for (let i = 0; i < BASE_COLORS.length; i++) {

  for (let j = 0; j < SHADE_MULTIPLIERS.length; j++) {

    const mult = SHADE_MULTIPLIERS[j];
    const idx = i * SHADE_MULTIPLIERS.length + j;
    PR[idx] = Math.floor((BASE_COLORS[i][0] * mult) / 255);
    PG[idx] = Math.floor((BASE_COLORS[i][1] * mult) / 255);
    PB[idx] = Math.floor((BASE_COLORS[i][2] * mult) / 255);
  }
  
}

const snapCache = new Map<number, number>();

function snapRgb(r: number, g: number, b: number): number {
  const key = (r << 16) | (g << 8) | b;
  const cached = snapCache.get(key);

  if (cached !== undefined) return cached;

  let best = FIRST_VISIBLE;
  let bestDist = Number.MAX_VALUE;
  for (let i = FIRST_VISIBLE; i < PALETTE_SIZE; i++) {

    const dr = r - PR[i];
    const dg = g - PG[i];
    const db = b - PB[i];
    const rmean = (r + PR[i]) / 2;
    // MapPalette.matchColor
    const dist =
      (2 + rmean / 256) * dr * dr +
       4 * dg * dg +
      (2 + (255 - rmean) / 256) * db * db;
    
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }

  const packed = (PR[best] << 16) | (PG[best] << 8) | PB[best];

  if (snapCache.size >= 1 << 20) snapCache.clear();

  snapCache.set(key, packed);

  return packed;
}

export function snapImageDataToMapColors(data: Uint8ClampedArray): void {

  for (let i = 0; i < data.length; i += 4) {

    if (data[i + 3] < 122) {
      data[i + 3] = 0;
      continue;
    }

    const packed = snapRgb(data[i], data[i + 1], data[i + 2]);

    data[i    ] = (packed >> 16) & 0xff;
    data[i + 1] = (packed >> 8) & 0xff;
    data[i + 2] = packed & 0xff;
    data[i + 3] = 255;
  }
}

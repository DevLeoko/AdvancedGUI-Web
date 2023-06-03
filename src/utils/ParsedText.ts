interface TextFragment {
  text: string;
  color: string;
  width: number;
}

const COLOR_CHAR = "§";

export class ParsedText {
  private fragments: TextFragment[][] = [];
  public readonly width: number = 0;

  constructor(
    public readonly rawText: string,
    public readonly defaultColor: string,
    public readonly state: string,
    context: CanvasRenderingContext2D
  ) {
    const lines = rawText.split("\n");
    const fragmentsLines: TextFragment[][] = [];

    let lastColor = defaultColor;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      const fragments: TextFragment[] = [];

      let colorIndex = line.indexOf(COLOR_CHAR);
      while (colorIndex !== -1) {
        if (colorIndex === line.length - 1) break;

        const preColor = line.substring(0, colorIndex);
        fragments.push({
          text: preColor,
          color: lastColor,
          width: context.measureText(preColor).width
        });

        const colorString = line.substring(colorIndex + 1, colorIndex + 2);
        line = line.substring(colorIndex + 2);
        lastColor = this.getColor(colorString) || defaultColor;

        colorIndex = line.indexOf(COLOR_CHAR);
      }

      fragments.push({
        text: line,
        color: lastColor,
        width: context.measureText(line).width
      });

      fragmentsLines[i] = fragments;
    }

    this.fragments = fragmentsLines;
    this.width = Math.max(
      ...this.fragments.map(l => {
        return l.reduce((sum, f) => sum + f.width, 0);
      })
    );
  }

  public getLineCount(): number {
    return this.fragments.length;
  }

  public getLine(line: number): TextFragment[] {
    return this.fragments[line];
  }

  private getColor(colorString: string): string | null {
    switch (colorString.toLowerCase()) {
      case "a":
        return "rgb(85, 255, 85)";
      case "b":
        return "rgb(85, 255, 255)";
      case "c":
        return "rgb(255, 85, 85)";
      case "d":
        return "rgb(255, 85, 255)";
      case "e":
        return "rgb(255, 255, 85)";
      case "f":
        return "rgb(255, 255, 255)";
      case "0":
        return "rgb(0, 0, 0)";
      case "1":
        return "rgb(0, 0, 170)";
      case "2":
        return "rgb(0, 170, 0)";
      case "3":
        return "rgb(0, 170, 170)";
      case "4":
        return "rgb(170, 0, 0)";
      case "5":
        return "rgb(170, 0, 170)";
      case "6":
        return "rgb(255, 170, 0)";
      case "7":
        return "rgb(170, 170, 170)";
      case "8":
        return "rgb(85, 85, 85)";
      case "9":
        return "rgb(85, 85, 255)";
      default:
        return null;
    }
  }
}

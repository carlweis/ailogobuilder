import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";

interface ExportDimensions {
  width: number;
  height: number;
}

export interface ExportPngOptions extends ExportDimensions {
  scale?: number;
  backgroundColor?: string;
}

export interface ExportPdfOptions extends ExportDimensions {
  orientation?: "portrait" | "landscape";
  backgroundColor?: string;
}

const SVG_MIME = "image/svg+xml";

const renderSvgToCanvas = async (
  svg: string,
  { width, height, scale = 1, backgroundColor }: ExportPngOptions,
): Promise<HTMLCanvasElement> => {
  const blob = new Blob([svg], { type: SVG_MIME });
  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.src = url;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Unable to render SVG"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context is unavailable");
    }

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
};

export function exportAsSVG(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: SVG_MIME });
  saveAs(blob, filename.endsWith(".svg") ? filename : `${filename}.svg`);
}

export async function exportAsPNG(
  svg: string,
  options: ExportPngOptions,
  filename: string,
): Promise<void> {
  const canvas = await renderSvgToCanvas(svg, options);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) {
        reject(new Error("Unable to export PNG"));
        return;
      }
      resolve(value);
    });
  });

  saveAs(blob, filename.endsWith(".png") ? filename : `${filename}.png`);
}

export async function exportAsPDF(
  svg: string,
  options: ExportPdfOptions,
  filename: string,
): Promise<void> {
  const orientation = options.orientation ?? (options.width >= options.height ? "landscape" : "portrait");
  const scale = 1;
  const canvas = await renderSvgToCanvas(svg, { ...options, scale });
  const dataUrl = canvas.toDataURL("image/png");

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: [options.width, options.height],
  });

  doc.addImage(dataUrl, "PNG", 0, 0, options.width, options.height, undefined, "FAST");
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

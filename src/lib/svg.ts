import type { CanvasSettings, TextLayer } from "../store/useLogoStore";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const disallowedTags = ["script", "foreignObject", "iframe", "audio", "video"];
const disallowedAttrs = [/^on/i, /^xlink:/i, /^href$/i];

export function sanitizeSvg(svg: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const root = doc.documentElement;

  if (root.nodeName !== "svg") {
    throw new Error("Provided markup is not valid SVG");
  }

  root.setAttribute("viewBox", "0 0 1024 1024");
  root.removeAttribute("width");
  root.removeAttribute("height");

  const walker = (node: Element): void => {
    if (disallowedTags.includes(node.tagName)) {
      node.remove();
      return;
    }

    for (const attr of Array.from(node.attributes)) {
      if (disallowedAttrs.some((pattern) => pattern.test(attr.name))) {
        node.removeAttribute(attr.name);
      }
    }

    for (const child of Array.from(node.children)) {
      walker(child);
    }
  };

  walker(root);

  return new XMLSerializer().serializeToString(root);
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const caseTransform = (value: string, variant: TextLayer["case"]): string => {
  if (variant === "uppercase") return value.toUpperCase();
  if (variant === "lowercase") return value.toLowerCase();
  return value;
};

const createShadowFilter = (
  id: string,
  shadow: NonNullable<TextLayer["shadow"]>,
): string => {
  const { x, y, blur, color } = shadow;
  return `\n    <filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">\n      <feDropShadow dx="${x}" dy="${y}" stdDeviation="${blur}" flood-color="${color}"/>\n    </filter>`;
};

interface WrapResult {
  svg: string;
  width: number;
  height: number;
}

export function wrapWithCanvas(
  symbolSvg: string,
  logoText: TextLayer,
  sloganText: TextLayer,
  canvas: CanvasSettings,
): WrapResult {
  const sanitized = sanitizeSvg(symbolSvg);
  const innerSymbol = sanitized
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

  const width = 1024;
  const margin = 80;
  const symbolHeight = 1024;
  const hasLogo = logoText.text.trim().length > 0;
  const hasSlogan = sloganText.text.trim().length > 0;
  const logoHeight = hasLogo ? logoText.size * clamp(logoText.lineHeight, 0.8, 2) : 0;
  const sloganHeight = hasSlogan ? sloganText.size * clamp(sloganText.lineHeight, 0.8, 2) : 0;

  let currentY = symbolHeight + margin;
  const logoY = currentY;
  if (hasLogo) {
    currentY += logoHeight + margin / 2;
  }
  const sloganY = currentY;
  if (hasSlogan) {
    currentY += sloganHeight + margin / 2;
  }
  const height = currentY + margin;

  const defs: string[] = [];

  const buildText = (layer: TextLayer, y: number, key: string): string => {
    if (!layer.text.trim()) return "";

    const textValue = caseTransform(layer.text, layer.case);
    const anchor = layer.align === "center" ? "middle" : layer.align === "left" ? "start" : "end";
    const x = layer.align === "center" ? width / 2 : layer.align === "left" ? margin : width - margin;
    const letterSpacing = layer.letterSpacing.toFixed(2);
    const lineHeight = clamp(layer.lineHeight, 0.8, 2);
    const lines = textValue.split(/\n+/);
    const tspan = lines
      .map((line, index) => {
        const dy = index === 0 ? "0" : `${lineHeight * layer.size}px`;
        return `<tspan x="${x}" dy="${dy}">${line}</tspan>`;
      })
      .join("");

    let attrs = `font-family="${layer.font}" font-size="${layer.size}" font-weight="${layer.weight}" fill="${layer.color}" letter-spacing="${letterSpacing}px" text-anchor="${anchor}"`;

    if (layer.outline) {
      const widthPx = Math.max(layer.outline.width, 0.1);
      attrs += ` stroke="${layer.outline.color}" stroke-width="${widthPx}" paint-order="stroke fill"`;
    }

    if (layer.shadow) {
      const filterId = `${key}-shadow`;
      defs.push(createShadowFilter(filterId, layer.shadow));
      attrs += ` filter="url(#${filterId})"`;
    }

    return `<text ${attrs} y="${y}" xml:space="preserve">${tspan}</text>`;
  };

  const logoTextLayer = hasLogo ? buildText(logoText, logoY, "logo") : "";
  const sloganTextLayer = hasSlogan ? buildText(sloganText, sloganY, "slogan") : "";

  if (canvas.showGrid) {
    defs.push(
      `<pattern id="canvas-grid" width="40" height="40" patternUnits="userSpaceOnUse">\n        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(17, 24, 39, 0.08)" stroke-width="1"/>\n      </pattern>`,
    );
  }

  const defsMarkup = defs.length ? `<defs>${defs.join("\n")}</defs>` : "";
  const background = canvas.transparentBackground
    ? ""
    : `<rect width="100%" height="100%" fill="${canvas.backgroundColor}"/>`;

  const gridMarkup = canvas.showGrid
    ? `<rect width="100%" height="${symbolHeight}" fill="url(#canvas-grid)" opacity="0.7"/>`
    : "";

  const svg = `<svg xmlns="${SVG_NAMESPACE}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n    ${defsMarkup}\n    ${background}\n    <g transform="translate(0, ${margin})">\n      ${gridMarkup}\n      <g transform="translate(0, ${-margin})">${innerSymbol}</g>\n    </g>\n    ${logoTextLayer}\n    ${sloganTextLayer}\n  </svg>`;

  return { svg, width, height };
}

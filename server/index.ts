import express from "express";
import cors from "cors";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { z } from "zod";
import type {
  GenerateSymbolRequest,
  IterateSymbolRequest,
  SymbolResponse,
} from "./types";

const app = express();
const port = process.env.PORT ?? 3001;
const openAiApiKey = process.env.OPENAI_API_KEY;

if (!openAiApiKey) {
  console.warn(
    "[server] Missing OPENAI_API_KEY. Requests to the OpenAI API will fail.",
  );
}

app.use(cors({
  origin: ["http://localhost:5173", "https://localhost:5173"],
  credentials: false,
}));
app.use(express.json({ limit: "1mb" }));

const generateSchema = z.object({
  prompt: z
    .string()
    .min(4, "Prompt must include at least four characters.")
    .max(1000, "Prompt is too long."),
});

const iterateSchema = z.object({
  prompt: z
    .string()
    .min(4, "Prompt must include at least four characters.")
    .max(1000, "Prompt is too long."),
  baseSvg: z
    .string()
    .optional()
    .refine((value) => !value || value.length < 500_000, "SVG is too large."),
});

const systemPrompt = `You generate a single, clean SVG symbol suitable for a logo. Output only the <svg ...>...</svg> markup. Use viewBox="0 0 1024 1024". Avoid text; create paths/shapes only. No scripts, no external references, no raster images. Use fill="currentColor" where possible so the client can recolor. Keep geometry balanced, centered, and with proper margins.`;

const disallowedTags = new Set([
  "script",
  "foreignObject",
  "iframe",
  "image",
  "audio",
  "video",
]);

const disallowedAttrs = [/^on/i, /^xlink:/i, /^href$/i];

function sanitizeSvg(svg: string): string {
  const parser = new DOMParser({ errorHandler: () => undefined });
  const serializer = new XMLSerializer();
  try {
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgEl = doc.getElementsByTagName("svg")[0];
    if (!svgEl) {
      throw new Error("SVG root not found");
    }
    svgEl.setAttribute("viewBox", "0 0 1024 1024");
    svgEl.setAttribute("width", "1024");
    svgEl.setAttribute("height", "1024");

    const traverse = (element: Element): void => {
      if (disallowedTags.has(element.tagName)) {
        element.parentNode?.removeChild(element);
        return;
      }
      for (const attr of Array.from(element.attributes)) {
        if (disallowedAttrs.some((pattern) => pattern.test(attr.name))) {
          element.removeAttribute(attr.name);
        }
      }
      Array.from(element.children).forEach((child) => traverse(child));
    };
    traverse(svgEl);
    const output = serializer.serializeToString(svgEl);
    if (output.length > 500_000) {
      throw new Error("SVG exceeds maximum size");
    }
    return output;
  } catch (error) {
    console.error("Failed to sanitize SVG", error);
    throw new Error("Invalid SVG returned by the model");
  }
}

async function callOpenAi(prompt: string, baseSvg?: string): Promise<string> {
  if (!openAiApiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const messages: Array<{ role: "system" | "user"; content: string }> = [
    { role: "system", content: systemPrompt },
  ];

  if (baseSvg) {
    messages.push({
      role: "user",
      content: `Here is the previous SVG to iterate from:\n\n${baseSvg}`,
    });
  }

  messages.push({ role: "user", content: prompt });

  const body = {
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.6,
    max_output_tokens: 1024,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    output: Array<{ content: Array<{ type: string; text?: string }> }>;
  };

  const text = data.output
    ?.flatMap((chunk) => chunk.content)
    ?.find((item) => item.type === "output_text" || item.type === "text")?.text;

  if (!text) {
    throw new Error("OpenAI did not return SVG text");
  }

  return sanitizeSvg(text.trim());
}

app.post<never, SymbolResponse, GenerateSymbolRequest>(
  "/api/generate-symbol",
  async (req, res) => {
    const parseResult = generateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const message = parseResult.error.errors.map((error) => error.message).join(" ");
      res.status(400).json({ svg: "", error: message });
      return;
    }
    try {
      const svg = await callOpenAi(parseResult.data.prompt);
      res.json({ svg });
    } catch (error) {
      console.error("/api/generate-symbol error", error);
      res.status(500).json({ svg: "", error: "Symbol generation failed" });
    }
  },
);

app.post<never, SymbolResponse, IterateSymbolRequest>(
  "/api/iterate",
  async (req, res) => {
    const parseResult = iterateSchema.safeParse(req.body);
    if (!parseResult.success) {
      const message = parseResult.error.errors.map((error) => error.message).join(" ");
      res.status(400).json({ svg: "", error: message });
      return;
    }
    try {
      const svg = await callOpenAi(parseResult.data.prompt, parseResult.data.baseSvg);
      res.json({ svg });
    } catch (error) {
      console.error("/api/iterate error", error);
      res.status(500).json({ svg: "", error: "Iteration failed" });
    }
  },
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`AI Logo Builder server listening on http://localhost:${port}`);
});

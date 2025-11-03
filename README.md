# AI Logo Builder

AI Logo Builder is a Vite + React + TypeScript application that helps product teams craft logo concepts with the help of OpenAI. Generate SVG symbols from prompts, iterate quickly, refine typography, preview mockups, and export production-ready assets.

## Features

- 🔮 **AI Symbol Generation** – Describe a concept and receive sanitized SVG symbols via the OpenAI Responses API.
- ♻️ **Iteration History** – Keep a timeline of every prompt and switch versions instantly.
- ✍️ **Typography Controls** – Fine‑tune logo and slogan text with fonts, spacing, outlines, and shadows.
- 🎛️ **Canvas Tools** – Toggle grid/transparent backgrounds, control zoom, and reset with a single click.
- 📱 **Mockups & Printing** – Preview app icons and app bar mockups and print a clean canvas layout.
- 📤 **Flexible Export** – Download SVG, PNG (with scaling), and PDF assets without leaving the browser.
- 🌙 **Theme Ready** – Light/dark mode with persistent preference and accessible shadcn/ui components.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- An OpenAI API key with access to the Responses API.

### Installation

```bash
npm install
```

> **Note:** If the npm registry blocks scoped Radix packages you may need to authenticate or use an alternative registry mirror.

Create a `.env` file based on `.env.example`:

```
OPENAI_API_KEY=sk-...
```

### Available Scripts

- `npm run dev` – Start the Vite client.
- `npm run server:dev` – Start the Express API (requires `OPENAI_API_KEY`).
- `npm run dev:both` – Run client and server together for local development.
- `npm run build` – Type-check and build the client bundle.
- `npm run preview` – Preview the production build locally.

## Project Structure

```
.
├── server/               # Express server that proxies OpenAI requests
├── src/
│   ├── components/       # UI primitives and feature components
│   ├── lib/              # Client helpers (OpenAI, export, SVG utilities)
│   ├── pages/            # Route-level components
│   ├── store/            # Zustand state management
│   └── theme/            # Theme provider
├── public/
├── .env.example
└── README.md
```

## Server Endpoints

- `POST /api/generate-symbol` – Body `{ prompt: string }` ➜ `{ svg: string }`
- `POST /api/iterate` – Body `{ prompt: string, baseSvg?: string }` ➜ `{ svg: string }`

Both endpoints sanitize model output to remove scripts, event handlers, and enforce a `viewBox="0 0 1024 1024"`.

## Exporting Assets

The export dialog supports three formats:

- **SVG** – Raw vector markup composed with text layers and canvas options.
- **PNG** – Raster export with configurable scale factor and background color.
- **PDF** – Vector-friendly PDF generated via jsPDF using the rasterized PNG.

## Tailwind & UI

Tailwind CSS v4 powers styling. shadcn/ui components are colocated under `src/components/ui`. The global theme variables live in `src/app.css` and respect the `dark` class on `<html>`.

## Security & Environment

- Never expose the OpenAI API key to the browser. The Express server reads `process.env.OPENAI_API_KEY`.
- SVG responses are sanitized on the server before being saved in the client state.

## License

This project is provided for educational purposes. Adapt it for your organization as needed.

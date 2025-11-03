export interface GenerateRequestBody {
  prompt: string;
}

export interface IterateRequestBody extends GenerateRequestBody {
  baseSvg?: string;
}

export interface SymbolResponse {
  svg: string;
  error?: string;
}

async function request<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    try {
      const json = JSON.parse(text) as { error?: string };
      if (json.error) {
        message = json.error;
      }
    } catch {
      // ignore JSON parse errors and fall back to raw text
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function generateSymbol(prompt: string): Promise<SymbolResponse> {
  return request<SymbolResponse>("/api/generate-symbol", { prompt });
}

export async function iterateSymbol(
  prompt: string,
  baseSvg?: string,
): Promise<SymbolResponse> {
  return request<SymbolResponse>("/api/iterate", { prompt, baseSvg });
}

export interface SymbolResponse {
  svg: string;
  error?: string;
}

export interface GenerateSymbolRequest {
  prompt: string;
}

export interface IterateSymbolRequest {
  baseSvg?: string;
  prompt: string;
}

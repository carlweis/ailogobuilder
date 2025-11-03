export interface MockupSize {
  id: string;
  label: string;
  size: number;
  radius?: number;
}

export const ICON_SIZES: MockupSize[] = [
  { id: "icon-1024", label: "App Icon 1024px", size: 1024, radius: 220 },
  { id: "icon-512", label: "App Icon 512px", size: 512, radius: 128 },
  { id: "icon-256", label: "App Icon 256px", size: 256, radius: 64 },
  { id: "icon-128", label: "App Icon 128px", size: 128, radius: 32 },
  { id: "favicon", label: "Favicon 32px", size: 32, radius: 8 },
];

export interface MockupAppBar {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const APP_BAR: MockupAppBar = {
  id: "app-bar",
  label: "Application Bar",
  width: 1024,
  height: 80,
};

export interface MockupPreviewConfig {
  iconSizes: MockupSize[];
  appBar: MockupAppBar;
}

export const MOCKUP_CONFIG: MockupPreviewConfig = {
  iconSizes: ICON_SIZES,
  appBar: APP_BAR,
};

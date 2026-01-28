export type ThemePreset = 'sky' | 'royal' | 'teal' | 'emerald' | 'violet';
export type ColorMode = 'system' | 'light' | 'dark';

export interface ThemeConfig {
  preset: ThemePreset;
  colorMode: ColorMode;
}

export const THEME_PRESETS: Record<ThemePreset, { name: string; primary: string }> = {
  sky: { name: 'Sky', primary: '#0EA5E9' },
  royal: { name: 'Royal', primary: '#2563EB' },
  teal: { name: 'Teal', primary: '#0891B2' },
  emerald: { name: 'Emerald', primary: '#10B981' },
  violet: { name: 'Violet', primary: '#8B5CF6' },
};

export const DEFAULT_THEME: ThemeConfig = {
  preset: 'sky',
  colorMode: 'system',
};

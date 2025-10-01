
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @file Centralized state management using Zustand for the folder icon generator app.
 * @module state
 */

export interface FolderIconSettings {
  borderWidth: number;
  cornerRadius: number;
  taperAmount: number;
  frontPartOffsetY: number;
  dynamicTabWidth: number;
  dynamicTabOffset: number;
  frontGradientStops: string[];
  frontGradientAngle: number;
  frontGradientSpread: number;
  frontGradientOffsetY: number;
  backGradientStops: string[];
  backGradientAngle: number;
  backGradientSpread: number;
  backGradientOffsetY: number;
  borderGradientStops: string[];
  borderGradientAngle: number;
  borderGradientSpread: number;
  borderGradientOffsetY: number;
  highlightStrength: number;
  currentImageOpacity: number;
  imageFit: string;
  currentBlendMode: string;
  imageBlur: number;
  imageBrightness: number;
  imageContrast: number;
  imageSaturation: number;
  imageScaleX: number;
  imageScaleY: number;
  imageOffsetX: number;
  imageOffsetY: number;
  imageSkewX: number;
  imageSkewY: number;
  imageSkewZ: number;
  imageRotation: number;
  dropShadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
  shadowSpread: number;
  [key: string]: any; // For dynamic access
}

/**
 * LocalStorage key for app settings.
 * @type {string}
 */
export const SETTINGS_KEY = 'folderIconGeneratorSettings_v11';
/**
 * LocalStorage key for custom presets.
 * @type {string}
 */
export const CUSTOM_PRESETS_KEY = 'folderIconGeneratorCustomPresets_v1';
/**
 * Tab height in px.
 * @type {number}
 */
export const TAB_HEIGHT = 45;
/**
 * Back panel inset in px.
 * @type {number}
 */
export const BACK_PANEL_INSET = 5;

/**
 * Default settings for folder icon generation.
 * @type {FolderIconSettings}
 */
export const defaultSettings: FolderIconSettings = {
  borderWidth: 6,
  cornerRadius: 15,
  taperAmount: 20,
  frontPartOffsetY: 10,
  dynamicTabWidth: 160,
  dynamicTabOffset: 30,
  frontGradientStops: ['#45475a', '#585b70'],
  frontGradientAngle: 90,
  frontGradientSpread: 100,
  frontGradientOffsetY: 0,
  backGradientStops: ['#313244', '#1e1e2e'],
  backGradientAngle: 90,
  backGradientSpread: 100,
  backGradientOffsetY: 0,
  borderGradientStops: ['#cba6f7', '#89b4fa'],
  borderGradientAngle: 45,
  borderGradientSpread: 100,
  borderGradientOffsetY: 0,
  highlightStrength: 0.5,
  currentImageOpacity: 1.0,
  imageFit: 'cover',
  currentBlendMode: 'source-over',
  imageBlur: 0,
  imageBrightness: 100,
  imageContrast: 100,
  imageSaturation: 100,
  imageScaleX: 100,
  imageScaleY: 100,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageSkewX: 0,
  imageSkewY: 0,
  imageSkewZ: 0,
  imageRotation: 0,
  dropShadowEnabled: false,
  shadowColor: '#000000',
  shadowBlur: 8,
  shadowOffsetX: 3,
  shadowOffsetY: 4,
  shadowOpacity: 0.4,
  shadowSpread: 0
};

interface AppState {
  settings: FolderIconSettings;
  loadedImage: HTMLImageElement | null;
  loadedImageBase64: string | null;
  updateSettings: (newSettings: Partial<FolderIconSettings>) => void;
  resetSettingsToDefaults: () => void;
  setLoadedImage: (image: HTMLImageElement, base64Data: string) => void;
  resetLoadedImage: () => void;
  getSettings: () => FolderIconSettings;
}

/**
 * Zustand store for app state management
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: { ...defaultSettings },
      loadedImage: null,
      loadedImageBase64: null,

      updateSettings: (newSettings: Partial<FolderIconSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      resetSettingsToDefaults: () =>
        set(() => ({
          settings: { ...defaultSettings }
        })),

      setLoadedImage: (image: HTMLImageElement, base64Data: string) =>
        set(() => ({
          loadedImage: image,
          loadedImageBase64: base64Data
        })),

      resetLoadedImage: () =>
        set(() => ({
          loadedImage: null,
          loadedImageBase64: null
        })),

      getSettings: () => get().settings
    }),
    {
      name: SETTINGS_KEY,
      partialize: (state) => ({ settings: state.settings })
    }
  )
);

/**
 * API Key for Gemini features (configure as needed).
 * @type {string}
 */
export const API_KEY = ""; // IMPORTANT: Add your Gemini API Key here if you want to use the AI features.

/**
 * Legacy exports for backward compatibility
 * TODO: Remove these once all files are updated to use the store
 */
export const settings = useAppStore.getState().settings;
export const loadedImage = useAppStore.getState().loadedImage;
export const loadedImageBase64 = useAppStore.getState().loadedImageBase64;

/**
 * Legacy functions for backward compatibility
 * TODO: Remove these once all files are updated to use the store
 */
export function getSettings(): FolderIconSettings {
  return useAppStore.getState().getSettings();
}

export function updateSettings(newSettings: Partial<FolderIconSettings>): void {
  useAppStore.getState().updateSettings(newSettings);
}

export function resetSettingsToDefaults(): void {
  useAppStore.getState().resetSettingsToDefaults();
}

export function setLoadedImage(image: HTMLImageElement, base64Data: string): void {
  useAppStore.getState().setLoadedImage(image, base64Data);
}

export function resetLoadedImage(): void {
  useAppStore.getState().resetLoadedImage();
}

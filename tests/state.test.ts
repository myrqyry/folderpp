import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore, defaultSettings } from '../src/lib/state';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    useAppStore.getState().resetSettingsToDefaults();
    useAppStore.getState().resetLoadedImage();
  });

  it('should have the default settings initiall', () => {
    const { settings } = useAppStore.getState();
    expect(settings).toEqual(defaultSettings);
  });

  it('should update settings when updateSettings is called', () => {
    const { updateSettings } = useAppStore.getState();
    const newSettings = { borderWidth: 10, cornerRadius: 20 };
    updateSettings(newSettings);
    const { settings } = useAppStore.getState();
    expect(settings.borderWidth).toBe(10);
    expect(settings.cornerRadius).toBe(20);
  });

  it('should reset settings to defaults when resetSettingsToDefaults is called', () => {
    const { updateSettings, resetSettingsToDefaults } = useAppStore.getState();
    const newSettings = { borderWidth: 10, cornerRadius: 20 };
    updateSettings(newSettings);
    resetSettingsToDefaults();
    const { settings } = useAppStore.getState();
    expect(settings).toEqual(defaultSettings);
  });

  it('should set the loaded image', () => {
    const { setLoadedImage } = useAppStore.getState();
    const image = new Image();
    const base64Data = 'test-base64-data';
    setLoadedImage(image, base64Data);
    const { loadedImage, loadedImageBase64 } = useAppStore.getState();
    expect(loadedImage).toBe(image);
    expect(loadedImageBase64).toBe(base64Data);
  });

  it('should reset the loaded image', () => {
    const { setLoadedImage, resetLoadedImage } = useAppStore.getState();
    const image = new Image();
    const base64Data = 'test-base64-data';
    setLoadedImage(image, base64Data);
    resetLoadedImage();
    const { loadedImage, loadedImageBase64 } = useAppStore.getState();
    expect(loadedImage).toBeNull();
    expect(loadedImageBase64).toBeNull();
  });
});
// --- Utility functions ---
import { messageArea } from './dom-elements.ts';
import { SETTINGS_KEY, settings } from './state.ts';

export type MessageType = 'default' | 'success' | 'error' | 'warning' | 'info';

export function setMessage(msg: string, type: MessageType = 'default'): void {
    if (!messageArea) return; // messageArea is in dom.js
    messageArea.textContent = msg;
    messageArea.className = `text-sm h-4 mt-3 message-${type}`;
    // Clear message after a few seconds
    setTimeout(() => {
        if (messageArea.textContent === msg) {
            messageArea.textContent = '';
            messageArea.className = 'text-sm h-4 mt-3 message-default';
        }
    }, 5000);
}

export function saveSettings(): void {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); // SETTINGS_KEY and settings are in dom.js
    } catch (e) {
        console.error('Error saving settings:', e);
        setMessage('⚠️ Error saving settings. Check console.', 'error');
    }
}

export function loadSettings(): void {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY); // SETTINGS_KEY is in dom.js
        if (saved) {
            const loadedSettings = JSON.parse(saved);
            // Deep merge to handle new settings added in updates
            Object.keys(loadedSettings).forEach(key => {
                if (settings.hasOwnProperty(key) && typeof settings[key] === 'object' && settings[key] !== null && !Array.isArray(settings[key])) {
                    Object.assign(settings[key], loadedSettings[key]);
                } else {
                    (settings as any)[key] = loadedSettings[key];
                }
            });
        } else {
            // If no saved settings, ensure defaults are applied (they are already in `settings` in dom.js)
        }
    } catch (e) {
        console.error('Error loading settings:', e);
        setMessage('⚠️ Error loading settings. Check console.', 'error');
        // Fallback to default settings if loading fails
    }
}

// Helper to convert hex to RGBA for color manipulation
export function hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper to generate a random hex color
export function getRandomHexColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function(...args: Parameters<T>) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Function to copy text to clipboard
export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        setMessage('📋 Settings copied to clipboard!', 'success');
    } catch (err) {
        setMessage('❌ Failed to copy settings.', 'error');
        console.error('Failed to copy: ', err);
    }
}

// Function to show loading state on a button
export function showButtonLoading(
    button: HTMLElement | null,
    buttonTextElement: HTMLElement | null,
    spinnerElement: HTMLElement | null,
    isLoading: boolean,
    originalText: string = ""
): void {
    if (!button || !buttonTextElement || !spinnerElement) return;
    if (isLoading) {
        buttonTextElement.classList.add('opacity-0');
        spinnerElement.classList.remove('hidden');
        (button as HTMLButtonElement).disabled = true;
    } else {
        buttonTextElement.classList.remove('opacity-0');
        spinnerElement.classList.add('hidden');
        (button as HTMLButtonElement).disabled = false;
        if (originalText) buttonTextElement.textContent = originalText; // Restore original text if provided
    }
}

// Function to update slider value display
export function updateSliderValue(
    sliderElement: HTMLInputElement | null,
    valueElement: HTMLElement | null,
    unit: string = ''
): void {
    if (sliderElement && valueElement) {
        valueElement.textContent = sliderElement.value + unit;
    }
}

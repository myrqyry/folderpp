// --- Utility functions ---
import { messageArea } from './dom-elements';
import { useAppStore, SETTINGS_KEY } from './state';

export type MessageType = 'default' | 'success' | 'error' | 'warning' | 'info';

export function setMessage(msg: string, type: MessageType = 'default'): void {
    if (!messageArea) return;
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

export function loadSettings(): void {
    try {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            const loadedSettings = JSON.parse(saved);
            // The middleware handles rehydration, but we can manually update if needed.
            // For now, we trust the middleware. If specific merge logic is needed, it would go here.
            useAppStore.getState().updateSettings(loadedSettings.settings);
        }
    } catch (e) {
        console.error('Error loading settings:', e);
        setMessage('⚠️ Error loading settings. Check console.', 'error');
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
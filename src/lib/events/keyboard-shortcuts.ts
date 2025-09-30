import { useAppStore } from '../state';
import { saveCurrentAsPreset, loadPreset } from '../presets';
import { downloadButton } from '../dom';

export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

        const { redo, undo } = useAppStore.getState();

        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveCurrentAsPreset();
                    break;
                case 'd':
                    e.preventDefault();
                    if (downloadButton && !downloadButton.disabled) {
                        downloadButton.click();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    const randomizeBtn = document.getElementById('randomizeColorsBtn');
                    if (randomizeBtn) randomizeBtn.click();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        // redo(); // Redo is not a standard part of the store, you might need to implement it
                    } else {
                        // undo(); // Undo is not a standard part of the store, you might need to implement it
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    // redo();
                    break;
                case 'c':
                    e.preventDefault();
                    const copyBtn = document.getElementById('copySettingsBtn');
                    if (copyBtn) copyBtn.click();
                    break;
                case 'v':
                    e.preventDefault();
                    const pasteBtn = document.getElementById('pasteSettingsBtn');
                    if (pasteBtn) pasteBtn.click();
                    break;
            }
        }

        if (e.key >= '1' && e.key <= '9') {
            const presetIndex = parseInt(e.key) - 1;
            const presetSelect = document.getElementById('presetSelect') as HTMLSelectElement;
            if (presetSelect && presetSelect.options[presetIndex + 1]) {
                presetSelect.selectedIndex = presetIndex + 1;
                loadPreset(presetSelect.value);
            }
        }
    });
}
// --- Preset System ---
import { useAppStore, CUSTOM_PRESETS_KEY } from './state';
import { customPresetsContainer, customPresetsList, updateControlsFromState, drawFolderIcon } from './dom';
import { setMessage } from './utils';
import { renderGradientStopsUI } from './gradients';
import { renderShadowControls } from './shadow';
import { AppError, errorHandler } from './error';

const presets = {
    'pastel-dream': {
        name: '🌸 Pastel Dream',
        settings: {
            borderWidth: 4, cornerRadius: 20, taperAmount: 15, frontPartOffsetY: 8, dynamicTabWidth: 180, dynamicTabOffset: 25,
            frontGradientStops: ['#f5c2e7', '#cba6f7'], frontGradientAngle: 135, frontGradientSpread: 90, frontGradientOffsetY: 5,
            backGradientStops: ['#f2cdcd', '#f5e0dc'], backGradientAngle: 45, backGradientSpread: 85, backGradientOffsetY: 3,
            borderGradientStops: ['#b4befe', '#f5c2e7'], borderGradientAngle: 90, borderGradientSpread: 95, borderGradientOffsetY: 0,
            highlightStrength: 0.3, currentImageOpacity: 0.8, imageFit: 'cover', currentBlendMode: 'soft-light',
            dropShadowEnabled: true, shadowColor: '#f5c2e7', shadowBlur: 12, shadowOffsetX: 2, shadowOffsetY: 6, shadowOpacity: 0.3, shadowSpread: 0
        }
    },
    // ... other presets
};

function loadCustomPresets() {
    try {
        const saved = localStorage.getItem(CUSTOM_PRESETS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        errorHandler(new AppError('Failed to load custom presets from localStorage.', 'PRESET-LOAD-FAILURE', 'Could not load your custom presets.'));
        return {};
    }
}

function saveCustomPresets(customPresets: any) {
    try {
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
    } catch (error) {
        errorHandler(new AppError('Failed to save custom presets to localStorage.', 'PRESET-SAVE-FAILURE', 'Could not save your custom presets.'));
    }
}

export function updateCustomPresetsUI() {
    try {
        const customPresets = loadCustomPresets();
        const hasCustomPresets = Object.keys(customPresets).length > 0;

        if (!customPresetsContainer || !customPresetsList) return;

        customPresetsContainer.classList.toggle('hidden', !hasCustomPresets);
        customPresetsList.innerHTML = '';

        Object.entries(customPresets).forEach(([key, preset]: [string, any]) => {
            const presetItem = document.createElement('div');
            presetItem.className = 'flex items-center gap-2 text-xs';
            presetItem.innerHTML = `
                <button class="flex-1 text-left py-1 px-2 bg-[var(--surface1)] hover:bg-[var(--surface2)] rounded transition duration-200 text-[var(--text)]" onclick="loadCustomPreset('${key}')">
                    ${preset.name}
                </button>
                <button class="text-[var(--red)] hover:text-[var(--maroon)] transition duration-200" onclick="deleteCustomPreset('${key}')" title="Delete preset">
                    🗑️
                </button>
            `;
            customPresetsList.appendChild(presetItem);
        });
    } catch(error) {
        errorHandler(error);
    }
}

function loadCustomPreset(key: string) {
    try {
        const { updateSettings } = useAppStore.getState();
        const customPresets = loadCustomPresets();
        if (customPresets[key]) {
            updateSettings(customPresets[key].settings);
            updateControlsFromState();
            drawFolderIcon();
            setMessage(`✨ Loaded preset: ${customPresets[key].name}`, 'success');
            ['front', 'back', 'border'].forEach(renderGradientStopsUI);
            renderShadowControls();
        }
    } catch(error) {
        errorHandler(error);
    }
}

function deleteCustomPreset(key: string) {
    try {
        if (confirm('Are you sure you want to delete this preset?')) {
            const customPresets = loadCustomPresets();
            delete customPresets[key];
            saveCustomPresets(customPresets);
            updateCustomPresetsUI();
            setMessage('🗑️ Preset deleted', 'default');
        }
    } catch(error) {
        errorHandler(error);
    }
}

export function loadPreset(presetKey: string) {
    try {
        const { updateSettings } = useAppStore.getState();
        if (presets[presetKey]) {
            updateSettings(presets[presetKey].settings);
            updateControlsFromState();
            drawFolderIcon();
            setMessage(`✨ Loaded preset: ${presets[presetKey].name}`, 'success');
            ['front', 'back', 'border'].forEach(renderGradientStopsUI);
            renderShadowControls();
        }
    } catch(error) {
        errorHandler(error);
    }
}

export function saveCurrentAsPreset() {
    try {
        const { settings } = useAppStore.getState();
        const name = prompt('Enter a name for this preset:');
        if (name && name.trim()) {
            const customPresets = loadCustomPresets();
            const key = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            if (customPresets[key] && !confirm('A preset with this name already exists. Overwrite?')) {
                return;
            }
            customPresets[key] = {
                name: name.trim(),
                settings: JSON.parse(JSON.stringify(settings))
            };
            saveCustomPresets(customPresets);
            updateCustomPresetsUI();
            setMessage(`💾 Saved preset: ${name}`, 'success');
        }
    } catch(error) {
        errorHandler(error);
    }
}

// Attach custom preset functions to window for inline onclick handlers
(window as any).loadCustomPreset = loadCustomPreset;
(window as any).deleteCustomPreset = deleteCustomPreset;
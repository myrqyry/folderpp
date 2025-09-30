// --- Preset System ---
import { useAppStore, CUSTOM_PRESETS_KEY } from './state';
import { customPresetsContainer, customPresetsList, updateControlsFromState, drawFolderIcon } from './dom';
import { setMessage } from './utils';
import { renderGradientStopsUI } from './gradients';
import { renderShadowControls } from './shadow';

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
    'lavender-sky': {
        name: '💜 Lavender Sky',
        settings: {
            borderWidth: 5, cornerRadius: 18, taperAmount: 18, frontPartOffsetY: 12, dynamicTabWidth: 170, dynamicTabOffset: 35,
            frontGradientStops: ['#cba6f7', '#b4befe'], frontGradientAngle: 180, frontGradientSpread: 100, frontGradientOffsetY: 8,
            backGradientStops: ['#585b70', '#45475a'], backGradientAngle: 270, backGradientSpread: 80, backGradientOffsetY: -5,
            borderGradientStops: ['#89dceb', '#cba6f7'], borderGradientAngle: 225, borderGradientSpread: 110, borderGradientOffsetY: 2,
            highlightStrength: 0.6, currentImageOpacity: 0.9, imageFit: 'cover', currentBlendMode: 'overlay',
            dropShadowEnabled: true, shadowColor: '#b4befe', shadowBlur: 15, shadowOffsetX: 4, shadowOffsetY: 8, shadowOpacity: 0.4, shadowSpread: 0
        }
    },
    'mint-breeze': {
        name: '🌿 Mint Breeze',
        settings: {
            borderWidth: 3, cornerRadius: 25, taperAmount: 12, frontPartOffsetY: 6, dynamicTabWidth: 190, dynamicTabOffset: 20,
            frontGradientStops: ['#94e2d5', '#a6e3a1'], frontGradientAngle: 45, frontGradientSpread: 85, frontGradientOffsetY: 4,
            backGradientStops: ['#74c7ec', '#89dceb'], backGradientAngle: 135, backGradientSpread: 90, backGradientOffsetY: 2,
            borderGradientStops: ['#a6e3a1', '#94e2d5'], borderGradientAngle: 180, borderGradientSpread: 100, borderGradientOffsetY: 0,
            highlightStrength: 0.4, currentImageOpacity: 0.75, imageFit: 'contain', currentBlendMode: 'multiply',
            dropShadowEnabled: true, shadowColor: '#94e2d5', shadowBlur: 10, shadowOffsetX: 3, shadowOffsetY: 5, shadowOpacity: 0.25, shadowSpread: 0
        }
    },
    'sunset-glow': {
        name: '🌅 Sunset Glow',
        settings: {
            borderWidth: 6, cornerRadius: 16, taperAmount: 22, frontPartOffsetY: 14, dynamicTabWidth: 160, dynamicTabOffset: 40,
            frontGradientStops: ['#fab387', '#f9e2af'], frontGradientAngle: 315, frontGradientSpread: 95, frontGradientOffsetY: 6,
            backGradientStops: ['#eba0ac', '#f38ba8'], backGradientAngle: 45, backGradientSpread: 88, backGradientOffsetY: -3,
            borderGradientStops: ['#f9e2af', '#fab387'], borderGradientAngle: 270, borderGradientSpread: 105, borderGradientOffsetY: 1,
            highlightStrength: 0.7, currentImageOpacity: 0.85, imageFit: 'cover', currentBlendMode: 'screen',
            dropShadowEnabled: true, shadowColor: '#fab387', shadowBlur: 18, shadowOffsetX: 5, shadowOffsetY: 10, shadowOpacity: 0.35, shadowSpread: 0
        }
    },
    'ocean-mist': {
        name: '🌊 Ocean Mist',
        settings: {
            borderWidth: 4, cornerRadius: 22, taperAmount: 16, frontPartOffsetY: 10, dynamicTabWidth: 175, dynamicTabOffset: 30,
            frontGradientStops: ['#74c7ec', '#89dceb'], frontGradientAngle: 225, frontGradientSpread: 92, frontGradientOffsetY: 7,
            backGradientStops: ['#89b4fa', '#74c7ec'], backGradientAngle: 180, backGradientSpread: 85, backGradientOffsetY: 4,
            borderGradientStops: ['#89dceb', '#b4befe'], borderGradientAngle: 135, borderGradientSpread: 98, borderGradientOffsetY: -1,
            highlightStrength: 0.5, currentImageOpacity: 0.7, imageFit: 'cover', currentBlendMode: 'color-dodge',
            dropShadowEnabled: true, shadowColor: '#74c7ec', shadowBlur: 14, shadowOffsetX: 2, shadowOffsetY: 7, shadowOpacity: 0.3, shadowSpread: 0
        }
    },
    'rose-garden': {
        name: '🌹 Rose Garden',
        settings: {
            borderWidth: 5, cornerRadius: 14, taperAmount: 20, frontPartOffsetY: 16, dynamicTabWidth: 165, dynamicTabOffset: 45,
            frontGradientStops: ['#f38ba8', '#eba0ac'], frontGradientAngle: 90, frontGradientSpread: 88, frontGradientOffsetY: 9,
            backGradientStops: ['#f2cdcd', '#f5c2e7'], backGradientAngle: 270, backGradientSpread: 82, backGradientOffsetY: -2,
            borderGradientStops: ['#eba0ac', '#f5c2e7'], borderGradientAngle: 45, borderGradientSpread: 102, borderGradientOffsetY: 3,
            highlightStrength: 0.45, currentImageOpacity: 0.9, imageFit: 'cover', currentBlendMode: 'hard-light',
            dropShadowEnabled: true, shadowColor: '#f38ba8', shadowBlur: 16, shadowOffsetX: 4, shadowOffsetY: 9, shadowOpacity: 0.4, shadowSpread: 0
        }
    }
    ,
    'aurora-flare': {
        name: '🌌 Aurora Flare',
        settings: {
            borderWidth: 4, cornerRadius: 20, taperAmount: 25, frontPartOffsetY: 10, dynamicTabWidth: 150, dynamicTabOffset: 40,
            frontGradientStops: ['#cba6f7', '#89b4fa', '#74c7ec', '#94e2d5'], // Mauve, Blue, Sapphire, Teal
            frontGradientAngle: 160, frontGradientSpread: 90, frontGradientOffsetY: 10,
            backGradientStops: ['#313244', '#45475a', '#585b70'], // Surface0, Surface1, Surface2
            backGradientAngle: 200, backGradientSpread: 80, backGradientOffsetY: -5,
            borderGradientStops: ['#f5c2e7', '#eba0ac', '#fab387'], // Pink, Maroon, Peach
            borderGradientAngle: 45, borderGradientSpread: 100, borderGradientOffsetY: 0,
            highlightStrength: 0.4, currentImageOpacity: 0.85, imageFit: 'cover', currentBlendMode: 'overlay',
            dropShadowEnabled: true, shadowColor: '#1e1e2e', shadowBlur: 10, shadowOffsetX: 3, shadowOffsetY: 5, shadowOpacity: 0.35, shadowSpread: 0
        }
    },
    'crimson-depth': {
        name: '🌹 Crimson Depth',
        settings: {
            borderWidth: 5, cornerRadius: 15, taperAmount: 18, frontPartOffsetY: 12, dynamicTabWidth: 170, dynamicTabOffset: 30,
            frontGradientStops: ['#f38ba8', '#eba0ac', '#313244'], // Red, Maroon, Surface0 hex for depth
            frontGradientAngle: 270, frontGradientSpread: 100, frontGradientOffsetY: 0,
            backGradientStops: ['#1e1e2e', '#11111b', '#181825'], // Base, Crust, Mantle
            backGradientAngle: 90, backGradientSpread: 100, backGradientOffsetY: 0,
            borderGradientStops: ['#fab387', '#f9e2af', '#fab387'], // Peach, Yellow, Peach hex
            borderGradientAngle: 0, borderGradientSpread: 90, borderGradientOffsetY: 5,
            highlightStrength: 0.2, currentImageOpacity: 0.9, imageFit: 'cover', currentBlendMode: 'multiply',
            dropShadowEnabled: true, shadowColor: '#000000', shadowBlur: 8, shadowOffsetX: 4, shadowOffsetY: 4, shadowOpacity: 0.4, shadowSpread: 0
        }
    },
    'emerald-forest': {
        name: '🌲 Emerald Forest',
        settings: {
            borderWidth: 3, cornerRadius: 22, taperAmount: 12, frontPartOffsetY: 8, dynamicTabWidth: 190, dynamicTabOffset: 20,
            frontGradientStops: ['#a6e3a1', '#94e2d5', '#a6e3a1', '#45475a'], // Green, Teal, Green, Surface1 for depth
            frontGradientAngle: 75, frontGradientSpread: 85, frontGradientOffsetY: -8,
            backGradientStops: ['#6c7086', '#585b70', '#313244'], // Overlay0, Surface2, Surface0
            backGradientAngle: 225, backGradientSpread: 95, backGradientOffsetY: 3,
            borderGradientStops: ['#f9e2af', '#fab387', '#f5e0dc'], // Yellow, Peach, Rosewater
            borderGradientAngle: 135, borderGradientSpread: 100, borderGradientOffsetY: 0,
            highlightStrength: 0.5, currentImageOpacity: 0.7, imageFit: 'contain', currentBlendMode: 'soft-light',
            dropShadowEnabled: false, shadowColor: '#000000', shadowBlur: 5, shadowOffsetX: 2, shadowOffsetY: 2, shadowOpacity: 0.2, shadowSpread: 0
        }
    },
    'cosmic-fire': {
        name: '🔥 Cosmic Fire',
        settings: {
            borderWidth: 8, cornerRadius: 12, taperAmount: 30, frontPartOffsetY: 18, dynamicTabWidth: 140, dynamicTabOffset: 50,
            frontGradientStops: ['#ff0066', '#ff6600', '#ffcc00', '#ff3366', '#cc0000'], // Vibrant fire progression
            frontGradientAngle: 45, frontGradientSpread: 120, frontGradientOffsetY: 15,
            backGradientStops: ['#1a0000', '#330000', '#660000', '#1a0000'], // Deep red-black depth
            backGradientAngle: 225, backGradientSpread: 90, backGradientOffsetY: -10,
            borderGradientStops: ['#ffff00', '#ff9900', '#ff0000', '#990000', '#ffff00'], // Glowing border
            borderGradientAngle: 0, borderGradientSpread: 150, borderGradientOffsetY: 8,
            highlightStrength: 0.9, currentImageOpacity: 0.95, imageFit: 'cover', currentBlendMode: 'screen',
            dropShadowEnabled: true, shadowColor: '#ff3300', shadowBlur: 25, shadowOffsetX: 0, shadowOffsetY: 15, shadowOpacity: 0.7, shadowSpread: 0
        }
    },
    'matrix-code': {
        name: '💚 Matrix Code',
        settings: {
            borderWidth: 2, cornerRadius: 8, taperAmount: 5, frontPartOffsetY: 4, dynamicTabWidth: 200, dynamicTabOffset: 15,
            frontGradientStops: ['#00ff00', '#008800', '#004400', '#002200', '#000000'], // Classic matrix green fade
            frontGradientAngle: 180, frontGradientSpread: 100, frontGradientOffsetY: 0,
            backGradientStops: ['#000000', '#001100', '#000000'], // Deep black with subtle green tint
            backGradientAngle: 90, backGradientSpread: 80, backGradienOffsetY: 5,
            borderGradientStops: ['#00ff00', '#00cc00', '#00ff00'], // Bright green pulsing border
            borderGradientAngle: 270, borderGradientSpread: 110, borderGradientOffsetY: -3,
            highlightStrength: 0.1, currentImageOpacity: 0.6, imageFit: 'contain', currentBlendMode: 'multiply',
            dropShadowEnabled: true, shadowColor: '#00ff00', shadowBlur: 20, shadowOffsetX: 2, shadowOffsetY: 4, shadowOpacity: 0.5, shadowSpread: 0
        }
    },
    'rainbow-prism': {
        name: '🌈 Rainbow Prism',
        settings: {
            borderWidth: 6, cornerRadius: 24, taperAmount: 20, frontPartOffsetY: 12, dynamicTabWidth: 160, dynamicTabOffset: 35,
            frontGradientStops: ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0088ff', '#8800ff', '#ff0088'], // Full spectrum
            frontGradientAngle: 135, frontGradientSpread: 140, frontGradientOffsetY: 10,
            backGradientStops: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0'], // Bright white base
            backGradientAngle: 315, backGradientSpread: 85, backGradientOffsetY: -5,
            borderGradientStops: ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff'], // Cycling colors
            borderGradientAngle: 90, borderGradientSpread: 160, borderGradientOffsetY: 12,
            highlightStrength: 0.8, currentImageOpacity: 0.8, imageFit: 'cover', currentBlendMode: 'color-dodge',
            dropShadowEnabled: true, shadowColor: '#8800ff', shadowBlur: 18, shadowOffsetX: 6, shadowOffsetY: 12, shadowOpacity: 0.4, shadowSpread: 0
        }
    },
    'golden-luxury': {
        name: '✨ Golden Luxury',
        settings: {
            borderWidth: 7, cornerRadius: 18, taperAmount: 25, frontPartOffsetY: 15, dynamicTabWidth: 155, dynamicTabOffset: 42,
            frontGradientStops: ['#ffd700', '#ffed4a', '#ffc107', '#ff8f00', '#b8860b'], // Rich gold progression
            frontGradientAngle: 60, frontGradientSpread: 110, frontGradientOffsetY: 12,
            backGradientStops: ['#2d1810', '#3d2418', '#4d3020', '#2d1810'], // Luxurious dark brown
            backGradientAngle: 240, backGradientSpread: 95, backGradientOffsetY: -8,
            borderGradientStops: ['#ffffff', '#ffd700', '#ffed4a', '#ffd700', '#ffffff'], // Shimmering gold border
            borderGradientAngle: 180, borderGradientSpread: 130, borderGradientOffsetY: 5,
            highlightStrength: 0.75, currentImageOpacity: 0.9, imageFit: 'cover', currentBlendMode: 'overlay',
            dropShadowEnabled: true, shadowColor: '#b8860b', shadowBlur: 22, shadowOffsetX: 4, shadowOffsetY: 10, shadowOpacity: 0.6, shadowSpread: 0
        }
    },
    'cyber-neon': {
        name: '⚡ Cyber Neon',
        settings: {
            borderWidth: 4, cornerRadius: 6, taperAmount: 8, frontPartOffsetY: 6, dynamicTabWidth: 180, dynamicTabOffset: 25,
            frontGradientStops: ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0088'], // Electric neon mix
            frontGradientAngle: 315, frontGradientSpread: 125, frontGradientOffsetY: 8,
            backGradientStops: ['#0a0a0a', '#1a0a1a', '#0a1a1a', '#1a1a0a'], // Dark with color tints
            backGradientAngle: 135, backGradientSpread: 88, backGradientOffsetY: 3,
            borderGradientStops: ['#ffffff', '#00ffff', '#ff00ff', '#ffff00', '#ffffff'], // Bright cycling neon
            borderGradientAngle: 45, borderGradientSpread: 150, borderGradientOffsetY: -2,
            highlightStrength: 0.95, currentImageOpacity: 0.85, imageFit: 'cover', currentBlendMode: 'screen',
            dropShadowEnabled: true, shadowColor: '#00ffff', shadowBlur: 30, shadowOffsetX: 0, shadowOffsetY: 8, shadowOpacity: 0.8, shadowSpread: 0
        }
    },
    'deep-ocean': {
        name: '🌊 Deep Ocean',
        settings: {
            borderWidth: 5, cornerRadius: 28, taperAmount: 15, frontPartOffsetY: 10, dynamicTabWidth: 175, dynamicTabOffset: 30,
            frontGradientStops: ['#001133', '#003366', '#006699', '#0099cc', '#00ccff', '#66ddff'], // Ocean depth to surface
            frontGradientAngle: 90, frontGradientSpread: 120, frontGradientOffsetY: 20,
            backGradientStops: ['#000011', '#000822', '#001133', '#000011'], // Abyssal depths
            backGradientAngle: 270, backGradientSpread: 75, backGradientOffsetY: -12,
            borderGradientStops: ['#66ddff', '#00ccff', '#0099cc', '#006699', '#66ddff'], // Wave-like border
            borderGradientAngle: 135, borderGradientSpread: 140, borderGradientOffsetY: 8,
            highlightStrength: 0.35, currentImageOpacity: 0.75, imageFit: 'cover', currentBlendMode: 'soft-light',
            dropShadowEnabled: true, shadowColor: '#003366', shadowBlur: 16, shadowOffsetX: 3, shadowOffsetY: 12, shadowOpacity: 0.5, shadowSpread: 0
        }
    },
    'volcanic-glass': {
        name: '🌋 Volcanic Glass',
        settings: {
            borderWidth: 9, cornerRadius: 10, taperAmount: 35, frontPartOffsetY: 20, dynamicTabWidth: 130, dynamicTabOffset: 55,
            frontGradientStops: ['#ff4500', '#cc3300', '#990000', '#660000', '#330000', '#000000'], // Lava cooling effect
            frontGradientAngle: 225, frontGradientSpread: 100, frontGradientOffsetY: 18,
            backGradientStops: ['#1a1a1a', '#2d2d2d', '#404040', '#1a1a1a'], // Volcanic rock texture
            backGradientAngle: 45, backGradientSpread: 90, backGradientOffsetY: -15,
            borderGradientStops: ['#ffff00', '#ff8800', '#ff4400', '#cc0000', '#ffff00'], // Molten metal border
            borderGradientAngle: 0, borderGradientSpread: 160, borderGradientOffsetY: 10,
            highlightStrength: 0.15, currentImageOpacity: 0.95, imageFit: 'cover', currentBlendMode: 'multiply',
            dropShadowEnabled: true, shadowColor: '#cc3300', shadowBlur: 35, shadowOffsetX: 8, shadowOffsetY: 18, shadowOpacity: 0.7, shadowSpread: 0
        }
    }
};

function loadCustomPresets() {
    try {
        const saved = localStorage.getItem(CUSTOM_PRESETS_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading custom presets:', error);
        setMessage('⚠️ Error loading custom presets', 'error');
        return {};
    }
}

// Attach custom preset functions to window for inline onclick handlers
window.loadCustomPreset = loadCustomPreset;
window.deleteCustomPreset = deleteCustomPreset;

function saveCustomPresets(customPresets) {
    try {
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
    } catch (error) {
        console.error('Error saving custom presets:', error);
        setMessage('⚠️ Error saving custom presets', 'error');
    }
}

export function updateCustomPresetsUI() {
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
}

function loadCustomPreset(key: string) {
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
}

function deleteCustomPreset(key: string) {
    if (confirm('Are you sure you want to delete this preset?')) {
        const customPresets = loadCustomPresets();
        delete customPresets[key];
        saveCustomPresets(customPresets);
        updateCustomPresetsUI();
        setMessage('🗑️ Preset deleted', 'default');
    }
}

export function loadPreset(presetKey: string) {
    const { updateSettings } = useAppStore.getState();
    if (presets[presetKey]) {
        updateSettings(presets[presetKey].settings);
        updateControlsFromState();
        drawFolderIcon();
        setMessage(`✨ Loaded preset: ${presets[presetKey].name}`, 'success');
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
    }
}

export function saveCurrentAsPreset() {
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
            settings: JSON.parse(JSON.stringify(settings)) // Deep copy of current settings
        };
        saveCustomPresets(customPresets);
        updateCustomPresetsUI();
        setMessage(`💾 Saved preset: ${name}`, 'success');
    }
}
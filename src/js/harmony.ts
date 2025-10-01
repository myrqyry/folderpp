// Color Harmony Tools
import { settings } from './state.ts';
import { updateControlsFromState, drawFolderIcon } from './dom.js';
import { saveSettings, setMessage } from './utils.js';

// Color conversion utilities
function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Main color harmony generation function
export function generateColorHarmony(type) {
    // Use the first front gradient color as the base
    const baseColor = settings.frontGradientStops[0] || '#89b4fa';
    const [h, s, l] = hexToHsl(baseColor);
    let colors = [];

    switch (type) {
        case 'complementary':
            colors = [baseColor, hslToHex((h + 180) % 360, s, l)];
            break;
        case 'analogous':
            colors = [baseColor, hslToHex((h + 30) % 360, s, l), hslToHex((h - 30 + 360) % 360, s, l)];
            break;
        case 'triadic':
            colors = [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
            break;
        case 'monochromatic':
            colors = [hslToHex(h, s, Math.max(10, l - 20)), baseColor, hslToHex(h, s, Math.min(90, l + 20))];
            break;
        default:
            console.error('Unknown harmony type:', type);
            return;
    }

    // Apply colors to gradients
    settings.frontGradientStops = colors.slice(0, 2);
    settings.backGradientStops = colors.slice(1, 3) || [colors[0], colors[1]];
    settings.borderGradientStops = [colors[0], colors[colors.length - 1]];
    
    // Update UI and canvas
    updateControlsFromState();
    saveSettings();
    drawFolderIcon();
    setMessage(`🌈 Applied ${type} harmony!`, 'success');
}

// Setup event listeners for harmony buttons
export function setupHarmonyControls() {
    const complementaryBtn = document.getElementById('complementaryBtn');
    const analogousBtn = document.getElementById('analogousBtn');
    const triadicBtn = document.getElementById('triadicBtn');
    const monochromaticBtn = document.getElementById('monochromaticBtn');

    if (complementaryBtn) {
        complementaryBtn.addEventListener('click', () => generateColorHarmony('complementary'));
    }

    if (analogousBtn) {
        analogousBtn.addEventListener('click', () => generateColorHarmony('analogous'));
    }

    if (triadicBtn) {
        triadicBtn.addEventListener('click', () => generateColorHarmony('triadic'));
    }

    if (monochromaticBtn) {
        monochromaticBtn.addEventListener('click', () => generateColorHarmony('monochromatic'));
    }
}

// --- Enhanced Shadow Controls UI Rendering ---
import { useAppStore } from './state';
import { drawFolderIcon, shadowPreview, shadowToggle } from './dom';
import { debounce, hexToRgba } from './utils';

// Initialize the shadow toggle functionality
export function initShadowToggle() {
    const { settings, updateSettings } = useAppStore.getState();
    const toggle = document.getElementById('shadowToggle') as HTMLInputElement;
    if (!toggle) {
        console.error('❌ Shadow toggle element not found!');
        return;
    }

    toggle.checked = settings.dropShadowEnabled;

    toggle.addEventListener('change', () => {
        updateSettings({ dropShadowEnabled: toggle.checked });
        renderShadowControls();
        drawFolderIcon();
    });

    renderShadowControls();
}

// Shadow preview update function
function updateShadowPreview() {
    const { settings } = useAppStore.getState();
    if (shadowPreview && settings.dropShadowEnabled) {
        shadowPreview.classList.remove('hidden');
        const spread = settings.shadowSpread || 0;
        shadowPreview.style.boxShadow = `${settings.shadowOffsetX}px ${settings.shadowOffsetY}px ${settings.shadowBlur}px ${spread}px ${hexToRgba(settings.shadowColor, settings.shadowOpacity)}`;
    } else if (shadowPreview) {
        shadowPreview.classList.add('hidden');
        shadowPreview.style.boxShadow = 'none';
    }
}

export function renderShadowControls() {
    const { settings, updateSettings } = useAppStore.getState();
    const shadowControlsContainer = document.getElementById('shadowControls');
    if (!shadowControlsContainer) return;

    shadowControlsContainer.innerHTML = '';
    shadowControlsContainer.classList.remove('hidden');
    shadowControlsContainer.classList.toggle('shadow-controls-disabled', !settings.dropShadowEnabled);
    if (shadowPreview) {
        shadowPreview.classList.toggle('hidden', !settings.dropShadowEnabled);
    }

    const grid = document.createElement('div');
    grid.className = 'shadow-grid control-grid gap-3';

    // Helper to create sliders
    const createSlider = (label, id, min, max, step, value, settingKey) => {
        const div = document.createElement('div');
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.className = 'text-[var(--subtext0)] text-xs mb-1 block';
        const valueSpan = `<span id="${id}ValueDisplay" class="font-semibold text-[var(--text)]">${value}</span>`;
        lbl.innerHTML = `${label}: ${valueSpan}${step === 0.01 ? '' : 'px'}`;

        const input = document.createElement('input');
        input.type = 'range';
        input.id = id;
        input.min = String(min);
        input.max = String(max);
        if (step) input.step = String(step);
        input.value = String(value);
        input.className = 'w-full accent-[var(--blue)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';

        input.oninput = debounce(() => {
            const newValue = parseFloat(input.value);
            (document.getElementById(`${id}ValueDisplay`) as HTMLElement).textContent = String(newValue);
            updateSettings({ [settingKey]: newValue });
            updateShadowPreview();
            drawFolderIcon();
        }, 50);

        div.appendChild(lbl);
        div.appendChild(input);
        return div;
    };

    // Shadow Color Picker
    const colorDiv = document.createElement('div');
    colorDiv.className = 'shadow-color-picker';
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'shadowColorPickerInput';
    colorLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    colorLabel.textContent = 'Shadow Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'shadowColorPickerInput';
    colorInput.value = settings.shadowColor;
    colorInput.className = 'w-full h-10 p-1 border border-[var(--surface1)] rounded-md bg-[var(--surface0)]';
    colorInput.addEventListener('input', debounce(() => {
        updateSettings({ shadowColor: colorInput.value });
        updateShadowPreview();
        drawFolderIcon();
    }, 150));
    colorDiv.appendChild(colorLabel);
    colorDiv.appendChild(colorInput);
    grid.appendChild(colorDiv);

    // Create sliders
    grid.appendChild(createSlider('Blur', 'shadowBlurRange', 0, 50, 1, settings.shadowBlur, 'shadowBlur'));
    grid.appendChild(createSlider('Offset X', 'shadowOffsetXRange', -25, 25, 1, settings.shadowOffsetX, 'shadowOffsetX'));
    grid.appendChild(createSlider('Offset Y', 'shadowOffsetYRange', -25, 25, 1, settings.shadowOffsetY, 'shadowOffsetY'));
    grid.appendChild(createSlider('Opacity', 'shadowOpacityRange', 0, 1, 0.01, settings.shadowOpacity, 'shadowOpacity'));
    grid.appendChild(createSlider('Spread', 'shadowSpreadRange', 0, 25, 1, settings.shadowSpread || 0, 'shadowSpread'));

    shadowControlsContainer.appendChild(grid);

    // Shadow Presets
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'mt-4 pt-3 border-t border-[var(--surface0)]';
    const presetsTitle = document.createElement('h4');
    presetsTitle.className = 'text-sm font-semibold text-[var(--subtext1)] mb-2';
    presetsTitle.textContent = 'Quick Shadow Presets:';
    presetsContainer.appendChild(presetsTitle);

    const presetsGrid = document.createElement('div');
    presetsGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-2';

    const shadowPresets = {
        soft: { name: 'Soft', settings: { dropShadowEnabled: true, shadowColor: '#000000', shadowBlur: 15, shadowOffsetX: 2, shadowOffsetY: 5, shadowOpacity: 0.2, shadowSpread: 0 } },
        hard: { name: 'Hard', settings: { dropShadowEnabled: true, shadowColor: '#000000', shadowBlur: 0, shadowOffsetX: 3, shadowOffsetY: 3, shadowOpacity: 0.3, shadowSpread: 0 } },
        glow: { name: 'Glow', settings: { dropShadowEnabled: true, shadowColor: (settings.frontGradientStops?.[0] || '#89b4fa'), shadowBlur: 20, shadowOffsetX: 0, shadowOffsetY: 0, shadowOpacity: 0.5, shadowSpread: 3 } },
        long: { name: 'Long', settings: { dropShadowEnabled: true, shadowColor: '#000000', shadowBlur: 10, shadowOffsetX: 10, shadowOffsetY: 10, shadowOpacity: 0.15, shadowSpread: 0 } },
        none: { name: 'None', settings: { dropShadowEnabled: false } }
    };

    Object.values(shadowPresets).forEach((preset) => {
        const button = document.createElement('button');
        button.className = 'gemini-button text-xs !py-1.5 !px-2 shadow-quick-preset';
        button.textContent = preset.name;
        button.onclick = () => {
            updateSettings(preset.settings);
            if(shadowToggle) shadowToggle.checked = useAppStore.getState().settings.dropShadowEnabled;
            renderShadowControls();
            updateShadowPreview();
            drawFolderIcon();
        };
        presetsGrid.appendChild(button);
    });

    presetsContainer.appendChild(presetsGrid);
    shadowControlsContainer.appendChild(presetsContainer);

    updateShadowPreview();
}
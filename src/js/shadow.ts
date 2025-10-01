// --- Enhanced Shadow Controls UI Rendering ---
import { settings } from './state.ts';
import { drawFolderIcon, shadowPreview, shadowToggle } from './dom.js';
import { saveSettings, debounce, hexToRgba } from './utils.js';

// Initialize the shadow toggle functionality
export function initShadowToggle() {
    const toggle = document.getElementById('shadowToggle');
    if (!toggle) {
        console.error('❌ Shadow toggle element not found!');
        return;
    }

    // Set initial state
    toggle.checked = settings.dropShadowEnabled;

    // Add event listener with a named handler function to avoid scope issues
    toggle.addEventListener('change', function shadowToggleHandler(e) {
        settings.dropShadowEnabled = toggle.checked;
        saveSettings();
        renderShadowControls();
        drawFolderIcon();
    });

    // Initial render of shadow controls based on current toggle state
    renderShadowControls();
}

// Shadow preview update function
function updateShadowPreview() {
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
    const shadowControlsContainer = document.getElementById('shadowControls');
    if (!shadowControlsContainer) {
        console.error("shadowControls container not found!");
        return;
    }
    shadowControlsContainer.innerHTML = ''; // Clear previous controls

    // Always show the container
    shadowControlsContainer.classList.remove('hidden');

    // Toggle disabled class based on shadow enabled state
    if (settings.dropShadowEnabled) {
        shadowControlsContainer.classList.remove('shadow-controls-disabled');
    } else {
        shadowControlsContainer.classList.add('shadow-controls-disabled');
    }

    // Setup preview visibility based on enabled state
    if (shadowPreview) {
        if (settings.dropShadowEnabled) {
            shadowPreview.classList.remove('hidden');
        } else {
            shadowPreview.classList.add('hidden');
        }
    }

    const grid = document.createElement('div');
    grid.className = 'shadow-grid control-grid gap-3'; // Added gap-3 for spacing

    // Shadow Color Picker
    const colorDiv = document.createElement('div');
    colorDiv.className = 'shadow-color-picker'; // Defined in CSS for potential specific styling
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'shadowColorPickerInput';
    colorLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    colorLabel.textContent = 'Shadow Color:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.id = 'shadowColorPickerInput'; // Use this ID if shadowColorPicker is the input itself
    colorInput.value = settings.shadowColor;
    colorInput.className = 'w-full h-10 p-1 border border-[var(--surface1)] rounded-md bg-[var(--surface0)]'; // Tailwind-like classes
    colorInput.addEventListener('input', debounce(() => {
        settings.shadowColor = colorInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    },150));
    colorDiv.appendChild(colorLabel);
    colorDiv.appendChild(colorInput);
    grid.appendChild(colorDiv);

    // Shadow Blur
    const blurDiv = document.createElement('div');
    const blurLabel = document.createElement('label');
    blurLabel.htmlFor = 'shadowBlurRange';
    blurLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    blurLabel.innerHTML = `Blur: <span id="shadowBlurValueDisplay" class="font-semibold text-[var(--text)]">${settings.shadowBlur}</span>px`;
    const blurInput = document.createElement('input');
    blurInput.type = 'range';
    blurInput.id = 'shadowBlurRange';
    blurInput.min = 0; blurInput.max = 50; blurInput.value = settings.shadowBlur;
    blurInput.className = 'w-full accent-[var(--blue)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';
    blurInput.oninput = () => {
        settings.shadowBlur = parseInt(blurInput.value);
        document.getElementById('shadowBlurValueDisplay').textContent = blurInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    };
    blurDiv.appendChild(blurLabel);
    blurDiv.appendChild(blurInput);
    grid.appendChild(blurDiv);

    // Shadow Offset X
    const offsetXDiv = document.createElement('div');
    const offsetXLabel = document.createElement('label');
    offsetXLabel.htmlFor = 'shadowOffsetXRange';
    offsetXLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    offsetXLabel.innerHTML = `Offset X: <span id="shadowOffsetXValueDisplay" class="font-semibold text-[var(--text)]">${settings.shadowOffsetX}</span>px`;
    const offsetXInput = document.createElement('input');
    offsetXInput.type = 'range';
    offsetXInput.id = 'shadowOffsetXRange';
    offsetXInput.min = -25; offsetXInput.max = 25; offsetXInput.value = settings.shadowOffsetX;
    offsetXInput.className = 'w-full accent-[var(--green)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';
    offsetXInput.oninput = () => {
        settings.shadowOffsetX = parseInt(offsetXInput.value);
        document.getElementById('shadowOffsetXValueDisplay').textContent = offsetXInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    };
    offsetXDiv.appendChild(offsetXLabel);
    offsetXDiv.appendChild(offsetXInput);
    grid.appendChild(offsetXDiv);

    // Shadow Offset Y
    const offsetYDiv = document.createElement('div');
    const offsetYLabel = document.createElement('label');
    offsetYLabel.htmlFor = 'shadowOffsetYRange';
    offsetYLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    offsetYLabel.innerHTML = `Offset Y: <span id="shadowOffsetYValueDisplay" class="font-semibold text-[var(--text)]">${settings.shadowOffsetY}</span>px`;
    const offsetYInput = document.createElement('input');
    offsetYInput.type = 'range';
    offsetYInput.id = 'shadowOffsetYRange';
    offsetYInput.min = -25; offsetYInput.max = 25; offsetYInput.value = settings.shadowOffsetY;
    offsetYInput.className = 'w-full accent-[var(--yellow)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';
    offsetYInput.oninput = () => {
        settings.shadowOffsetY = parseInt(offsetYInput.value);
        document.getElementById('shadowOffsetYValueDisplay').textContent = offsetYInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    };
    offsetYDiv.appendChild(offsetYLabel);
    offsetYDiv.appendChild(offsetYInput);
    grid.appendChild(offsetYDiv);

    // Shadow Opacity
    const opacityDiv = document.createElement('div');
    const opacityLabel = document.createElement('label');
    opacityLabel.htmlFor = 'shadowOpacityRange';
    opacityLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    opacityLabel.innerHTML = `Opacity: <span id="shadowOpacityValueDisplay" class="font-semibold text-[var(--text)]">${settings.shadowOpacity}</span>`;
    const opacityInput = document.createElement('input');
    opacityInput.type = 'range';
    opacityInput.id = 'shadowOpacityRange';
    opacityInput.min = 0; opacityInput.max = 1; opacityInput.step = 0.01; opacityInput.value = settings.shadowOpacity;
    opacityInput.className = 'w-full accent-[var(--mauve)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';
    opacityInput.oninput = () => {
        settings.shadowOpacity = parseFloat(opacityInput.value);
        document.getElementById('shadowOpacityValueDisplay').textContent = opacityInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    };
    opacityDiv.appendChild(opacityLabel);
    opacityDiv.appendChild(opacityInput);
    grid.appendChild(opacityDiv);

    // Shadow Spread
    const spreadDiv = document.createElement('div');
    const spreadLabel = document.createElement('label');
    spreadLabel.htmlFor = 'shadowSpreadRange';
    spreadLabel.className = 'text-[var(--subtext0)] text-xs mb-1 block';
    spreadLabel.innerHTML = `Spread: <span id="shadowSpreadValueDisplay" class="font-semibold text-[var(--text)]">${settings.shadowSpread || 0}</span>px`;
    const spreadInput = document.createElement('input');
    spreadInput.type = 'range';
    spreadInput.id = 'shadowSpreadRange';
    spreadInput.min = 0; spreadInput.max = 25; spreadInput.value = settings.shadowSpread || 0;
    if(settings.shadowSpread === undefined) settings.shadowSpread = 0; // Initialize
    spreadInput.className = 'w-full accent-[var(--pink)] h-2 bg-[var(--surface0)] rounded-lg appearance-none cursor-pointer';
    spreadInput.oninput = () => {
        settings.shadowSpread = parseInt(spreadInput.value);
        document.getElementById('shadowSpreadValueDisplay').textContent = spreadInput.value;
        updateShadowPreview();
        saveSettings();
        drawFolderIcon();
    };
    spreadDiv.appendChild(spreadLabel);
    spreadDiv.appendChild(spreadInput);
    grid.appendChild(spreadDiv);

    shadowControlsContainer.appendChild(grid);

    // Shadow Presets Container
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'mt-4 pt-3 border-t border-[var(--surface0)]';
    const presetsTitle = document.createElement('h4');
    presetsTitle.className = 'text-sm font-semibold text-[var(--subtext1)] mb-2';
    presetsTitle.textContent = 'Quick Shadow Presets:';
    presetsContainer.appendChild(presetsTitle);

    const presetsGrid = document.createElement('div');
    presetsGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-2';

    const shadowPresets = {
        soft: { name: 'Soft', color: '#000000', blur: 15, offsetX: 2, offsetY: 5, opacity: 0.2, spread: 0 },
        hard: { name: 'Hard', color: '#000000', blur: 0, offsetX: 3, offsetY: 3, opacity: 0.3, spread: 0 },
        glow: {
            name: 'Glow',
            color: (settings.frontGradientStops && settings.frontGradientStops.length > 0 && settings.frontGradientStops[0]) ? settings.frontGradientStops[0] : '#89b4fa',
            blur: 20, offsetX: 0, offsetY: 0, opacity: 0.5, spread: 3
        },
        long: { name: 'Long', color: '#000000', blur: 10, offsetX: 10, offsetY: 10, opacity: 0.15, spread: 0 },
        inner: { name: 'Inner (Effect)', color: '#000000', blur: 5, offsetX: 0, offsetY: -2, opacity: 0.2, spread: 0, inner: true }, // 'inner' is conceptual here
        none: { name: 'None', enabled: false }
    };

    Object.entries(shadowPresets).forEach(([key, preset]) => {
        const button = document.createElement('button');
        button.className = 'gemini-button text-xs !py-1.5 !px-2 shadow-quick-preset'; // Using existing button style with shadow theme
        button.textContent = preset.name;
        button.onclick = () => {
            if (key === 'none') {
                settings.dropShadowEnabled = false;
            } else {
                settings.dropShadowEnabled = true;
                settings.shadowColor = preset.color;
                settings.shadowBlur = preset.blur;
                settings.shadowOffsetX = preset.offsetX;
                settings.shadowOffsetY = preset.offsetY;
                settings.shadowOpacity = preset.opacity;
                settings.shadowSpread = preset.spread;
                // Note: True inner shadow requires different canvas drawing logic, not just settings.
                // This preset button for 'Inner' will apply settings that mimic an inner feel.
            }
            if(shadowToggle) shadowToggle.checked = settings.dropShadowEnabled;
            renderShadowControls(); // Re-render to show/hide and update values
            updateShadowPreview();
            saveSettings();
            drawFolderIcon();
        };
        presetsGrid.appendChild(button);
    });

    presetsContainer.appendChild(presetsGrid);
    shadowControlsContainer.appendChild(presetsContainer);

    updateShadowPreview();
}

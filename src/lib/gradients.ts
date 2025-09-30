// Gradient controls and rendering
import { useAppStore } from './state';
import { drawFolderIcon } from './dom';
import { debounce } from './utils';

// Function to update the gradient preview display
export function updateGradientPreview(type: 'front' | 'back' | 'border') {
    const { settings } = useAppStore.getState();
    const stopsKey = `${type}GradientStops`;
    const angleKey = `${type}GradientAngle`;
    const previewEl = document.getElementById(`${type}GradientPreview`) as HTMLElement;
    
    if (!previewEl || !settings[stopsKey]) {
        return;
    }
    
    // Generate the CSS gradient string based on the stops
    let gradientColors = '';
    if (settings[stopsKey].length === 1) {
        // Solid color for single stop
        gradientColors = settings[stopsKey][0];
        previewEl.style.background = gradientColors;
    } else {
        // Linear gradient for multiple stops
        const angle = settings[angleKey] || 90;
        
        // Create color stops
        const colorStopsArray = settings[stopsKey].map((color, index) => {
            const percentage = (index / (settings[stopsKey].length - 1)) * 100;
            return `${color} ${percentage}%`;
        });
        
        gradientColors = `linear-gradient(${angle}deg, ${colorStopsArray.join(', ')})`;
        previewEl.style.background = gradientColors;
    }
    
    // Add some styling to the preview element
    previewEl.style.height = '40px';
    previewEl.style.borderRadius = '0.375rem';
    previewEl.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
    previewEl.style.border = '1px solid var(--surface1)';
    previewEl.style.transition = 'all 0.3s ease';
}

export function renderGradientStopsUI(type: 'front' | 'back' | 'border') {
    const { settings, updateSettings } = useAppStore.getState();
    const stopsKey = `${type}GradientStops`;
    const angleKey = `${type}GradientAngle`;
    const spreadKey = `${type}GradientSpread`;
    const offsetKey = `${type}GradientOffsetY`;

    // Default colors for each section (used when only one stop remains)
    const defaultColors: Record<string, string> = {
        front: '#ff6b6b',  // Vibrant coral
        back: '#a8e6cf',   // Mint green
        border: '#ff8a80'  // Light red
    };

    const sectionContainer = document.getElementById(`${type}ColorSection`);
    if (!sectionContainer) {
        console.error(`Gradient section container not found for type: ${type}ColorSection`);
        return;
    }

    // Get existing sliders to update them with current settings
    const angleSlider = document.getElementById(`${type}GradientAngle`) as HTMLInputElement;
    const spreadSlider = document.getElementById(`${type}GradientSpread`) as HTMLInputElement;
    const offsetYSlider = document.getElementById(`${type}GradientOffsetY`) as HTMLInputElement;
    
    // Update the existing slider values from settings
    if (angleSlider) {
        angleSlider.value = String(settings[angleKey]);
        document.getElementById(`${type}GradientAngleValue`).textContent = settings[angleKey] + '°';
    }
    
    if (spreadSlider) {
        spreadSlider.value = String(settings[spreadKey] || 100);
        document.getElementById(`${type}GradientSpreadValue`).textContent = (settings[spreadKey] || 100) + '%';
    }
    
    if (offsetYSlider) {
        offsetYSlider.value = String(settings[offsetKey] || 0);
        document.getElementById(`${type}GradientOffsetYValue`).textContent = (settings[offsetKey] || 0) + 'px';
    }

    // Clear previous dynamic controls
    let dynamicControlsContainer = document.getElementById(`${type}GradientDynamicControls`);
    if (dynamicControlsContainer) {
        dynamicControlsContainer.innerHTML = '';
    } else {
        dynamicControlsContainer = document.createElement('div');
        dynamicControlsContainer.id = `${type}GradientDynamicControls`;
        sectionContainer.appendChild(dynamicControlsContainer);
    }

    // Ensure there's always at least one stop
    if (!settings[stopsKey] || settings[stopsKey].length === 0) {
        updateSettings({ [stopsKey]: [defaultColors[type]] });
    } else if (settings[stopsKey].length === 1 && !settings[stopsKey][0]) {
        const newStops = [...settings[stopsKey]];
        newStops[0] = defaultColors[type];
        updateSettings({ [stopsKey]: newStops });
    }
    
    // Re-fetch settings after potential update
    const currentSettings = useAppStore.getState().settings;
    updateGradientPreview(type);

    // Create container for color stops and add button
    const stopsOuterContainer = document.createElement('div');
    stopsOuterContainer.className = 'flex items-center gap-2 mb-2 flex-wrap';

    const stopsContainer = document.createElement('div');
    stopsContainer.id = `${type}GradientStopsContainer`;
    stopsContainer.className = 'flex flex-wrap items-center gap-1';

    currentSettings[stopsKey].forEach((color, idx) => {
        const stopGroup = document.createElement('div');
        stopGroup.className = 'gradient-stop-group flex items-center';

        const input = document.createElement('input');
        input.type = 'color';
        input.value = color || defaultColors[type];
        input.className = 'dynamic-color-picker w-8 h-8 p-0 border border-[var(--overlay0)]';
        input.addEventListener('input', debounce(() => {
            const newStops = [...useAppStore.getState().settings[stopsKey]];
            newStops[idx] = input.value;
            updateSettings({ [stopsKey]: newStops });
            updateGradientPreview(type);
            drawFolderIcon();
        }, 150));
        stopGroup.appendChild(input);

        if (currentSettings[stopsKey].length > 1) {
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✖';
            removeBtn.className = 'ml-1 text-xs text-[var(--red)] hover:text-[var(--flamingo)] gradient-action-button !bg-transparent !border-0 !p-0 transition-colors';
            removeBtn.title = 'Remove Color Stop';
            removeBtn.onclick = () => {
                const currentStops = [...useAppStore.getState().settings[stopsKey]];
                currentStops.splice(idx, 1);
                if (currentStops.length === 1 && !currentStops[0]) {
                    currentStops[0] = defaultColors[type];
                }
                updateSettings({ [stopsKey]: currentStops });
                renderGradientStopsUI(type);
                drawFolderIcon();
            };
            stopGroup.appendChild(removeBtn);
        }
        stopsContainer.appendChild(stopGroup);
    });
    stopsOuterContainer.appendChild(stopsContainer);

    const addBtn = document.createElement('button'); 
    addBtn.id = `add${type.charAt(0).toUpperCase() + type.slice(1)}GradientStopButton`;
    addBtn.className = 'gradient-action-button text-sm p-1';
    addBtn.textContent = '➕';
    addBtn.title = 'Add Color Stop';
    addBtn.onclick = () => {
        const currentStops = useAppStore.getState().settings[stopsKey];
        const lastColor = currentStops.length > 0 ? currentStops[currentStops.length - 1] : defaultColors[type];
        updateSettings({ [stopsKey]: [...currentStops, lastColor] });
        renderGradientStopsUI(type);
        drawFolderIcon();
    };
    stopsOuterContainer.appendChild(addBtn);
    dynamicControlsContainer.appendChild(stopsOuterContainer);
}
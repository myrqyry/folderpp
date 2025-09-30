// Gradient controls and rendering
import { settings } from './state.ts';
import { drawFolderIcon } from './dom.ts';
import { saveSettings, debounce } from './utils.ts';

// Function to update the gradient preview display
export function updateGradientPreview(type) {
    const stopsKey = `${type}GradientStops`;
    const angleKey = `${type}GradientAngle`;
    const previewEl = document.getElementById(`${type}GradientPreview`);
    
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

export function renderGradientStopsUI(type) {
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
        angleSlider.value = settings[angleKey];
        document.getElementById(`${type}GradientAngleValue`).textContent = settings[angleKey] + '°';
        
        // Make sure the event listeners are attached
        angleSlider.addEventListener('input', () => {
            document.getElementById(`${type}GradientAngleValue`)!.textContent = angleSlider.value + '°';
            settings[angleKey] = parseInt(angleSlider.value);
            updateGradientPreview(type); // Update preview immediately
            saveSettings();
            drawFolderIcon();
        });
    }
    
    if (spreadSlider) {
        spreadSlider.value = settings[spreadKey] || 100;
        document.getElementById(`${type}GradientSpreadValue`)!.textContent = (settings[spreadKey] || 100) + '%';
        
        spreadSlider.addEventListener('input', () => {
            document.getElementById(`${type}GradientSpreadValue`)!.textContent = spreadSlider.value + '%';
            settings[spreadKey] = parseInt(spreadSlider.value);
            saveSettings();
            drawFolderIcon();
        });
    }
    
    if (offsetYSlider) {
        offsetYSlider.value = settings[offsetKey] || 0;
        document.getElementById(`${type}GradientOffsetYValue`)!.textContent = (settings[offsetKey] || 0) + 'px';
        
        offsetYSlider.addEventListener('input', () => {
            document.getElementById(`${type}GradientOffsetYValue`)!.textContent = offsetYSlider.value + 'px';
            settings[offsetKey] = parseInt(offsetYSlider.value);
            saveSettings();
            drawFolderIcon();
        });
    }

    // Clear previous dynamic controls except the H3 title (if any) and main label
    let dynamicControlsContainer = document.getElementById(`${type}GradientDynamicControls`);
    if (dynamicControlsContainer) {
        dynamicControlsContainer.innerHTML = ''; // Clear previous dynamic parts
    } else {
        dynamicControlsContainer = document.createElement('div');
        dynamicControlsContainer.id = `${type}GradientDynamicControls`;
        sectionContainer.appendChild(dynamicControlsContainer);
    }

    // Ensure there's always at least one stop
    if (!settings[stopsKey] || settings[stopsKey].length === 0) {
        settings[stopsKey] = [defaultColors[type]];
    } else if (settings[stopsKey].length === 1 && !settings[stopsKey][0]) {
         settings[stopsKey][0] = defaultColors[type]; // Ensure the single stop has a valid color if it was somehow cleared
    }
    
    // Update the gradient preview
    updateGradientPreview(type);

    // Create container for color stops and add button
    const stopsOuterContainer = document.createElement('div');
    stopsOuterContainer.className = 'flex items-center gap-2 mb-2 flex-wrap'; // Added flex-wrap

    const stopsContainer = document.createElement('div');
    stopsContainer.id = `${type}GradientStopsContainer`;
    stopsContainer.className = 'flex flex-wrap items-center gap-1';

    settings[stopsKey].forEach((color, idx) => {
        const stopGroup = document.createElement('div');
        stopGroup.className = 'gradient-stop-group flex items-center'; // Added flex and items-center

        const input = document.createElement('input');
        input.type = 'color';
        input.value = color || defaultColors[type]; // Fallback if color is undefined
        input.className = 'dynamic-color-picker w-8 h-8 p-0 border border-[var(--overlay0)]'; // Adjusted class for consistency
        input.addEventListener('input', debounce(() => { // Added debounce
            settings[stopsKey][idx] = input.value;
            updateGradientPreview(type); // Update preview immediately
            saveSettings(); // in utils.js
            drawFolderIcon(); // in dom.js
        }, 150));
        stopGroup.appendChild(input);

        if (settings[stopsKey].length > 1) { // Only allow removing if more than one stop
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✖';
            removeBtn.className = 'ml-1 text-xs text-[var(--red)] hover:text-[var(--flamingo)] gradient-action-button !bg-transparent !border-0 !p-0 transition-colors';
            removeBtn.title = 'Remove Color Stop';
            removeBtn.onclick = () => {
                settings[stopsKey].splice(idx, 1);
                if (settings[stopsKey].length === 1 && !settings[stopsKey][0]) {
                    settings[stopsKey][0] = defaultColors[type];
                }
                saveSettings(); // in utils.js
                renderGradientStopsUI(type); // Re-render this section
                drawFolderIcon(); // in dom.js
            };
            stopGroup.appendChild(removeBtn);
        }
        stopsContainer.appendChild(stopGroup);
    });
    stopsOuterContainer.appendChild(stopsContainer);

    const addBtn = document.createElement('button'); 
    addBtn.id = `add${type.charAt(0).toUpperCase() + type.slice(1)}GradientStopButton`;
    addBtn.className = 'gradient-action-button text-sm p-1'; // Adjusted class
    addBtn.textContent = '➕';
    addBtn.title = 'Add Color Stop';
    addBtn.onclick = () => {
        const lastColor = settings[stopsKey].length > 0 ? settings[stopsKey][settings[stopsKey].length - 1] : defaultColors[type];
        settings[stopsKey].push(lastColor);
        saveSettings(); // in utils.js
        renderGradientStopsUI(type);
        drawFolderIcon(); // in dom.js
    };
    stopsOuterContainer.appendChild(addBtn);
    dynamicControlsContainer.appendChild(stopsOuterContainer);
    
    // We no longer need to create gradient control sliders here since they exist in the HTML
}

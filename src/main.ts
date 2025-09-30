// Core application logic and state
import { loadSettings } from './lib/utils';
import { drawFolderIcon, updateControlsFromState } from './lib/drawing';
import { updateCustomPresetsUI } from './lib/presets';
import { renderGradientStopsUI } from './lib/gradients';
import { initShadowToggle } from './lib/shadow';
import { setupHarmonyControls } from './lib/harmony';
import { setupGeminiApiControls } from './lib/gemini-api';
import { setupDebugConsole } from './lib/debug-console';

// Event handling modules
import { setupFileHandling } from './lib/events/file-handlers';
import { setupKeyboardShortcuts } from './lib/events/keyboard-shortcuts';
import {
    initCollapsibleMenus,
    setupMaterialRipple,
    setupControlListeners,
    setupPresetListeners,
    setupEnhancedFeatures,
    updateCanvasSize,
    enhanceAccessibility
} from './lib/events/ui-interactions';

// Main application setup
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded: Initializing application...');

    // Initial setup functions
    loadSettings();
    updateControlsFromState();
    updateCustomPresetsUI();
    ['front', 'back', 'border'].forEach(renderGradientStopsUI);
    initShadowToggle();
    setupHarmonyControls();
    setupGeminiApiControls();
    setupDebugConsole();

    // Setup event listeners
    setupFileHandling();
    setupControlListeners();
    setupPresetListeners();
    setupEnhancedFeatures();
    setupKeyboardShortcuts();
    initCollapsibleMenus();
    setupMaterialRipple();

    // Initial drawing and responsive setup
    drawFolderIcon();
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Accessibility enhancements
    enhanceAccessibility();

    console.log('✅ Application initialized successfully.');
});
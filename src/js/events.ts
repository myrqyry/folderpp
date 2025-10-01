// Constants for magic numbers and default values
const DEFAULT_CANVAS_SIZES = {
    small: { width: 240, height: 210 },
    medium: { width: 280, height: 245 },
    large: { width: 400, height: 320 },
    default: { width: 320, height: 280 }
};

const BREAKPOINTS = {
    small: 640,
    medium: 1279,
    large: 1280
};

const DEFAULT_SETTINGS = {
    borderWidth: 3,
    cornerRadius: 20,
    taperAmount: 15,
    frontPartOffsetY: 8,
    dynamicTabWidth: 180,
    dynamicTabOffset: 25,
    frontGradientStops: ['#45475a', '#585b70'],
    frontGradientAngle: 135,
    backGradientStops: ['#313244', '#45475a'],
    backGradientAngle: 315,
    borderGradientStops: ['#cba6f7'],
    borderGradientAngle: 0,
    highlightStrength: 0.3,
    currentImageOpacity: 0.8,
    imageFit: 'cover',
    currentBlendMode: 'soft-light',
    dropShadowEnabled: false,
    shadowColor: '#000000',
    shadowBlur: 10,
    shadowOffsetX: 2,
    shadowOffsetY: 4,
    shadowOpacity: 0.3
};

const ICO_SIZE = 256;
const DEFAULT_DOWNLOAD_SIZE = 512;
const SUPER_SCALE_FACTOR = 2;
const RIPPLE_DURATION = 0.44;
const COLLAPSE_DURATION = 0.32;
const EXPAND_DURATION = 0.44;
const MAX_COLLAPSIBLE_ATTEMPTS = 5;
const ATTEMPT_DELAY = 500;

// Development mode flag - set to false for production
const IS_DEVELOPMENT = true;

// Logging utility
const logger = {
    log: (...args) => IS_DEVELOPMENT && console.log(...args),
    error: (...args) => console.error(...args), // Always log errors
    warn: (...args) => IS_DEVELOPMENT && console.warn(...args)
};

// Undo/Redo functionality
let settingsHistory = [];
let currentHistoryIndex = -1;
const MAX_HISTORY_SIZE = 50;

function saveToHistory() {
    const currentState = JSON.stringify(settings);
    // Remove any history after current index (for when we undo then make new changes)
    settingsHistory = settingsHistory.slice(0, currentHistoryIndex + 1);
    // Add new state
    settingsHistory.push(currentState);
    currentHistoryIndex++;
    // Limit history size
    if (settingsHistory.length > MAX_HISTORY_SIZE) {
        settingsHistory.shift();
        currentHistoryIndex--;
    }
    logger.log(`📝 Saved state to history (index: ${currentHistoryIndex})`);
}

function undo() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousState = JSON.parse(settingsHistory[currentHistoryIndex]);
        Object.assign(settings, previousState);
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('↶ Undid last change', 'info');
        logger.log(`↶ Undid to history index: ${currentHistoryIndex}`);
    } else {
        setMessage('❌ Nothing to undo', 'warning');
    }
}

function redo() {
    if (currentHistoryIndex < settingsHistory.length - 1) {
        currentHistoryIndex++;
        const nextState = JSON.parse(settingsHistory[currentHistoryIndex]);
        Object.assign(settings, nextState);
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('↷ Redid last change', 'info');
        logger.log(`↷ Redid to history index: ${currentHistoryIndex}`);
    } else {
        setMessage('❌ Nothing to redo', 'warning');
    }
}

// Initialize history with default state
saveToHistory();

// All interactive buttons and collapsible panels now have GSAP-powered Material 3 expressive animations and ripple effects.
// No markup changes needed for most buttons, as ripple is JS/CSS driven. Collapsible panels are now fully animated and accessible.
// Event handlers and listeners
import { updateControlsFromState, drawFolderIcon, debouncedDrawFolderIcon, showCanvas, hideCanvas, handleFile, canvas, canvasPlaceholder, canvasOverlay, downloadButton, dropZone, imageInput, fileNameDisplay, resetLoadedImage, resetTransformValues, animateCanvasIn, animateMessageArea } from './dom.js';
import { settings, loadedImage, loadedImageBase64 } from './state.ts';
import { renderGradientStopsUI, updateGradientPreview } from './gradients.js';
import { renderShadowControls } from './shadow.js';
import { updateCustomPresetsUI, loadPreset, saveCurrentAsPreset } from './presets.js';
import { loadSettings, saveSettings, copyToClipboard, debounce, setMessage } from './utils.js';
import { setupHarmonyControls } from './harmony.js';
import { setupGeminiApiControls, suggestColorsFromImage, isGeminiApiKeyConfigured } from './gemini-api.js';

// Setup shadow toggle functionality
function setupShadowToggle() {
    try {
        logger.log('🔧 Setting up shadow toggle...');

        const toggle = document.getElementById('shadowToggle');
        if (!toggle) {
            logger.error('❌ Shadow toggle element not found!');
            return;
        }

        // Set initial state
        toggle.checked = settings.dropShadowEnabled;

        // Helper to update state
        function setShadowEnabled(val) {
            try {
                settings.dropShadowEnabled = val;
                toggle.checked = val;
                saveSettings();
                renderShadowControls();
                drawFolderIcon();
                logger.log(`🔔 Shadow ${val ? 'enabled' : 'disabled'}`);
            } catch (error) {
                logger.error('Error updating shadow settings:', error);
                setMessage('❌ Failed to update shadow settings.', 'error');
            }
        }

        // Add event listener
        toggle.addEventListener('change', () => {
            setShadowEnabled(toggle.checked);
        });

        logger.log('✅ Shadow toggle setup complete');
    } catch (error) {
        logger.error('Error setting up shadow toggle:', error);
        setMessage('❌ Failed to initialize shadow controls.', 'error');
    }
}

/**
 * Sets up event listeners for gradient control sliders (angle, spread, offset) for front, back, and border gradients.
 * Updates the UI values, settings, and triggers preview updates and icon redraws.
 */
export function setupGradientControls() {
    try {
        logger.log('🔧 Setting up gradient control listeners...');

        // Setup gradient angle, spread and offset sliders for each gradient section
        ['front', 'back', 'border'].forEach(type => {
            try {
                const angleSlider = document.getElementById(`${type}GradientAngle`);
                const spreadSlider = document.getElementById(`${type}GradientSpread`);
                const offsetSlider = document.getElementById(`${type}GradientOffsetY`);

                if (angleSlider) {
                    angleSlider.addEventListener('input', () => {
                        try {
                            document.getElementById(`${type}GradientAngleValue`).textContent = angleSlider.value + '°';
                            settings[`${type}GradientAngle`] = parseInt(angleSlider.value);
                            updateGradientPreview(type); // Update preview immediately
                            saveSettings();
                            debouncedDrawFolderIcon();
                        } catch (error) {
                            console.error(`Error updating ${type} gradient angle:`, error);
                        }
                    });
                }

                if (spreadSlider) {
                    spreadSlider.addEventListener('input', () => {
                        try {
                            document.getElementById(`${type}GradientSpreadValue`).textContent = spreadSlider.value + '%';
                            settings[`${type}GradientSpread`] = parseInt(spreadSlider.value);
                            updateGradientPreview(type); // Update preview immediately
                            saveSettings();
                            debouncedDrawFolderIcon();
                        } catch (error) {
                            console.error(`Error updating ${type} gradient spread:`, error);
                        }
                    });
                }

                if (offsetSlider) {
                    offsetSlider.addEventListener('input', () => {
                        try {
                            document.getElementById(`${type}GradientOffsetYValue`).textContent = offsetSlider.value + 'px';
                            settings[`${type}GradientOffsetY`] = parseInt(offsetSlider.value);
                            updateGradientPreview(type); // Update preview immediately
                            saveSettings();
                            debouncedDrawFolderIcon();
                        } catch (error) {
                            console.error(`Error updating ${type} gradient offset:`, error);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error setting up ${type} gradient controls:`, error);
            }
        });

        // Initialize all gradient previews
        setupGradientPreviews();

        logger.log('✅ Gradient control listeners setup complete');
    } catch (error) {
        console.error('Error setting up gradient controls:', error);
        setMessage('❌ Failed to initialize gradient controls.', 'error');
    }
}

// Function to initialize all gradient previews
function setupGradientPreviews() {
    logger.log('🔧 Setting up gradient previews...');
    ['front', 'back', 'border'].forEach(type => {
        updateGradientPreview(type);
    });
    logger.log('✅ Gradient previews setup complete');
}

import { gsap } from 'gsap';

function animateExpandCollapse(content, expand) {
    // Animate height and opacity for expressive Material 3 feel
    if (expand) {
        content.style.display = 'block';
        const fullHeight = content.scrollHeight;
        gsap.fromTo(content, {
            height: 0,
            opacity: 0.5,
            boxShadow: '0 0 0 0 rgba(0,0,0,0)'
        }, {
            height: fullHeight,
            opacity: 1,
            boxShadow: '0 4px 24px 0 rgba(137,180,250,0.10)',
            duration: EXPAND_DURATION,
            ease: 'power2.out',
            onComplete: () => {
                content.style.height = 'auto';
                content.classList.add('expanded');
            }
        });
    } else {
        content.classList.remove('expanded');
        gsap.to(content, {
            height: 0,
            opacity: 0.5,
            boxShadow: '0 0 0 0 rgba(0,0,0,0)',
            duration: COLLAPSE_DURATION,
            ease: 'power1.in',
            onComplete: () => {
                content.style.display = 'none';
            }
        });
    }
}

function initCollapsibleMenus() {
    logger.log('🔧 Initializing collapsible menus...');
    let attempts = 0;
    const maxAttempts = MAX_COLLAPSIBLE_ATTEMPTS;
    function attemptInit() {
        attempts++;
        const collapsibles = document.querySelectorAll('.collapsible');
        if (collapsibles.length === 0) {
            if (attempts < maxAttempts) {
                setTimeout(attemptInit, ATTEMPT_DELAY);
                return;
            } else {
                logger.error('❌ Failed to find collapsible elements after all attempts!');
                return;
            }
        }
        collapsibles.forEach((coll, index) => {
            // Set ARIA attributes for accessibility
            coll.setAttribute('role', 'button');
            coll.setAttribute('tabindex', '0');
            coll.setAttribute('aria-expanded', 'false');
            const content = coll.nextElementSibling;
            if (content && !content._collapsibleInit) {
                content.setAttribute('aria-hidden', 'true');
                content.style.overflow = 'hidden';
                content.style.display = 'none';
                content.style.height = '0';
                content._collapsibleInit = true;
            }
            coll.addEventListener('click', function(e) {
                if (e.target.closest('.ripple')) return; // Don't trigger on ripple
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                this.setAttribute('aria-expanded', isActive);
                if (content) {
                    content.setAttribute('aria-hidden', !isActive);
                    logger.log('Collapsible click:', {isActive, content, index});
                    animateExpandCollapse(content, isActive);
                }
            });
            // Keyboard accessibility
            coll.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        // Optionally open the first panel by default for demo
        if (collapsibles.length > 0) {
            const first = collapsibles[0];
            const content = first.nextElementSibling;
            first.classList.add('active');
            first.setAttribute('aria-expanded', 'true');
            if (content) {
                content.setAttribute('aria-hidden', 'false');
                content.style.display = 'block';
                content.style.height = 'auto';
                content.classList.add('expanded');
            }
        }
        logger.log('✅ Collapsible menu initialization complete!');
    }
    attemptInit();
}

// --- Material 3 Ripple Effect for Buttons ---
function createRipple(e) {
    const button = e.currentTarget;
    let ripple = button.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        button.appendChild(ripple);
    }
    ripple.style.display = 'block';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    ripple.style.opacity = '1';
    ripple.style.pointerEvents = 'none';
    gsap.fromTo(ripple, {
        scale: 0.2,
        opacity: 0.32
    }, {
        scale: 1.1,
        opacity: 0.18,
        duration: RIPPLE_DURATION,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(ripple, {
                opacity: 0,
                duration: COLLAPSE_DURATION,
                onComplete: () => {
                    ripple.style.display = 'none';
                }
            });
        }
    });
}

function setupMaterialRipple() {
    // All interactive buttons
    const selectors = [
        '.action-button', '.preset-button', '.gemini-button', '.collapsible',
        'button:not([disabled]):not(.no-ripple)'
    ];
    const buttons = document.querySelectorAll(selectors.join(','));
    buttons.forEach(btn => {
        // Prevent duplicate listeners
        if (!btn._rippleBound) {
            btn.addEventListener('pointerdown', createRipple);
            btn._rippleBound = true;
        }
    });
}



// --- Move all event listeners from script.js here ---

/**
 * Sets up event listeners for file input and drag-and-drop functionality.
 * Handles file selection, drag events, and updates the UI accordingly.
 */
export function setupFileHandling() {
    if (imageInput) {
        imageInput.addEventListener('change', (event) => {
            setMessage('');
            resetLoadedImage();
            downloadButton.disabled = true;
            hideCanvas();
            const file = event.target.files[0];
            if (file) {
                handleFile(file);
                // Update AI Colors button state after image processing
                setTimeout(() => updateAIColorsButtonState(), 100);
            } else {
                fileNameDisplay.textContent = 'No file chosen';
                updateAIColorsButtonState();
            }
        });
    }

    if (dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('dragover');
                if (canvasOverlay && !canvas.classList.contains('hidden')) {
                    canvasOverlay.style.opacity = '1';
                }
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('dragover');
                if (canvasOverlay) {
                    canvasOverlay.style.opacity = '0';
                }
            }, false);
        });
        dropZone.addEventListener('drop', (event) => {
            setMessage('');
            resetLoadedImage();
            downloadButton.disabled = true;
            hideCanvas();
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
                // Update AI Colors button state after image processing
                setTimeout(() => updateAIColorsButtonState(), 100);
                try {
                    imageInput.files = files;
                } catch(e) {
                    console.warn("Could not set input files property directly for drag and drop.");
                }
            } else {
                fileNameDisplay.textContent = 'No file chosen';
                updateAIColorsButtonState();
            }
        }, false);
        dropZone.addEventListener('click', (e) => {
            if (e.target !== imageInput && !e.target.closest('button')) {
                imageInput.click();
            }
        });
    }
}

// Generic Control Listeners for non-color controls
function setupSimpleSliderListener(sliderId, valueDisplayId, settingKey, isPercent = false) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueDisplayId);
    if (slider && valueDisplay) {
        const debouncedUpdate = debounce(() => {
            valueDisplay.textContent = slider.value;
            settings[settingKey] = isPercent ? parseInt(slider.value) / 100 : parseInt(slider.value);
            saveSettings();
            debouncedDrawFolderIcon();
        }, 100); // 100ms debounce

        slider.addEventListener('input', debouncedUpdate);
    }
}

/**
 * Sets up event listeners for various control sliders and selects (shape, image, effects, shadow).
 * Updates settings and triggers icon redraws on input changes.
 */
export function setupControlListeners() {
    // Shape controls
    setupSimpleSliderListener('strokeWidthSlider', 'strokeWidthValue', 'borderWidth');
    setupSimpleSliderListener('cornerRadiusSlider', 'cornerRadiusValue', 'cornerRadius');
    setupSimpleSliderListener('taperAmountSlider', 'taperAmountValue', 'taperAmount');
    setupSimpleSliderListener('frontOffsetYSlider', 'frontOffsetYValue', 'frontPartOffsetY');
    setupSimpleSliderListener('tabWidthSlider', 'tabWidthValue', 'dynamicTabWidth');
    setupSimpleSliderListener('tabOffsetSlider', 'tabOffsetValue', 'dynamicTabOffset');

    // Image & Effects controls
    setupSimpleSliderListener('imageOpacitySlider', 'imageOpacityValue', 'currentImageOpacity', true);
    setupSimpleSliderListener('highlightStrengthSlider', 'highlightStrengthValue', 'highlightStrength', true);

    // Image Adjustment controls (blur, brightness, contrast, saturation)
    setupSimpleSliderListener('imageBlurSlider', 'imageBlurValue', 'imageBlur');
    setupSimpleSliderListener('imageBrightnessSlider', 'imageBrightnessValue', 'imageBrightness');
    setupSimpleSliderListener('imageContrastSlider', 'imageContrastValue', 'imageContrast');
    setupSimpleSliderListener('imageSaturationSlider', 'imageSaturationValue', 'imageSaturation');

    // Image Transform Controls
    setupSimpleSliderListener('imageScaleXSlider', 'imageScaleXValue', 'imageScaleX');
    setupSimpleSliderListener('imageScaleYSlider', 'imageScaleYValue', 'imageScaleY');
    setupSimpleSliderListener('imageOffsetXSlider', 'imageOffsetXValue', 'imageOffsetX');
    setupSimpleSliderListener('imageOffsetYSlider', 'imageOffsetYValue', 'imageOffsetY');
    setupSimpleSliderListener('imageSkewXSlider', 'imageSkewXValue', 'imageSkewX');
    setupSimpleSliderListener('imageSkewYSlider', 'imageSkewYValue', 'imageSkewY');
    setupSimpleSliderListener('imageSkewZSlider', 'imageSkewZValue', 'imageSkewZ');
    setupSimpleSliderListener('imageRotationSlider', 'imageRotationValue', 'imageRotation');

    // Shadow controls
    setupSimpleSliderListener('shadowBlurSlider', 'shadowBlurValue', 'shadowBlur');
    setupSimpleSliderListener('shadowOffsetXSlider', 'shadowOffsetXValue', 'shadowOffsetX');
    setupSimpleSliderListener('shadowOffsetYSlider', 'shadowOffsetYValue', 'shadowOffsetY');
    setupSimpleSliderListener('shadowOpacitySlider', 'shadowOpacityValue', 'shadowOpacity', true);

    // Select and checkbox controls
    const imageFitSelect = document.getElementById('imageFitSelect');
    const blendModeSelect = document.getElementById('blendModeSelect');
    const shadowColorPicker = document.getElementById('shadowColorPicker');

    [imageFitSelect, blendModeSelect, shadowColorPicker].forEach(el => {
        if(el) {
            const eventType = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
            el.addEventListener(eventType, () => {
                if (el.id === 'imageFitSelect') settings.imageFit = el.value;
                else if (el.id === 'blendModeSelect') settings.currentBlendMode = el.value;
                else if (el.id === 'shadowColorPicker') settings.shadowColor = el.value;
                saveSettings();
                drawFolderIcon();
            });
        }
    });
}

/**
 * Sets up event listeners for preset selection, loading, and saving functionality.
 * Enables/disables buttons based on selection state.
 */
export function setupPresetListeners() {
    const presetSelect = document.getElementById('presetSelect');
    const loadPresetButton = document.getElementById('loadPresetButton');
    const savePresetButton = document.getElementById('savePresetButton');

    if (presetSelect) {
        presetSelect.addEventListener('change', () => {
            if (loadPresetButton) {
                loadPresetButton.disabled = !presetSelect.value;
            }
        });
    }

    if (loadPresetButton) {
        loadPresetButton.addEventListener('click', () => {
            if (presetSelect && presetSelect.value) {
                loadPreset(presetSelect.value);
            } else {
                setMessage('Please select a preset to load.', 'default');
            }
        });
    }

    if (savePresetButton) {
        savePresetButton.addEventListener('click', () => {
            saveCurrentAsPreset();
        });
    }
}

/**
 * Sets up event listeners for enhanced features like randomize colors, AI suggestions, reset, copy/paste settings.
 * Includes animation triggers for message area.
 */
export function setupEnhancedFeatures() {
    // Enhanced Features Event Listeners
    const randomizeColorsBtn = document.getElementById('randomizeColorsBtn');
    const suggestColorsBtn = document.getElementById('suggestColorsFromImageButton');
    const resetToDefaultBtn = document.getElementById('resetToDefaultBtn');
    const copySettingsBtn = document.getElementById('copySettingsBtn');
    const pasteSettingsBtn = document.getElementById('pasteSettingsBtn');
    const resetTransformBtn = document.getElementById('resetTransformBtn');


    if (randomizeColorsBtn) randomizeColorsBtn.addEventListener('click', () => { randomizeColors(); animateMessageArea(); });
    if (suggestColorsBtn) suggestColorsBtn.addEventListener('click', async () => { await suggestColorsFromImageButton(); animateMessageArea(); });
    if (resetToDefaultBtn) resetToDefaultBtn.addEventListener('click', () => { resetToDefault(); animateMessageArea(); });
    if (copySettingsBtn) copySettingsBtn.addEventListener('click', () => { copySettings(); animateMessageArea(); });
    if (pasteSettingsBtn) pasteSettingsBtn.addEventListener('click', async () => { await pasteSettings(); animateMessageArea(); });
    if (resetTransformBtn) resetTransformBtn.addEventListener('click', resetTransformValues);
    if (downloadButton) downloadButton.addEventListener('click', () => { downloadIcon(); animateMessageArea(); });

    updateAIColorsButtonState();
}

// Quick Actions Functions
function randomizeColors() {
    saveToHistory();
    const generateRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    settings.frontGradientStops = [generateRandomColor(), generateRandomColor()];
    settings.backGradientStops = [generateRandomColor(), generateRandomColor()];
    settings.borderGradientStops = [generateRandomColor(), generateRandomColor()];
    updateControlsFromState();
    ['front', 'back', 'border'].forEach(renderGradientStopsUI);
    drawFolderIcon();
    setMessage('🎨 Colors randomized!', 'success');
}

async function suggestColorsFromImageButton() {
    try {
        // Check if API key is configured
        if (!isGeminiApiKeyConfigured()) {
            setMessage('❌ Please configure your Gemini API key in the Advanced section first.', 'error');
            return;
        }

        // Check if image is loaded
        if (!loadedImageBase64) {
            setMessage('❌ Please load an image first to get AI color suggestions.', 'error');
            return;
        }

        // Show loading state
        const button = document.getElementById('suggestColorsFromImageButton');
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span class="relative z-10">🔄 Analyzing...</span>';

        setMessage('🤖 AI is analyzing your image for color suggestions...', 'info');

        // Get color suggestions from Gemini API
        const imageData = `data:image/jpeg;base64,${loadedImageBase64}`;
        const suggestedColors = await suggestColorsFromImage(imageData);

        if (suggestedColors && suggestedColors.length >= 4) {
            // Apply the suggested colors to gradients
            // Use first 2 colors for front gradient
            settings.frontGradientStops = [suggestedColors[0], suggestedColors[1]];

            // Use next 2 colors for back gradient
            settings.backGradientStops = [suggestedColors[2], suggestedColors[3]];

            // Use the most vibrant color for border (or first color if only 4 total)
            settings.borderGradientStops = [suggestedColors[4] || suggestedColors[0]];

            // Update UI and redraw
            updateControlsFromState();
            ['front', 'back', 'border'].forEach(renderGradientStopsUI);
            drawFolderIcon();

            setMessage(`✨ Applied ${suggestedColors.length} AI-suggested colors to your folder icon!`, 'success');
        } else {
            setMessage('⚠️ AI returned fewer colors than expected. Please try again.', 'warning');
        }

    } catch (error) {
        console.error('Error getting AI color suggestions:', error);
        let errorMessage = '❌ Failed to get AI color suggestions: ';

        if (error.message.includes('API key')) {
            errorMessage += 'Please check your API key configuration.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            errorMessage += 'API quota exceeded. Please try again later.';
        } else if (error.message.includes('Invalid response')) {
            errorMessage += 'AI returned unexpected format. Please try again.';
        } else {
            errorMessage += error.message || 'Unknown error occurred.';
        }

        setMessage(errorMessage, 'error');
    } finally {
        // Restore button state
        const button = document.getElementById('suggestColorsFromImageButton');
        button.disabled = false;
        button.innerHTML = '<span class="relative z-10">✨ AI Colors</span>';
    }
}

function resetToDefault() {
    if (confirm('Reset all settings to default? This will clear your current configuration.')) {
        // Reset to defaults
        Object.assign(settings, DEFAULT_SETTINGS);
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('🔄 Reset to defaults!', 'success');
    }
}

function copySettings() {
    try {
        const settingsJSON = JSON.stringify(settings, null, 2);
        copyToClipboard(settingsJSON);
    } catch (error) {
        setMessage('❌ Failed to copy settings.', 'error');
    }
}

async function pasteSettings() {
    try {
        const text = await navigator.clipboard.readText();
        const newSettings = JSON.parse(text);
        Object.assign(settings, newSettings);
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('📋 Settings pasted!', 'success');
    } catch (error) {
        setMessage('❌ Invalid settings data in clipboard.', 'error');
    }
}

/**
 * Updates the AI Colors button state based on image availability and API key configuration.
 * Disables button and sets appropriate tooltips when requirements aren't met.
 */
export function updateAIColorsButtonState() {
    const suggestColorsBtn = document.getElementById('suggestColorsFromImageButton');
    if (!suggestColorsBtn) return;

    const hasImage = !!loadedImageBase64;
    const hasApiKey = isGeminiApiKeyConfigured();

    if (hasImage && hasApiKey) {
        suggestColorsBtn.disabled = false;
        suggestColorsBtn.title = 'Get AI-powered color suggestions from your image';
    } else if (!hasImage && !hasApiKey) {
        suggestColorsBtn.disabled = true;
        suggestColorsBtn.title = 'Load an image and configure Gemini API key to enable AI color suggestions';
    } else if (!hasImage) {
        suggestColorsBtn.disabled = true;
        suggestColorsBtn.title = 'Load an image to enable AI color suggestions';
    } else if (!hasApiKey) {
        suggestColorsBtn.disabled = true;
        suggestColorsBtn.title = 'Configure Gemini API key in Advanced section to enable AI color suggestions';
    }
}

// Listen for Gemini API key changes to update button state
window.addEventListener('geminiApiKeyChanged', updateAIColorsButtonState);

/**
 * Sets up keyboard shortcuts for common actions like save, download, randomize, reset, copy/paste.
 * Also supports number keys for quick preset loading.
 */
export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only trigger if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveCurrentAsPreset();
                    break;
                case 'd':
                    e.preventDefault();
                    // Enhanced export would need to be implemented
                    if (downloadButton && !downloadButton.disabled) {
                        downloadButton.click();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    // Trigger randomize colors
                    const randomizeBtn = document.getElementById('randomizeColorsBtn');
                    if (randomizeBtn) randomizeBtn.click();
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        redo();
                    } else {
                        e.preventDefault();
                        undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    redo();
                    break;
                case 'c':
                    e.preventDefault();
                    // Trigger copy settings
                    const copyBtn = document.getElementById('copySettingsBtn');
                    if (copyBtn) copyBtn.click();
                    break;
                case 'v':
                    e.preventDefault();
                    // Trigger paste settings
                    const pasteBtn = document.getElementById('pasteSettingsBtn');
                    if (pasteBtn) pasteBtn.click();
                    break;
            }
        }

        // Number keys for quick presets
        if (e.key >= '1' && e.key <= '9') {
            const presetIndex = parseInt(e.key) - 1;
            const presetSelect = document.getElementById('presetSelect');
            if (presetSelect && presetSelect.options[presetIndex + 1]) { // +1 to skip the first "Select preset" option
                presetSelect.selectedIndex = presetIndex + 1;
                loadPreset(presetSelect.value);
            }
        }
    });
}

// Update canvas size based on screen size
function updateCanvasSize() {
    const canvas = document.getElementById('outputCanvas');
    const placeholder = document.getElementById('canvasPlaceholder');
    const overlay = document.getElementById('canvasOverlay');

    if (!canvas || !placeholder) return;

    let width, height;
    if (window.innerWidth <= BREAKPOINTS.small) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.small);
    } else if (window.innerWidth <= BREAKPOINTS.medium) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.medium);
    } else if (window.innerWidth >= BREAKPOINTS.large) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.large);
    } else {
        ({ width, height } = DEFAULT_CANVAS_SIZES.default);
    }

    // Update canvas size
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);

    // Update CSS sizing
    canvas.style.width = `${Math.floor(width)}px`;
    canvas.style.height = `${Math.floor(height)}px`;
    placeholder.style.width = `${Math.floor(width)}px`;
    placeholder.style.height = `${Math.floor(height)}px`;
    if (overlay) {
        overlay.style.width = `${Math.floor(width)}px`;
        overlay.style.height = `${Math.floor(height)}px`;
    }

    // Redraw if canvas is visible and has content
    if (!canvas.classList.contains('hidden') && loadedImage) {
        debouncedDrawFolderIcon();
    }
}

// Enhanced accessibility features
function enhanceAccessibility() {
    // Add ARIA labels to controls
    const controls = document.querySelectorAll('input, button, select');
    controls.forEach(control => {
        if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
            const label = control.previousElementSibling?.textContent ||
                         control.parentElement?.textContent ||
                         control.title ||
                         control.placeholder;
            if (label) {
                control.setAttribute('aria-label', label.trim());
            }
        }
    });

    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
        input:focus, button:focus, select:focus {
            outline: 2px solid var(--blue) !important;
            outline-offset: 2px !important;
        }

        .collapsible:focus {
            background-color: var(--surface2) !important;
        }
    `;
    document.head.appendChild(style);
}

// Download function to handle icon download
function downloadIcon() {
    animateCanvasIn();
    const downloadSize = document.getElementById('downloadSize');
    const downloadFormat = document.getElementById('downloadFormat');
    const downloadLink = document.getElementById('downloadLink');
    const canvas = document.getElementById('outputCanvas');
    if (!canvas || !downloadLink) {
        setMessage('❌ No icon to download. Please generate an icon first.', 'error');
        return;
    }
    // Check if canvas has content
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some(pixel => pixel !== 0);
    if (!hasContent) {
        setMessage('❌ No icon to download. Please generate an icon first.', 'error');
        return;
    }
    try {
        const baseSize = parseInt(downloadSize?.value || DEFAULT_DOWNLOAD_SIZE);
        const format = downloadFormat?.value || 'png';

        if (format === 'png') {
            downloadAsPNG(canvas, downloadLink, baseSize);
        } else if (format === 'webp') {
            downloadAsWebP(canvas, downloadLink, baseSize);
        } else if (format === 'svg') {
            downloadAsSVG(downloadLink, baseSize);
        } else if (format === 'ico') {
            downloadAsICO(canvas, downloadLink);
        }
    } catch (error) {
        console.error('Download error:', error);
        setMessage('❌ Failed to download icon.', 'error');
    }
}

function downloadAsPNG(canvas, downloadLink, baseSize) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const aspectRatio = originalWidth / originalHeight;
    let downloadWidth, downloadHeight;
    if (aspectRatio >= 1) {
        downloadWidth = baseSize;
        downloadHeight = Math.round(baseSize / aspectRatio);
    } else {
        downloadHeight = baseSize;
        downloadWidth = Math.round(baseSize * aspectRatio);
    }

    const downloadCanvas = document.createElement('canvas');
    const scaleFactor = Math.max(downloadWidth / originalWidth, downloadHeight / originalHeight);
    if (scaleFactor <= 1) {
        downloadCanvas.width = downloadWidth;
        downloadCanvas.height = downloadHeight;
        const downloadCtx = downloadCanvas.getContext('2d');
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        downloadCtx.drawImage(canvas, 0, 0, downloadWidth, downloadHeight);
    } else {
        const superScale = Math.ceil(scaleFactor * SUPER_SCALE_FACTOR);
        const superWidth = originalWidth * superScale;
        const superHeight = originalHeight * superScale;
        const superCanvas = document.createElement('canvas');
        superCanvas.width = superWidth;
        superCanvas.height = superHeight;
        const superCtx = superCanvas.getContext('2d');
        superCtx.imageSmoothingEnabled = true;
        superCtx.imageSmoothingQuality = 'high';
        superCtx.scale(superScale, superScale);
        superCtx.drawImage(canvas, 0, 0);
        downloadCanvas.width = downloadWidth;
        downloadCanvas.height = downloadHeight;
        const downloadCtx = downloadCanvas.getContext('2d');
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        downloadCtx.drawImage(superCanvas, 0, 0, downloadWidth, downloadHeight);
    }
    downloadCanvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = `folder-icon-${downloadWidth}x${downloadHeight}.png`;
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
            setMessage(`✅ Icon downloaded as ${downloadWidth}x${downloadHeight} PNG!`, 'success');
        } else {
            setMessage('❌ Failed to generate download file.', 'error');
        }
    }, 'image/png', 1.0);
}

function downloadAsWebP(canvas, downloadLink, baseSize) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const aspectRatio = originalWidth / originalHeight;
    let downloadWidth, downloadHeight;
    if (aspectRatio >= 1) {
        downloadWidth = baseSize;
        downloadHeight = Math.round(baseSize / aspectRatio);
    } else {
        downloadHeight = baseSize;
        downloadWidth = Math.round(baseSize * aspectRatio);
    }

    const downloadCanvas = document.createElement('canvas');
    const scaleFactor = Math.max(downloadWidth / originalWidth, downloadHeight / originalHeight);
    if (scaleFactor <= 1) {
        downloadCanvas.width = downloadWidth;
        downloadCanvas.height = downloadHeight;
        const downloadCtx = downloadCanvas.getContext('2d');
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        downloadCtx.drawImage(canvas, 0, 0, downloadWidth, downloadHeight);
    } else {
        const superScale = Math.ceil(scaleFactor * SUPER_SCALE_FACTOR);
        const superWidth = originalWidth * superScale;
        const superHeight = originalHeight * superScale;
        const superCanvas = document.createElement('canvas');
        superCanvas.width = superWidth;
        superCanvas.height = superHeight;
        const superCtx = superCanvas.getContext('2d');
        superCtx.imageSmoothingEnabled = true;
        superCtx.imageSmoothingQuality = 'high';
        superCtx.scale(superScale, superScale);
        superCtx.drawImage(canvas, 0, 0);
        downloadCanvas.width = downloadWidth;
        downloadCanvas.height = downloadHeight;
        const downloadCtx = downloadCanvas.getContext('2d');
        downloadCtx.imageSmoothingEnabled = true;
        downloadCtx.imageSmoothingQuality = 'high';
        downloadCtx.drawImage(superCanvas, 0, 0, downloadWidth, downloadHeight);
    }
    downloadCanvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = `folder-icon-${downloadWidth}x${downloadHeight}.webp`;
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
            setMessage(`✅ Icon downloaded as ${downloadWidth}x${downloadHeight} WebP!`, 'success');
        } else {
            setMessage('❌ Failed to generate WebP file.', 'error');
        }
    }, 'image/webp', 0.9); // 0.9 quality for WebP
}

function downloadAsICO(canvas, downloadLink) {
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = ICO_SIZE;
    downloadCanvas.height = ICO_SIZE;
    const downloadCtx = downloadCanvas.getContext('2d');
    downloadCtx.imageSmoothingEnabled = true;
    downloadCtx.imageSmoothingQuality = 'high';
    downloadCtx.drawImage(canvas, 0, 0, ICO_SIZE, ICO_SIZE);
    downloadCanvas.toBlob(async (blob) => {
        if (blob) {
            const arrayBuffer = await blob.arrayBuffer();
            const icoBlob = pngToIco([new Uint8Array(arrayBuffer)]);
            const url = URL.createObjectURL(icoBlob);
            downloadLink.href = url;
            downloadLink.download = `folder-icon.ico`;
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
            setMessage(`✅ Icon downloaded as ICO!`, 'success');
        } else {
            setMessage('❌ Failed to generate ICO file.', 'error');
        }
    }, 'image/png', 1.0);
}

// --- SVG generator for folder icon ---
function generateFolderIconSVG(width, height) {
    // Only gradients and shapes, no image support for SVG export (for now)
    // You can extend this to embed images as data URIs if needed
    const border = settings.borderWidth;
    const corner = settings.cornerRadius;
    const tabW = settings.dynamicTabWidth;
    const tabO = settings.dynamicTabOffset;
    const tabH = 45;
    const frontY = settings.frontPartOffsetY;
    // Gradients
    const gradIdFront = 'frontGrad';
    const gradIdBack = 'backGrad';
    const gradIdBorder = 'borderGrad';
    // SVG string
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="${gradIdBack}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.backGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.backGradientStops[settings.backGradientStops.length-1]}"/>
    </linearGradient>
    <linearGradient id="${gradIdFront}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.frontGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.frontGradientStops[settings.frontGradientStops.length-1]}"/>
    </linearGradient>
    <linearGradient id="${gradIdBorder}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.borderGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.borderGradientStops[settings.borderGradientStops.length-1]}"/>
    </linearGradient>
  </defs>
  <!-- Back panel -->
  <rect x="5" y="5" width="${width-10}" height="${height-10}" rx="${corner}" fill="url(#${gradIdBack})"/>
  <!-- Front panel -->
  <rect x="0" y="${frontY}" width="${width}" height="${height-frontY}" rx="${corner}" fill="url(#${gradIdFront})"/>
  <!-- Tab -->
  <rect x="${tabO}" y="${frontY-tabH}" width="${tabW}" height="${tabH+corner}" rx="${Math.floor(corner/2)}" fill="url(#${gradIdFront})"/>
  <!-- Border -->
  <rect x="0" y="${frontY}" width="${width}" height="${height-frontY}" rx="${corner}" fill="none" stroke="url(#${gradIdBorder})" stroke-width="${border}"/>
</svg>`;
}

// --- Minimal PNG to ICO encoder (single 256x256 PNG) ---
function pngToIco(pngBuffers) {
    // Only supports one PNG buffer, 256x256, browser only
    // See https://en.wikipedia.org/wiki/ICO_(file_format)
    const png = pngBuffers[0];
    const header = new Uint8Array(6);
    header[0] = 0; header[1] = 0; // Reserved
    header[2] = 1; header[3] = 0; // Type: icon
    header[4] = 1; header[5] = 0; // Count: 1
    const dir = new Uint8Array(16);
    dir[0] = 256 % 256; // width
    dir[1] = 256 % 256; // height
    dir[2] = 0; // colors
    dir[3] = 0; // reserved
    dir[4] = 1; dir[5] = 0; // color planes
    dir[6] = 32; dir[7] = 0; // bits per pixel
    const pngSize = png.length;
    dir[8] = pngSize & 0xFF;
    dir[9] = (pngSize >> 8) & 0xFF;
    dir[10] = (pngSize >> 16) & 0xFF;
    dir[11] = (pngSize >> 24) & 0xFF;
    dir[12] = 22; dir[13] = 0; dir[14] = 0; dir[15] = 0; // offset
    const ico = new Uint8Array(6 + 16 + png.length);
    ico.set(header, 0);
    ico.set(dir, 6);
    ico.set(png, 22);
    return new Blob([ico], { type: 'image/x-icon' });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSettings();
        updateControlsFromState();
        updateCustomPresetsUI();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        setupShadowToggle();
        renderShadowControls();
        setupHarmonyControls();
        setupGeminiApiControls();
        drawFolderIcon();
        initCollapsibleMenus();
        setupMaterialRipple();
        setupFileHandling();
        setupControlListeners();
        setupPresetListeners();
        setupEnhancedFeatures();
        setupKeyboardShortcuts();
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        enhanceAccessibility();
    } catch (e) {
        console.error('❌ Error during application initialization:', e);
    }
});

import { useAppStore } from '../state';
import { drawFolderIcon, updateControlsFromState, animateCanvasIn, animateMessageArea, downloadButton, canvas, canvasPlaceholder, canvasOverlay } from '../dom';
import { renderGradientStopsUI } from '../gradients';
import { renderShadowControls } from '../shadow';
import { loadPreset, saveCurrentAsPreset } from '../presets';
import { copyToClipboard, debounce, setMessage } from '../utils';
import { suggestColorsFromImage, isGeminiApiKeyConfigured } from '../gemini-api';
import { gsap } from 'gsap';
import { AppError, errorHandler } from '../error';

const RIPPLE_DURATION = 0.44;
const COLLAPSE_DURATION = 0.32;
const EXPAND_DURATION = 0.44;
const MAX_COLLAPSIBLE_ATTEMPTS = 5;
const ATTEMPT_DELAY = 500;
const BREAKPOINTS = {
    small: 640,
    medium: 1279,
    large: 1280
};
const DEFAULT_CANVAS_SIZES = {
    small: { width: 240, height: 210 },
    medium: { width: 280, height: 245 },
    large: { width: 400, height: 320 },
    default: { width: 320, height: 280 }
};

function animateExpandCollapse(content: HTMLElement, expand: boolean) {
    if (expand) {
        content.style.display = 'block';
        const fullHeight = content.scrollHeight;
        content.style.height = '0'; // Set height to 0 before animation starts
        gsap.to(content, {
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

export function initCollapsibleMenus() {
    let attempts = 0;
    const maxAttempts = MAX_COLLAPSIBLE_ATTEMPTS;
    function attemptInit() {
        attempts++;
        const collapsibles = document.querySelectorAll('.collapsible');
        if (collapsibles.length === 0) {
            if (attempts < maxAttempts) {
                setTimeout(attemptInit, ATTEMPT_DELAY);
                return;
            }
            return;
        }
        collapsibles.forEach((coll) => {
            coll.setAttribute('role', 'button');
            coll.setAttribute('tabindex', '0');
            coll.setAttribute('aria-expanded', 'false');
            const content = coll.nextElementSibling as HTMLElement;
            if (content && !(content as any)._collapsibleInit) {
                content.setAttribute('aria-hidden', 'true');
                content.style.overflow = 'hidden';
                content.style.display = 'none';
                content.style.height = '0';
                (content as any)._collapsibleInit = true;
            }
            coll.addEventListener('click', function(this: HTMLElement, e: MouseEvent) {
                if ((e.target as HTMLElement).closest('.ripple')) return;
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                this.setAttribute('aria-expanded', String(isActive));
                if (content) {
                    content.setAttribute('aria-hidden', String(!isActive));
                    animateExpandCollapse(content, isActive);
                }
            });
            coll.addEventListener('keydown', function(this: HTMLElement, e: KeyboardEvent) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        if (collapsibles.length > 0) {
            const first = collapsibles[0] as HTMLElement;
            const content = first.nextElementSibling as HTMLElement;
            first.classList.add('active');
            first.setAttribute('aria-expanded', 'true');
            if (content) {
                content.setAttribute('aria-hidden', 'false');
                content.style.display = 'block';
                content.style.height = 'auto';
                content.classList.add('expanded');
            }
        }
    }
    attemptInit();
}

function createRipple(e: PointerEvent) {
    const button = e.currentTarget as HTMLElement;
    let ripple = button.querySelector('.ripple') as HTMLElement;
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        button.appendChild(ripple);
    }
    ripple.style.display = 'block';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
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

export function setupMaterialRipple() {
    const selectors = [
        '.action-button', '.preset-button', '.gemini-button', '.collapsible',
        'button:not([disabled]):not(.no-ripple)'
    ];
    const buttons = document.querySelectorAll(selectors.join(','));
    buttons.forEach((btn: HTMLElement) => {
        if (!(btn as any)._rippleBound) {
            btn.addEventListener('pointerdown', createRipple as EventListener);
            (btn as any)._rippleBound = true;
        }
    });
}

function setupSimpleSliderListener(sliderId: string, valueDisplayId: string, settingKey: string, isPercent: boolean = false) {
    const slider = document.getElementById(sliderId) as HTMLInputElement;
    const valueDisplay = document.getElementById(valueDisplayId);
    if (slider && valueDisplay) {
        const debouncedUpdate = debounce(() => {
            valueDisplay.textContent = slider.value;
            const value = isPercent ? parseFloat(slider.value) / 100 : parseInt(slider.value, 10);
            useAppStore.getState().updateSettings({ [settingKey]: value });
            drawFolderIcon();
        }, 100);
        slider.addEventListener('input', debouncedUpdate);
    }
}

export function setupControlListeners() {
    setupSimpleSliderListener('strokeWidthSlider', 'strokeWidthValue', 'borderWidth');
    setupSimpleSliderListener('cornerRadiusSlider', 'cornerRadiusValue', 'cornerRadius');
    setupSimpleSliderListener('taperAmountSlider', 'taperAmountValue', 'taperAmount');
    setupSimpleSliderListener('frontOffsetYSlider', 'frontOffsetYValue', 'frontPartOffsetY');
    setupSimpleSliderListener('tabWidthSlider', 'tabWidthValue', 'dynamicTabWidth');
    setupSimpleSliderListener('tabOffsetSlider', 'tabOffsetValue', 'dynamicTabOffset');
    setupSimpleSliderListener('imageOpacitySlider', 'imageOpacityValue', 'currentImageOpacity', true);
    setupSimpleSliderListener('highlightStrengthSlider', 'highlightStrengthValue', 'highlightStrength', true);
    setupSimpleSliderListener('imageBlurSlider', 'imageBlurValue', 'imageBlur');
    setupSimpleSliderListener('imageBrightnessSlider', 'imageBrightnessValue', 'imageBrightness');
    setupSimpleSliderListener('imageContrastSlider', 'imageContrastValue', 'imageContrast');
    setupSimpleSliderListener('imageSaturationSlider', 'imageSaturationValue', 'imageSaturation');
    setupSimpleSliderListener('imageScaleXSlider', 'imageScaleXValue', 'imageScaleX');
    setupSimpleSliderListener('imageScaleYSlider', 'imageScaleYValue', 'imageScaleY');
    setupSimpleSliderListener('imageOffsetXSlider', 'imageOffsetXValue', 'imageOffsetX');
    setupSimpleSliderListener('imageOffsetYSlider', 'imageOffsetYValue', 'imageOffsetY');
    setupSimpleSliderListener('imageSkewXSlider', 'imageSkewXValue', 'imageSkewX');
    setupSimpleSliderListener('imageSkewYSlider', 'imageSkewYValue', 'imageSkewY');
    setupSimpleSliderListener('imageSkewZSlider', 'imageSkewZValue', 'imageSkewZ');
    setupSimpleSliderListener('imageRotationSlider', 'imageRotationValue', 'imageRotation');
    setupSimpleSliderListener('shadowBlurSlider', 'shadowBlurValue', 'shadowBlur');
    setupSimpleSliderListener('shadowOffsetXSlider', 'shadowOffsetXValue', 'shadowOffsetX');
    setupSimpleSliderListener('shadowOffsetYSlider', 'shadowOffsetYValue', 'shadowOffsetY');
    setupSimpleSliderListener('shadowOpacitySlider', 'shadowOpacityValue', 'shadowOpacity', true);

    const imageFitSelect = document.getElementById('imageFitSelect') as HTMLSelectElement;
    const blendModeSelect = document.getElementById('blendModeSelect') as HTMLSelectElement;
    const shadowColorPicker = document.getElementById('shadowColorPicker') as HTMLInputElement;

    [imageFitSelect, blendModeSelect, shadowColorPicker].forEach(el => {
        if (el) {
            const eventType = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
            el.addEventListener(eventType, () => {
                let settingKey = '';
                if (el.id === 'imageFitSelect') settingKey = 'imageFit';
                else if (el.id === 'blendModeSelect') settingKey = 'currentBlendMode';
                else if (el.id === 'shadowColorPicker') settingKey = 'shadowColor';

                if (settingKey) {
                    useAppStore.getState().updateSettings({ [settingKey]: el.value });
                    drawFolderIcon();
                }
            });
        }
    });
}

export function setupPresetListeners() {
    const presetSelect = document.getElementById('presetSelect') as HTMLSelectElement;
    const loadPresetButton = document.getElementById('loadPresetButton') as HTMLButtonElement;
    const savePresetButton = document.getElementById('savePresetButton') as HTMLButtonElement;

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

export function setupEnhancedFeatures() {
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
    if (resetTransformBtn) resetTransformBtn.addEventListener('click', () => useAppStore.getState().updateSettings({ imageScaleX: 100, imageScaleY: 100, imageOffsetX: 0, imageOffsetY: 0, imageSkewX: 0, imageSkewY: 0, imageSkewZ: 0, imageRotation: 0, }));
    if (downloadButton) downloadButton.addEventListener('click', () => { animateCanvasIn(); });

    updateAIColorsButtonState();
}

function randomizeColors() {
    const generateRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    useAppStore.getState().updateSettings({
        frontGradientStops: [generateRandomColor(), generateRandomColor()],
        backGradientStops: [generateRandomColor(), generateRandomColor()],
        borderGradientStops: [generateRandomColor(), generateRandomColor()]
    });
    updateControlsFromState();
    ['front', 'back', 'border'].forEach(renderGradientStopsUI);
    drawFolderIcon();
    setMessage('🎨 Colors randomized!', 'success');
}

async function suggestColorsFromImageButton() {
    const { loadedImageBase64, updateSettings } = useAppStore.getState();
    if (!isGeminiApiKeyConfigured()) {
        setMessage('❌ Please configure your Gemini API key in the Advanced section first.', 'error');
        return;
    }
    if (!loadedImageBase64) {
        setMessage('❌ Please load an image first to get AI color suggestions.', 'error');
        return;
    }
    const button = document.getElementById('suggestColorsFromImageButton') as HTMLButtonElement;
    button.disabled = true;
    button.innerHTML = '<span class="relative z-10">🔄 Analyzing...</span>';
    setMessage('🤖 AI is analyzing your image for color suggestions...', 'info');
    try {
        const imageData = `data:image/jpeg;base64,${loadedImageBase64}`;
        const suggestedColors = await suggestColorsFromImage(imageData);
        if (suggestedColors && suggestedColors.length >= 4) {
            updateSettings({
                frontGradientStops: [suggestedColors[0], suggestedColors[1]],
                backGradientStops: [suggestedColors[2], suggestedColors[3]],
                borderGradientStops: [suggestedColors[4] || suggestedColors[0]]
            });
            updateControlsFromState();
            ['front', 'back', 'border'].forEach(renderGradientStopsUI);
            drawFolderIcon();
            setMessage(`✨ Applied ${suggestedColors.length} AI-suggested colors!`, 'success');
        } else {
            throw new AppError('AI returned fewer colors than expected.', 'AI-COLOR-ERROR', '⚠️ AI returned fewer colors than expected. Please try again.');
        }
    } catch (error) {
        errorHandler(error);
    } finally {
        button.disabled = false;
        button.innerHTML = '<span class="relative z-10">✨ AI Colors</span>';
    }
}

function resetToDefault() {
    if (confirm('Reset all settings to default?')) {
        useAppStore.getState().resetSettingsToDefaults();
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('🔄 Reset to defaults!', 'success');
    }
}

function copySettings() {
    const { settings } = useAppStore.getState();
    copyToClipboard(JSON.stringify(settings, null, 2));
}

async function pasteSettings() {
    try {
        const text = await navigator.clipboard.readText();
        const newSettings = JSON.parse(text);
        useAppStore.getState().updateSettings(newSettings);
        updateControlsFromState();
        ['front', 'back', 'border'].forEach(renderGradientStopsUI);
        renderShadowControls();
        drawFolderIcon();
        setMessage('📋 Settings pasted!', 'success');
    } catch (error) {
        errorHandler(new AppError('Failed to parse settings from clipboard.', 'PASTE-SETTINGS-FAILURE', 'Invalid settings data in clipboard.'));
    }
}

export function updateAIColorsButtonState() {
    const suggestColorsBtn = document.getElementById('suggestColorsFromImageButton') as HTMLButtonElement;
    if (!suggestColorsBtn) return;
    const { loadedImageBase64 } = useAppStore.getState();
    const hasImage = !!loadedImageBase64;
    const hasApiKey = isGeminiApiKeyConfigured();
    suggestColorsBtn.disabled = !hasImage || !hasApiKey;
    if (!hasImage && !hasApiKey) {
        suggestColorsBtn.title = 'Load an image and configure Gemini API key to enable AI suggestions';
    } else if (!hasImage) {
        suggestColorsBtn.title = 'Load an image to enable AI suggestions';
    } else if (!hasApiKey) {
        suggestColorsBtn.title = 'Configure Gemini API key to enable AI suggestions';
    } else {
        suggestColorsBtn.title = 'Get AI-powered color suggestions from your image';
    }
}

export function updateCanvasSize() {
    if (!canvas || !canvasPlaceholder) return;
    let { width, height } = DEFAULT_CANVAS_SIZES.default;
    if (window.innerWidth <= BREAKPOINTS.small) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.small);
    } else if (window.innerWidth <= BREAKPOINTS.medium) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.medium);
    } else if (window.innerWidth >= BREAKPOINTS.large) {
        ({ width, height } = DEFAULT_CANVAS_SIZES.large);
    }
    canvas.width = Math.floor(width);
    canvas.height = Math.floor(height);
    canvas.style.width = `${Math.floor(width)}px`;
    canvas.style.height = `${Math.floor(height)}px`;
    canvasPlaceholder.style.width = `${Math.floor(width)}px`;
    canvasPlaceholder.style.height = `${Math.floor(height)}px`;
    if (canvasOverlay) {
        canvasOverlay.style.width = `${Math.floor(width)}px`;
        canvasOverlay.style.height = `${Math.floor(height)}px`;
    }
    const { loadedImage } = useAppStore.getState();
    if (!canvas.classList.contains('hidden') && loadedImage) {
        setTimeout(() => drawFolderIcon(), 100);
    }
}

export function enhanceAccessibility() {
    const controls = document.querySelectorAll('input, button, select');
    controls.forEach((control: any) => {
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
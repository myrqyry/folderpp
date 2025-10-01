// Import GSAP for smooth animations
import { gsap } from 'gsap';
// Example: Animate the canvas in when shown
export function animateCanvasIn() {
    if (canvas) {
        gsap.fromTo(canvas, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
    }
}

// Example: Animate message area for feedback
export function animateMessageArea() {
    if (messageArea) {
        gsap.fromTo(messageArea, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
}
// Import utilities
import { setMessage, saveSettings } from './utils.ts';
import { renderGradientStopsUI } from './gradients.ts';


// --- Get DOM Elements ---
export const imageInput = document.getElementById('imageInput');
export const fileNameDisplay = document.getElementById('fileName');
export const downloadButton = document.getElementById('downloadButton');
const downloadButtonText = document.getElementById('downloadButtonText');
const downloadSpinner = document.getElementById('downloadSpinner');
const downloadSize = document.getElementById('downloadSize');
export const canvas = document.getElementById('outputCanvas');
const ctx = (canvas as HTMLCanvasElement).getContext('2d')!;
const downloadLink = document.getElementById('downloadLink');
export const messageArea = document.getElementById('messageArea');
export const canvasPlaceholder = document.getElementById('canvasPlaceholder');
export const canvasOverlay = document.getElementById('canvasOverlay');
export const dropZone = document.getElementById('dropZone');

// Gemini Buttons
const suggestColorsFromImageButton = document.getElementById('suggestColorsFromImageButton');

// Preset Controls
const presetSelect = document.getElementById('presetSelect');
const loadPresetButton = document.getElementById('loadPresetButton');
const savePresetButton = document.getElementById('savePresetButton');
export const customPresetsContainer = document.getElementById('customPresetsContainer');
export const customPresetsList = document.getElementById('customPresetsList');

// Quick Actions
const randomizeColorsBtn = document.getElementById('randomizeColorsBtn');
const resetToDefaultBtn = document.getElementById('resetToDefaultBtn');
const copySettingsBtn = document.getElementById('copySettingsBtn');
const pasteSettingsBtn = document.getElementById('pasteSettingsBtn');

// Shape Controls
const strokeWidthSlider = document.getElementById('strokeWidthSlider');
const strokeWidthValue = document.getElementById('strokeWidthValue');
const cornerRadiusSlider = document.getElementById('cornerRadiusSlider');
const cornerRadiusValue = document.getElementById('cornerRadiusValue');
const taperAmountSlider = document.getElementById('taperAmountSlider');
const taperAmountValue = document.getElementById('taperAmountValue');
const frontOffsetYSlider = document.getElementById('frontOffsetYSlider');
const frontOffsetYValue = document.getElementById('frontOffsetYValue');
const tabWidthSlider = document.getElementById('tabWidthSlider');
const tabWidthValue = document.getElementById('tabWidthValue');
const tabOffsetSlider = document.getElementById('tabOffsetSlider');
const tabOffsetValue = document.getElementById('tabOffsetValue');

// Color Harmony Tools
const complementaryBtn = document.getElementById('complementaryBtn');
const analogousBtn = document.getElementById('analogousBtn');
const triadicBtn = document.getElementById('triadicBtn');
const monochromaticBtn = document.getElementById('monochromaticBtn');

// Gradient Controls (Dynamic elements will be created in gradients.js)

// Image & Effects Controls
const imageOpacitySlider = document.getElementById('imageOpacitySlider');
const imageOpacityValue = document.getElementById('imageOpacityValue');
const imageFitSelect = document.getElementById('imageFitSelect');
const blendModeSelect = document.getElementById('blendModeSelect');
const highlightStrengthSlider = document.getElementById('highlightStrengthSlider');
const highlightStrengthValue = document.getElementById('highlightStrengthValue');

// New Image Filter Controls
const imageBlurSlider = document.getElementById('imageBlurSlider');
const imageBlurValue = document.getElementById('imageBlurValue');
const imageBrightnessSlider = document.getElementById('imageBrightnessSlider');
const imageBrightnessValue = document.getElementById('imageBrightnessValue');
const imageContrastSlider = document.getElementById('imageContrastSlider');
const imageContrastValue = document.getElementById('imageContrastValue');
const imageSaturationSlider = document.getElementById('imageSaturationSlider');
const imageSaturationValue = document.getElementById('imageSaturationValue');

// Image Transform Controls
const imageScaleXSlider = document.getElementById('imageScaleXSlider');
const imageScaleXValue = document.getElementById('imageScaleXValue');
const imageScaleYSlider = document.getElementById('imageScaleYSlider');
const imageScaleYValue = document.getElementById('imageScaleYValue');
const imageOffsetXSlider = document.getElementById('imageOffsetXSlider');
const imageOffsetXValue = document.getElementById('imageOffsetXValue');
const imageOffsetYSlider = document.getElementById('imageOffsetYSlider');
const imageOffsetYValue = document.getElementById('imageOffsetYValue');
const imageSkewXSlider = document.getElementById('imageSkewXSlider');
const imageSkewXValue = document.getElementById('imageSkewXValue');
const imageSkewYSlider = document.getElementById('imageSkewYSlider');
const imageSkewYValue = document.getElementById('imageSkewYValue');
const imageSkewZSlider = document.getElementById('imageSkewZSlider');
const imageSkewZValue = document.getElementById('imageSkewZValue');
const imageRotationSlider = document.getElementById('imageRotationSlider');
const imageRotationValue = document.getElementById('imageRotationValue');
const resetTransformBtn = document.getElementById('resetTransformBtn');

// Enhanced Shadow Controls (Dynamic elements will be created in shadow.js)
const shadowColorPicker = document.getElementById('shadowColorPicker');
const shadowBlurSlider = document.getElementById('shadowBlurSlider');
const shadowBlurValue = document.getElementById('shadowBlurValue');
const shadowOffsetXSlider = document.getElementById('shadowOffsetXSlider');
const shadowOffsetXValue = document.getElementById('shadowOffsetXValue');
const shadowOffsetYSlider = document.getElementById('shadowOffsetYSlider');
const shadowOffsetYValue = document.getElementById('shadowOffsetYValue');
const shadowOpacitySlider = document.getElementById('shadowOpacitySlider');
const shadowOpacityValue = document.getElementById('shadowOpacityValue');
const shadowSpreadSlider = document.getElementById('shadowSpreadSlider');
const shadowSpreadValue = document.getElementById('shadowSpreadValue');

// Shadow Presets
const softShadowBtn = document.getElementById('softShadowBtn');
const hardShadowBtn = document.getElementById('hardShadowBtn');
const glowShadowBtn = document.getElementById('glowShadowBtn');
const longShadowBtn = document.getElementById('longShadowBtn');
const innerShadowBtn = document.getElementById('innerShadowBtn');
const noShadowBtn = document.getElementById('noShadowBtn');

// Advanced Shadow Options
export const shadowPreview = document.getElementById('shadowPreview');
export const shadowToggle = document.getElementById('shadowToggle');

// --- State and settings are now imported from state.js ---
import { settings, loadedImage, loadedImageBase64, resetLoadedImage, setLoadedImage, SETTINGS_KEY, CUSTOM_PRESETS_KEY, TAB_HEIGHT, BACK_PANEL_INSET, API_KEY } from './state.ts';

// --- Utility functions (moved to utils.js) ---
// function setMessage(msg, type = 'default') { ... }
// function saveSettings() { ... }
// function loadSettings() { ... }

// --- Preset System (moved to presets.js) ---
// const presets = { ... };
// function loadCustomPresets() { ... }
// function saveCustomPresets(customPresets) { ... }
// function updateCustomPresetsUI() { ... }
// function loadCustomPreset(key) { ... }
// function deleteCustomPreset(key) { ... }
// function loadPreset(presetKey) { ... }
// function saveCurrentAsPreset() { ... }

// --- Render Multi-Stop Gradient Controls (moved to gradients.js) ---
// function renderGradientStopsUI(type) { ... }

// DOM Update and Drawing functions

// --- Update UI from State ---
export function updateControlsFromState() {
    // Shape - with null checks
    if (strokeWidthSlider) { strokeWidthSlider.value = settings.borderWidth; }
    if (strokeWidthValue) { strokeWidthValue.textContent = settings.borderWidth; }
    if (cornerRadiusSlider) { cornerRadiusSlider.value = settings.cornerRadius; }
    if (cornerRadiusValue) { cornerRadiusValue.textContent = settings.cornerRadius; }
    if (taperAmountSlider) { taperAmountSlider.value = settings.taperAmount; }
    if (taperAmountValue) { taperAmountValue.textContent = settings.taperAmount; }
    if (frontOffsetYSlider) { frontOffsetYSlider.value = settings.frontPartOffsetY; }
    if (frontOffsetYValue) { frontOffsetYValue.textContent = settings.frontPartOffsetY; }
    if (tabWidthSlider) { tabWidthSlider.value = settings.dynamicTabWidth; }
    if (tabWidthValue) { tabWidthValue.textContent = settings.dynamicTabWidth; }
    if (tabOffsetSlider) { tabOffsetSlider.value = settings.dynamicTabOffset; }
    if (tabOffsetValue) { tabOffsetValue.textContent = settings.dynamicTabOffset; }

    // Colors - Render dynamic UI
    renderGradientStopsUI('front');
    renderGradientStopsUI('back');
    renderGradientStopsUI('border');

    // Gradient Controls
    if (frontGradientAngle) { frontGradientAngle.value = settings.frontGradientAngle; frontGradientAngleValue.textContent = settings.frontGradientAngle + '°'; }
    if (frontGradientSpread) { frontGradientSpread.value = settings.frontGradientSpread; frontGradientSpreadValue.textContent = settings.frontGradientSpread + '%'; }
    if (frontGradientOffsetY) { frontGradientOffsetY.value = settings.frontGradientOffsetY; frontGradientOffsetYValue.textContent = settings.frontGradientOffsetY + 'px'; }

    if (backGradientAngle) { backGradientAngle.value = settings.backGradientAngle; backGradientAngleValue.textContent = settings.backGradientAngle + '°'; }
    if (backGradientSpread) { backGradientSpread.value = settings.backGradientSpread; backGradientSpreadValue.textContent = settings.backGradientSpread + '%'; }
    if (backGradientOffsetY) { backGradientOffsetY.value = settings.backGradientOffsetY; backGradientOffsetYValue.textContent = settings.backGradientOffsetY + 'px'; }

    if (borderGradientAngle) { borderGradientAngle.value = settings.borderGradientAngle; borderGradientAngleValue.textContent = settings.borderGradientAngle + '°'; }
    if (borderGradientSpread) { borderGradientSpread.value = settings.borderGradientSpread; borderGradientSpreadValue.textContent = settings.borderGradientSpread + '%'; }
    if (borderGradientOffsetY) { borderGradientOffsetY.value = settings.borderGradientOffsetY; borderGradientOffsetYValue.textContent = settings.borderGradientOffsetY + 'px'; }

    // Image & Effects - with null checks
    if (highlightStrengthSlider) { highlightStrengthSlider.value = settings.highlightStrength * 100; }
    if (highlightStrengthValue) { highlightStrengthValue.textContent = Math.round(settings.highlightStrength * 100); }
    if (imageOpacitySlider) { imageOpacitySlider.value = settings.currentImageOpacity * 100; }
    if (imageOpacityValue) { imageOpacityValue.textContent = Math.round(settings.currentImageOpacity * 100); }
    if (imageFitSelect) { imageFitSelect.value = settings.imageFit; }
    if (blendModeSelect) { blendModeSelect.value = settings.currentBlendMode; }

    // New Image Filter Controls
    if (imageBlurSlider) { imageBlurSlider.value = settings.imageBlur || 0; imageBlurValue.textContent = settings.imageBlur || 0; }
    if (imageBrightnessSlider) { imageBrightnessSlider.value = settings.imageBrightness || 100; imageBrightnessValue.textContent = settings.imageBrightness || 100; }
    if (imageContrastSlider) { imageContrastSlider.value = settings.imageContrast || 100; imageContrastValue.textContent = settings.imageContrast || 100; }
    if (imageSaturationSlider) { imageSaturationSlider.value = settings.imageSaturation || 100; imageSaturationValue.textContent = settings.imageSaturation || 100; }

    // Image Transform Controls
    if (imageScaleXSlider) { imageScaleXSlider.value = settings.imageScaleX || 100; imageScaleXValue.textContent = settings.imageScaleX || 100; }
    if (imageScaleYSlider) { imageScaleYSlider.value = settings.imageScaleY || 100; imageScaleYValue.textContent = settings.imageScaleY || 100; }
    if (imageOffsetXSlider) { imageOffsetXSlider.value = settings.imageOffsetX || 0; imageOffsetXValue.textContent = settings.imageOffsetX || 0; }
    if (imageOffsetYSlider) { imageOffsetYSlider.value = settings.imageOffsetY || 0; imageOffsetYValue.textContent = settings.imageOffsetY || 0; }
    if (imageSkewXSlider) { imageSkewXSlider.value = settings.imageSkewX || 0; imageSkewXValue.textContent = settings.imageSkewX || 0; }
    if (imageSkewYSlider) { imageSkewYSlider.value = settings.imageSkewY || 0; imageSkewYValue.textContent = settings.imageSkewY || 0; }
    if (imageSkewZSlider) { imageSkewZSlider.value = settings.imageSkewZ || 0; imageSkewZValue.textContent = settings.imageSkewZ || 0; }
    if (imageRotationSlider) { imageRotationSlider.value = settings.imageRotation || 0; imageRotationValue.textContent = settings.imageRotation || 0; }

    // Shadow - with null checks
    if (shadowToggle) shadowToggle.checked = settings.dropShadowEnabled;
    if (shadowColorPicker) shadowColorPicker.value = settings.shadowColor;
    if (shadowBlurSlider) { shadowBlurSlider.value = settings.shadowBlur; }
    if (shadowBlurValue) { shadowBlurValue.textContent = settings.shadowBlur; }
    if (shadowOffsetXSlider) { shadowOffsetXSlider.value = settings.shadowOffsetX; }
    if (shadowOffsetXValue) { shadowOffsetXValue.textContent = settings.shadowOffsetX; }
    if (shadowOffsetYSlider) { shadowOffsetYSlider.value = settings.shadowOffsetY; }
    if (shadowOffsetYValue) { shadowOffsetYValue.textContent = settings.shadowOffsetY; }
    if (shadowOpacitySlider) { shadowOpacitySlider.value = settings.shadowOpacity * 100; }
    if (shadowOpacityValue) { shadowOpacityValue.textContent = Math.round(settings.shadowOpacity * 100); }

    // Enhanced Shadow Controls
    if (shadowSpreadSlider) { shadowSpreadSlider.value = settings.shadowSpread || 0; }
    if (shadowSpreadValue) { shadowSpreadValue.textContent = settings.shadowSpread || 0; }
}

// Reset transform values to defaults
export function resetTransformValues() {
    // Reset scale controls
    if (imageScaleXSlider) {
        imageScaleXSlider.value = '100';
        if (imageScaleXValue) imageScaleXValue.textContent = '100';
        // Trigger change event to update settings
        imageScaleXSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (imageScaleYSlider) {
        imageScaleYSlider.value = '100';
        if (imageScaleYValue) imageScaleYValue.textContent = '100';
        imageScaleYSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Reset offset controls
    if (imageOffsetXSlider) {
        imageOffsetXSlider.value = '0';
        if (imageOffsetXValue) imageOffsetXValue.textContent = '0';
        imageOffsetXSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (imageOffsetYSlider) {
        imageOffsetYSlider.value = '0';
        if (imageOffsetYValue) imageOffsetYValue.textContent = '0';
        imageOffsetYSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Reset skew controls
    if (imageSkewXSlider) {
        imageSkewXSlider.value = '0';
        if (imageSkewXValue) imageSkewXValue.textContent = '0';
        imageSkewXSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (imageSkewYSlider) {
        imageSkewYSlider.value = '0';
        if (imageSkewYValue) imageSkewYValue.textContent = '0';
        imageSkewYSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (imageSkewZSlider) {
        imageSkewZSlider.value = '0';
        if (imageSkewZValue) imageSkewZValue.textContent = '0';
        imageSkewZSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Reset rotation control
    if (imageRotationSlider) {
        imageRotationSlider.value = '0';
        if (imageRotationValue) imageRotationValue.textContent = '0';
        imageRotationSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // The canvas will be updated by the event listeners triggered above
}

function getGradientPoints(angleDegrees, width, height, spreadPercent = 100, verticalOffset = 0) {
    const angleRad = ((angleDegrees - 90) % 360) * Math.PI / 180;
    const cx = width / 2; const cy = height / 2;
    let length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));
    length *= (spreadPercent / 100); length = Math.max(1, length);
    const x0 = cx - Math.cos(angleRad) * length / 2;
    const y0 = cy - Math.sin(angleRad) * length / 2;
    const x1 = cx + Math.cos(angleRad) * length / 2;
    const y1 = cy + Math.sin(angleRad) * length / 2;
    const dy = Math.sin(angleRad) * verticalOffset;
    return { x0, y0: y0 - dy, x1, y1: y1 - dy };
}

function defineFolderBackPath(ctx, w, h) {
    const halfBorder = settings.borderWidth / 2; const currentCornerRadius = settings.cornerRadius;
    const currentTaperAmount = settings.taperAmount; const currentTabRadius = currentCornerRadius;
    const currentTabWidth = settings.dynamicTabWidth; const currentTabOffset = settings.dynamicTabOffset;
    const effLeftX = halfBorder + backPanelInset; const effRightX = w - halfBorder - backPanelInset;
    const effBottomY = h - halfBorder; const backBodyTopY = Math.max(halfBorder + currentTabRadius, tabHeight);
    const effTopY = halfBorder; const effWidth = effRightX - effLeftX;
    const actualTaperAmount = Math.min(currentTaperAmount, (effWidth / 2) - currentCornerRadius);
    const bottomLeftX = effLeftX + actualTaperAmount; const bottomRightX = effRightX - actualTaperAmount;
    const topBodyLeftX = effLeftX; const topBodyRightX = effRightX;
    const maxBottomRadius = Math.max(1, (bottomRightX - bottomLeftX) / 2);
    const bottomCornerRadius = Math.min(currentCornerRadius, maxBottomRadius);
    const maxTopBodyRadius = Math.max(1, (topBodyRightX - topBodyLeftX) / 2);
    const topBodyCornerRadius = Math.min(currentCornerRadius, maxTopBodyRadius);
    const effTabOffset = Math.max(effLeftX, halfBorder + currentTabOffset);
    const tabTopLeftX = effTabOffset; const maxTabWidth = effRightX - tabTopLeftX;
    const effTabWidth = Math.min(currentTabWidth, maxTabWidth);
    const tabTopRightX = tabTopLeftX + effTabWidth;
    const maxTabRadius = Math.min( Math.max(1, effTabWidth / 2), Math.max(1, (backBodyTopY - effTopY) / 2) );
    const actualTabRadius = Math.min(currentTabRadius, maxTabRadius);
    ctx.beginPath(); ctx.moveTo(bottomLeftX + bottomCornerRadius, effBottomY);
    ctx.lineTo(bottomRightX - bottomCornerRadius, effBottomY);
    ctx.quadraticCurveTo(bottomRightX, effBottomY, bottomRightX, effBottomY - bottomCornerRadius);
    ctx.lineTo(topBodyRightX, backBodyTopY + topBodyCornerRadius);
    ctx.quadraticCurveTo(topBodyRightX, backBodyTopY, topBodyRightX - topBodyCornerRadius, backBodyTopY);
    ctx.lineTo(tabTopRightX, backBodyTopY); ctx.lineTo(tabTopRightX, effTopY + actualTabRadius);
    ctx.quadraticCurveTo(tabTopRightX, effTopY, tabTopRightX - actualTabRadius, effTopY);
    ctx.lineTo(tabTopLeftX + actualTabRadius, effTopY);
    ctx.quadraticCurveTo(tabTopLeftX, effTopY, tabTopLeftX, effTopY + actualTabRadius);
    ctx.lineTo(tabTopLeftX, backBodyTopY); ctx.lineTo(topBodyLeftX + topBodyCornerRadius, backBodyTopY);
    ctx.quadraticCurveTo(topBodyLeftX, backBodyTopY, topBodyLeftX, backBodyTopY + topBodyCornerRadius);
    ctx.lineTo(bottomLeftX, effBottomY - bottomCornerRadius);
    ctx.quadraticCurveTo(bottomLeftX, effBottomY, bottomLeftX + bottomCornerRadius, effBottomY);
    ctx.closePath();
}

function defineFolderFrontPath(ctx, w, h) {
     const halfBorder = settings.borderWidth / 2; const currentCornerRadius = settings.cornerRadius;
     const currentTaperAmount = settings.taperAmount; const currentFrontOffsetY = settings.frontPartOffsetY;
    const effLeftX = halfBorder; const effRightX = w - halfBorder; const effBottomY = h - halfBorder;
    const frontTopEdgeY = tabHeight + currentFrontOffsetY;
    const effTopY = Math.min(effBottomY - currentCornerRadius, Math.max(halfBorder + currentCornerRadius, frontTopEdgeY));
    const effWidth = effRightX - effLeftX;
    const actualTaperAmount = Math.min(currentTaperAmount, (effWidth / 2) - currentCornerRadius);
    const bottomLeftX = effLeftX + actualTaperAmount; const bottomRightX = effRightX - actualTaperAmount;
    const topLeftX = effLeftX; const topRightX = effRightX;
    const maxBottomRadius = Math.max(1, (bottomRightX - bottomLeftX) / 2);
    const bottomCornerRadius = Math.min(currentCornerRadius, maxBottomRadius);
    const maxTopRadius = Math.max(1, (topRightX - topLeftX) / 2);
    const topCornerRadius = Math.min(currentCornerRadius, maxTopRadius);
    ctx.beginPath(); ctx.moveTo(bottomLeftX + bottomCornerRadius, effBottomY);
    ctx.lineTo(bottomRightX - bottomCornerRadius, effBottomY);
    ctx.quadraticCurveTo(bottomRightX, effBottomY, bottomRightX, effBottomY - bottomCornerRadius);
    ctx.lineTo(topRightX, effTopY + topCornerRadius);
    ctx.quadraticCurveTo(topRightX, effTopY, topRightX - topCornerRadius, effTopY);
    ctx.lineTo(topLeftX + topCornerRadius, effTopY);
    ctx.quadraticCurveTo(topLeftX, effTopY, topLeftX, effTopY + topCornerRadius);
    ctx.lineTo(bottomLeftX, effBottomY - bottomCornerRadius);
    ctx.quadraticCurveTo(bottomLeftX, effBottomY, bottomLeftX + bottomCornerRadius, effBottomY);
    ctx.closePath();
}

function drawClippedImage(ctx, image, pathWidth, pathHeight, clipPathFn) {
    // Only draw image if it's loaded and opacity is greater than 0
    if (settings.currentImageOpacity <= 0 || !image) {
        return;
    }

    // Create offscreen canvas for applying filters
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = pathWidth;
    offscreenCanvas.height = pathHeight;

    // Calculate image dimensions and positioning
    const imgAspect = image.width / image.height;
    const areaAspect = pathWidth / pathHeight;
    let sx = 0, sy = 0, sWidth = image.width, sHeight = image.height;
    let dx = 0, dy = 0, dWidth = pathWidth, dHeight = pathHeight;

    if (settings.imageFit === 'cover') {
        if (imgAspect > areaAspect) {
            sHeight = image.height;
            sWidth = sHeight * areaAspect;
            sx = (image.width - sWidth) / 2;
        } else {
            sWidth = image.width;
            sHeight = sWidth / areaAspect;
            sy = (image.height - sHeight) / 2;
        }
    } else if (settings.imageFit === 'contain') {
        if (imgAspect > areaAspect) {
            dWidth = pathWidth;
            dHeight = dWidth / imgAspect;
            dy = (pathHeight - dHeight) / 2;
        } else {
            dHeight = pathHeight;
            dWidth = dHeight * imgAspect;
            dx = (pathWidth - dWidth) / 2;
        }
    }

    if (dWidth > 0 && dHeight > 0 && sWidth > 0 && sHeight > 0) {
        // Apply filters to offscreen canvas
        const blur = settings.imageBlur || 0;
        const brightness = settings.imageBrightness || 100;
        const contrast = settings.imageContrast || 100;
        const saturation = settings.imageSaturation || 100;
        const highlight = settings.highlightStrength ? (settings.highlightStrength * 100) : 0;

        let filterString = '';
        if (blur > 0) filterString += `blur(${blur}px) `;
        if (brightness !== 100) filterString += `brightness(${brightness}%) `;
        if (contrast !== 100) filterString += `contrast(${contrast}%) `;
        if (saturation !== 100) filterString += `saturate(${saturation}%) `;
        if (highlight !== 0) {
            // Convert highlight to a brightness adjustment
            const highlightBrightness = 100 + (highlight * 0.5);
            filterString += `brightness(${highlightBrightness}%) `;
        }

        offscreenCtx.filter = filterString.trim() || 'none';

        // Apply user transforms to offscreen context
        offscreenCtx.save();
        offscreenCtx.translate(dx + dWidth / 2, dy + dHeight / 2);

        const scaleX = (settings.imageScaleX || 100) / 100;
        const scaleY = (settings.imageScaleY || 100) / 100;
        offscreenCtx.scale(scaleX, scaleY);
        offscreenCtx.rotate(((settings.imageRotation || 0) * Math.PI) / 180);
        offscreenCtx.transform(1, Math.tan(((settings.imageSkewY || 0) * Math.PI) / 180), Math.tan(((settings.imageSkewX || 0) * Math.PI) / 180), 1, 0, 0);

        const taper = settings.imageSkewZ || 0;
        offscreenCtx.translate((settings.imageOffsetX || 0), (settings.imageOffsetY || 0));

        if (taper !== 0) {
            // Improved taper effect with smoother rendering
            const strips = 200; // Increased from 80 for smoother result
            const fitWidth = dWidth;
            const fitHeight = dHeight;
            const halfTaperPx = (taper / 100) * fitWidth / 2 * scaleX;
            const topWidth = fitWidth * scaleX + halfTaperPx;
            const bottomWidth = fitWidth * scaleX - halfTaperPx;

            // Enable high-quality rendering
            offscreenCtx.imageSmoothingEnabled = true;
            offscreenCtx.imageSmoothingQuality = 'high';

            for (let i = 0; i < strips; i++) {
                const t = i / (strips - 1);
                const nextT = (i + 1) / (strips - 1);

                // Use floating-point precision for smoother positioning
                const y = -fitHeight * scaleY / 2 + (fitHeight * scaleY * t);
                const nextY = -fitHeight * scaleY / 2 + (fitHeight * scaleY * nextT);
                const stripHeight = nextY - y;

                // Calculate width at this position with smooth interpolation
                const currLeft = -topWidth / 2 + ((-bottomWidth / 2) - (-topWidth / 2)) * t;
                const currRight = topWidth / 2 + ((bottomWidth / 2) - (topWidth / 2)) * t;
                const stripWidth = currRight - currLeft;

                // Source coordinates with sub-pixel precision
                const srcY = sy + (sHeight * t);
                const srcH = sHeight / strips;

                // Slight overlap to prevent gaps
                const overlap = 0.5;
                const adjustedStripHeight = stripHeight + overlap;
                const adjustedY = y - (overlap / 2);

                offscreenCtx.drawImage(
                    image,
                    sx, srcY, sWidth, srcH,
                    currLeft, adjustedY, stripWidth, adjustedStripHeight
                );
            }
        } else {
            offscreenCtx.drawImage(image, sx, sy, sWidth, sHeight, -dWidth * scaleX / 2, -dHeight * scaleY / 2, dWidth * scaleX, dHeight * scaleY);
        }
        offscreenCtx.restore();
    }

    // Now draw the filtered image to the main canvas with clipping
    ctx.save();
    clipPathFn(ctx, pathWidth, pathHeight);
    ctx.clip();
    ctx.globalCompositeOperation = settings.currentBlendMode;
    ctx.globalAlpha = settings.currentImageOpacity;
    ctx.drawImage(offscreenCanvas, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;
    ctx.restore();
}

// --- Download Button State Management ---
function showDownloadLoading() {
    downloadButton.disabled = true;
    downloadButtonText.style.opacity = '0';
    downloadSpinner.classList.add('active');
}

export function hideDownloadLoading() {
    downloadButton.disabled = false;
    downloadButtonText.style.opacity = '1';
    downloadSpinner.classList.remove('active');
}

export function showCanvas() {
    canvas.classList.remove('hidden');
    canvasPlaceholder.classList.add('hidden');
    // Make overlay available for drag feedback but keep it transparent
    if (canvasOverlay) {
        canvasOverlay.classList.remove('hidden');
        canvasOverlay.style.opacity = '0';
    }
}

export function hideCanvas() {
    canvas.classList.add('hidden');
    canvasPlaceholder.classList.remove('hidden');
    if (canvasOverlay) {
        canvasOverlay.classList.add('hidden');
        canvasOverlay.style.opacity = '0';
    }
}

// --- Main Drawing Routine ---
export function drawFolderIcon() {
    showDownloadLoading(); // Show loading state on download button
    showCanvas(); // Show canvas when drawing

    // Defer drawing to allow the loading message to update in the UI
    setTimeout(() => {
        try {
            // Clear canvas with high quality settings
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Enable maximum quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.textRendering = 'optimizeLegibility';

            // Enable sub-pixel rendering for smoother edges
            ctx.save();
            ctx.translate(0.5, 0.5); // Sub-pixel offset for crisper lines

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Calculate padding needed for shadow and border
            const maxShadowEffect = settings.dropShadowEnabled ? (settings.shadowBlur + Math.max(Math.abs(settings.shadowOffsetX), Math.abs(settings.shadowOffsetY))) : 0;
            const basePadding = settings.borderWidth > 0 ? settings.borderWidth : 2; // Minimum padding for border
            const shadowPadding = Math.max(basePadding, maxShadowEffect + basePadding) * 1.5; // Padding based on max shadow/border size

            const effW = canvasWidth - shadowPadding;
            const effH = canvasHeight - shadowPadding;

            // Translate context to center the drawing within the padded area
            const translateX = shadowPadding / 2;
            const translateY = shadowPadding / 2;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the entire canvas
            ctx.save(); // Save initial canvas state (for translation)
            ctx.translate(translateX, translateY); // Apply translation

            ctx.lineJoin = 'round'; // For crisp corners on paths
            ctx.lineCap = 'round'; // For ends of lines (though not strictly needed here)

            // Helper functions for shadow drawing
            function applyShadow() {
                if (settings.dropShadowEnabled) {
                    const r = parseInt(settings.shadowColor.slice(1, 3), 16); const g = parseInt(settings.shadowColor.slice(3, 5), 16);
                    const b = parseInt(settings.shadowColor.slice(5, 7), 16);
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${settings.shadowOpacity})`;
                    ctx.shadowBlur = settings.shadowBlur; ctx.shadowOffsetX = settings.shadowOffsetX; ctx.shadowOffsetY = settings.shadowOffsetY;
                }
            }
            function clearShadow() {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }

            // --- Draw Back Part of the Folder ---
            ctx.save(); // Save context specifically for back part drawing
            clearShadow(); // Clear any existing shadows before drawing this shape
            defineFolderBackPath(ctx, effW, effH); // Define the path for the back part

            // Fill back part with gradient or solid color
            if (settings.backGradientStops && settings.backGradientStops.length > 1) {
                const offsetY = (settings.backGradientOffsetY || 0) * effH / 100; // Calculate Y offset for gradient
                const gradPoints = getGradientPoints(settings.backGradientAngle, effW, effH, settings.backGradientSpread, offsetY);
                const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                settings.backGradientStops.forEach((color, idx, arr) => { grad.addColorStop(idx / (arr.length - 1 || 1), color); });
                ctx.fillStyle = grad;
            } else { ctx.fillStyle = settings.backGradientStops[0] || '#313244'; }
            ctx.fill(); // Apply fill

            // Draw image on the back part, clipped to its shape
            drawClippedImage(ctx, loadedImage, effW, effH, defineFolderBackPath);

            // Apply shadow and draw border for the back part
            applyShadow(); // Apply shadow for the stroke
            defineFolderBackPath(ctx, effW, effH); // Re-define path for stroke (important for shadow to apply correctly)
            ctx.lineWidth = settings.borderWidth; // Set border width
            if (settings.borderWidth > 0) {
                // Stroke with gradient or solid color
                if (settings.borderGradientStops && settings.borderGradientStops.length > 1) {
                    const offsetY = (settings.borderGradientOffsetY || 0) * effH / 100;
                    const gradPoints = getGradientPoints(settings.borderGradientAngle, effW, effH, settings.borderGradientSpread, offsetY);
                    const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                    settings.borderGradientStops.forEach((color, idx, arr) => { grad.addColorStop(idx / (arr.length - 1 || 1), color); });
                    ctx.strokeStyle = grad;
                } else { ctx.strokeStyle = settings.borderGradientStops[0] || '#cba6f7'; }
                ctx.stroke();
            }

            // Draw highlight on the back part's border
            if (settings.highlightStrength > 0 && settings.borderWidth > 1) {
                clearShadow(); defineFolderBackPath(ctx, effW, effH);
                ctx.lineWidth = Math.max(1, settings.borderWidth / 3);
                ctx.strokeStyle = `rgba(255, 255, 255, ${settings.highlightStrength})`; ctx.stroke();
            }
            ctx.restore();


            // --- Draw Front Part of the Folder ---
            ctx.save(); // Save context specifically for front part drawing
            clearShadow(); // Clear any existing shadows
            defineFolderFrontPath(ctx, effW, effH); // Define the path for the front part

            // Fill front part with gradient or solid color
             if (settings.frontGradientStops && settings.frontGradientStops.length > 1) {
                const offsetY = (settings.frontGradientOffsetY || 0) * effH / 100;
                const gradPoints = getGradientPoints(settings.frontGradientAngle, effW, effH, settings.frontGradientSpread, offsetY);
                const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                settings.frontGradientStops.forEach((color, idx, arr) => { grad.addColorStop(idx / (arr.length - 1 || 1), color); });
                ctx.fillStyle = grad;
            } else { ctx.fillStyle = settings.frontGradientStops[0] || '#45475a'; }
            ctx.fill();

            // Draw image on the front part, clipped to its shape
            drawClippedImage(ctx, loadedImage, effW, effH, defineFolderFrontPath);

            // Apply shadow and draw border for the front part
            applyShadow();
            defineFolderFrontPath(ctx, effW, effH); // Re-define path for stroke
            ctx.lineWidth = settings.borderWidth;
            if (settings.borderWidth > 0) {
                 if (settings.borderGradientStops && settings.borderGradientStops.length > 1) {
                    const offsetY = (settings.borderGradientOffsetY || 0) * effH / 100;
                    const gradPoints = getGradientPoints(settings.borderGradientAngle, effW, effH, settings.borderGradientSpread, offsetY);
                    const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                    settings.borderGradientStops.forEach((color, idx, arr) => { grad.addColorStop(idx / (arr.length - 1 || 1), color); });
                    ctx.strokeStyle = grad;
                } else { ctx.strokeStyle = settings.borderGradientStops[0] || '#cba6f7'; }
                ctx.stroke();
            }

            // Draw highlight on the front part's border
             if (settings.highlightStrength > 0 && settings.borderWidth > 1) {
                clearShadow(); defineFolderFrontPath(ctx, effW, effH);
                ctx.lineWidth = Math.max(1, settings.borderWidth / 3);
                ctx.strokeStyle = `rgba(255, 255, 255, ${settings.highlightStrength})`; ctx.stroke();
            }
            ctx.restore();

            ctx.restore(); // Restore initial canvas state (translation)
            ctx.restore(); // Restore sub-pixel translation

            // Make the canvas visible and update the download link
            showCanvas();

            const dataURL = canvas.toDataURL('image/png');
            downloadLink.href = dataURL;
            hideDownloadLoading(); // Enable download button after successful generation

        } catch (error) {
            console.error("Error generating icon:", error);
            canvas.classList.add('hidden'); // Hide canvas on error
            hideDownloadLoading(); // Enable download button even on error
         }
    }, 10); // Short delay to ensure UI updates before heavy drawing
}

// --- File Handling Function ---
export function handleFile(file) {
    if (!file) {
        setMessage('No file provided.', 'error');
        return;
    }
    if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select/drop an image file.', 'error');
        fileNameDisplay.textContent = 'No file chosen';
        imageInput.value = '';
        return;
    }
    fileNameDisplay.textContent = file.name;
    setMessage('⏳ Loading image...', 'loading');
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            setLoadedImage(img, (e.target!.result as string).split(',')[1]);
            setMessage('✅ Image loaded. Generating icon...', 'success');
            drawFolderIcon(); // Draw immediately after image loads
        };
        img.onerror = () => {
            setMessage('❌ Error loading image data.', 'error');
            fileNameDisplay!.textContent = 'No file chosen';
            resetLoadedImage();
        };
        img.src = e.target!.result as string;
    };
    reader.onerror = () => {
        setMessage('❌ Error reading file.', 'error');
        fileNameDisplay!.textContent = 'No file chosen';
    };
    reader.readAsDataURL(file);
}

// --- Event Listeners (moved to events.js) ---
// document.addEventListener('DOMContentLoaded', () => { ... });
// imageInput.addEventListener('change', handleImageUpload);
// ... and all other event listeners ...

// --- Initialization (will be in events.js or a main app.js if created) ---
// loadSettings();
// updateControlsFromState();
// drawFolderIcon();
// updateCustomPresetsUI();
// ['front', 'back', 'border'].forEach(renderGradientStopsUI);
// renderShadowControls();

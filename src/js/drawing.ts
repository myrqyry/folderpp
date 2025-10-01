// Drawing Functions
// Contains all canvas drawing logic for the folder icon generator
import { canvas, ctx } from './dom-elements.js';
import { settings, loadedImage, TAB_HEIGHT, BACK_PANEL_INSET } from './state.js';
import { setMessage, debounce } from './utils.js';
import { renderGradientStopsUI } from './gradients.js';
// Canvas control functions
export function showCanvas() {
    const canvasPlaceholder = document.getElementById('canvasPlaceholder');
    const canvasOverlay = document.getElementById('canvasOverlay');
    if (canvas) canvas.classList.remove('hidden');
    if (canvasPlaceholder) canvasPlaceholder.classList.add('hidden');
    // Make overlay available for drag feedback but keep it transparent
    if (canvasOverlay) {
        canvasOverlay.classList.remove('hidden');
        canvasOverlay.style.opacity = '0';
    }
}
export function hideCanvas() {
    const canvasPlaceholder = document.getElementById('canvasPlaceholder');
    const canvasOverlay = document.getElementById('canvasOverlay');
    if (canvas) canvas.classList.add('hidden');
    if (canvasPlaceholder) canvasPlaceholder.classList.remove('hidden');
    if (canvasOverlay) {
        canvasOverlay.classList.add('hidden');
        canvasOverlay.style.opacity = '0';
    }
}
// Download button state management
export function showDownloadLoading() {
    const downloadButton = document.getElementById('downloadButton');
    const downloadButtonText = document.getElementById('downloadButtonText');
    const downloadSpinner = document.getElementById('downloadSpinner');
    if (downloadButton) downloadButton.disabled = true;
    if (downloadButtonText) downloadButtonText.style.opacity = '0';
    if (downloadSpinner) downloadSpinner.classList.add('active');
}
export function hideDownloadLoading() {
    const downloadButton = document.getElementById('downloadButton');
    const downloadButtonText = document.getElementById('downloadButtonText');
    const downloadSpinner = document.getElementById('downloadSpinner');
    if (downloadButton) downloadButton.disabled = false;
    if (downloadButtonText) downloadButtonText.style.opacity = '1';
    if (downloadSpinner) downloadSpinner.classList.remove('active');
}
// Helper function to get gradient points based on angle, spread, and offset
function getGradientPoints(angle, width, height, spread = 100, offsetY = 0) {
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    // Base diagonal length
    const diagonal = Math.sqrt(width * width + height * height);
    const length = (diagonal * spread) / 100;
    // Center point with Y offset
    const centerX = width / 2;
    const centerY = height / 2 + offsetY;
    // Calculate start and end points
    const halfLength = length / 2;
    const x0 = centerX - cos * halfLength;
    const y0 = centerY - sin * halfLength;
    const x1 = centerX + cos * halfLength;
    const y1 = centerY + sin * halfLength;
    return { x0, y0, x1, y1 };
}
// Define the path for the folder's back part
function defineFolderBackPath(ctx, width, height) {
    const backWidth = width - BACK_PANEL_INSET;
    const backHeight = height - BACK_PANEL_INSET;
    const cornerRadius = Math.min(settings.cornerRadius, backWidth / 4, backHeight / 4);
    ctx.beginPath();
    ctx.roundRect(BACK_PANEL_INSET, BACK_PANEL_INSET, backWidth, backHeight, cornerRadius);
}
// Define the path for the folder's front part
function defineFolderFrontPath(ctx, width, height) {
    const frontHeight = height - settings.frontPartOffsetY;
    const cornerRadius = Math.min(settings.cornerRadius, width / 4, frontHeight / 4);
    const tabWidth = Math.min(settings.dynamicTabWidth, width * 0.8);
    const tabOffset = Math.max(0, Math.min(settings.dynamicTabOffset, width - tabWidth));
    ctx.beginPath();
    // Main body of the folder (rounded rectangle)
    ctx.roundRect(0, settings.frontPartOffsetY, width, frontHeight, cornerRadius);
    // Tab on the front part
    const tabX = tabOffset;
    const tabY = settings.frontPartOffsetY - TAB_HEIGHT;
    const tabCornerRadius = Math.min(cornerRadius / 2, TAB_HEIGHT / 2);
    // Only draw tab if it fits within bounds
    if (tabY >= 0 && tabX + tabWidth <= width) {
        ctx.roundRect(tabX, tabY, tabWidth, TAB_HEIGHT, [tabCornerRadius, tabCornerRadius, 0, 0]);
    }
}
// Draw image clipped to a specific path
function drawClippedImage(ctx, image, pathWidth, pathHeight, clipPathFn) {
    if (!image || !settings.currentImageOpacity || settings.currentImageOpacity === 0) return;
    // Create offscreen canvas for applying filters
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = pathWidth;
    offscreenCanvas.height = pathHeight;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    // Calculate scaling and positioning
    let dx = 0, dy = 0, dWidth = pathWidth, dHeight = pathHeight;
    let sx = 0, sy = 0, sWidth = image.width, sHeight = image.height;
    const imgAspect = image.width / image.height;
    const areaAspect = pathWidth / pathHeight;
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
        const contrast = settings.imageContrast || 100;
        const saturation = settings.imageSaturation || 100;

        // Combine brightness and highlight into a single value
        const highlightAdjustment = settings.highlightStrength ? settings.highlightStrength * 50 : 0;
        const totalBrightness = (settings.imageBrightness || 100) + highlightAdjustment;

        let filterString = '';
        if (blur > 0) filterString += `blur(${blur}px) `;
        if (totalBrightness !== 100) filterString += `brightness(${totalBrightness}%) `;
        if (contrast !== 100) filterString += `contrast(${contrast}%) `;
        if (saturation !== 100) filterString += `saturate(${saturation}%) `;
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
            const halfTaperPx = (taper / 100) * fitWidth / 2;
            const topWidth = fitWidth + halfTaperPx;
            const bottomWidth = fitWidth - halfTaperPx;

            // Enable high-quality rendering
            offscreenCtx.imageSmoothingEnabled = true;
            offscreenCtx.imageSmoothingQuality = 'high';

            for (let i = 0; i < strips; i++) {
                const t = i / (strips - 1);
                const nextT = (i + 1) / (strips - 1);

                // Use floating-point precision for smoother positioning
                const y = -fitHeight / 2 + (fitHeight * t);
                const nextY = -fitHeight / 2 + (fitHeight * nextT);
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
    // Draw the filtered image to the main canvas with clipping
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
// Update UI controls from current state
export const debouncedDrawFolderIcon = debounce(drawFolderIcon, 50);

export function updateControlsFromState() {
    // Helper to update a slider and its value display
    const updateSlider = (sliderId: string, valueId: string, value: number, unit: string = '') => {
        const slider = document.getElementById(sliderId) as HTMLInputElement;
        if (slider) slider.value = String(value);
        const valueDisplay = document.getElementById(valueId);
        if (valueDisplay) valueDisplay.textContent = `${value}${unit}`;
    };

    // Shape controls
    updateSlider('strokeWidthSlider', 'strokeWidthValue', settings.borderWidth);
    updateSlider('cornerRadiusSlider', 'cornerRadiusValue', settings.cornerRadius);
    updateSlider('taperAmountSlider', 'taperAmountValue', settings.taperAmount);
    updateSlider('frontOffsetYSlider', 'frontOffsetYValue', settings.frontPartOffsetY);
    updateSlider('tabWidthSlider', 'tabWidthValue', settings.dynamicTabWidth);
    updateSlider('tabOffsetSlider', 'tabOffsetValue', settings.dynamicTabOffset);

    // Colors - Render dynamic UI
    renderGradientStopsUI('front');
    renderGradientStopsUI('back');
    renderGradientStopsUI('border');

    // Gradient controls
    updateSlider('frontGradientAngle', 'frontGradientAngleValue', settings.frontGradientAngle, '°');
    updateSlider('frontGradientSpread', 'frontGradientSpreadValue', settings.frontGradientSpread, '%');

    // Image & Effects controls
    updateSlider('imageOpacitySlider', 'imageOpacityValue', Math.round(settings.currentImageOpacity * 100), '%');
    updateSlider('highlightStrengthSlider', 'highlightStrengthValue', Math.round(settings.highlightStrength * 100), '%');

    const imageFitSelect = document.getElementById('imageFitSelect') as HTMLSelectElement;
    if (imageFitSelect) imageFitSelect.value = settings.imageFit;

    const blendModeSelect = document.getElementById('blendModeSelect') as HTMLSelectElement;
    if (blendModeSelect) blendModeSelect.value = settings.currentBlendMode;

    // Image filter controls
    updateSlider('imageBlurSlider', 'imageBlurValue', settings.imageBlur, 'px');
    updateSlider('imageBrightnessSlider', 'imageBrightnessValue', settings.imageBrightness, '%');
    updateSlider('imageContrastSlider', 'imageContrastValue', settings.imageContrast, '%');
    updateSlider('imageSaturationSlider', 'imageSaturationValue', settings.imageSaturation, '%');

    // Image transform controls
    updateSlider('imageScaleXSlider', 'imageScaleXValue', settings.imageScaleX, '%');
    updateSlider('imageScaleYSlider', 'imageScaleYValue', settings.imageScaleY, '%');
    updateSlider('imageOffsetXSlider', 'imageOffsetXValue', settings.imageOffsetX, 'px');
    updateSlider('imageOffsetYSlider', 'imageOffsetYValue', settings.imageOffsetY, 'px');
    updateSlider('imageRotationSlider', 'imageRotationValue', settings.imageRotation, '°');

    // Shadow controls
    const shadowToggle = document.getElementById('shadowToggle') as HTMLInputElement;
    if (shadowToggle) shadowToggle.checked = settings.dropShadowEnabled;
}
// Main drawing function
export function drawFolderIcon() {
    if (!ctx || !canvas) {
        console.error('Canvas or context not available');
        return;
    }
    showDownloadLoading();
    showCanvas();
    // Defer drawing to allow UI updates
    setTimeout(() => {
        try {
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            // Calculate padding for shadow and border
            const maxShadowEffect = settings.dropShadowEnabled ?
                (settings.shadowBlur + Math.max(Math.abs(settings.shadowOffsetX), Math.abs(settings.shadowOffsetY))) : 0;
            const basePadding = settings.borderWidth > 0 ? settings.borderWidth : 2;
            const shadowPadding = Math.max(basePadding, maxShadowEffect + basePadding) * 1.5;
            const effW = canvasWidth - shadowPadding;
            const effH = canvasHeight - shadowPadding;
            // Center the drawing within the padded area
            const translateX = shadowPadding / 2;
            const translateY = shadowPadding / 2;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.save();
            ctx.translate(translateX, translateY);
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            // Shadow helper functions
            function applyShadow() {
                if (settings.dropShadowEnabled) {
                    const r = parseInt(settings.shadowColor.slice(1, 3), 16);
                    const g = parseInt(settings.shadowColor.slice(3, 5), 16);
                    const b = parseInt(settings.shadowColor.slice(5, 7), 16);
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${settings.shadowOpacity})`;
                    ctx.shadowBlur = settings.shadowBlur;
                    ctx.shadowOffsetX = settings.shadowOffsetX;
                    ctx.shadowOffsetY = settings.shadowOffsetY;
                }
            }
            function clearShadow() {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
            // Draw back part
            ctx.save();
            clearShadow();
            defineFolderBackPath(ctx, effW, effH);
            // Fill back part with gradient or solid color
            if (settings.backGradientStops && settings.backGradientStops.length > 1) {
                const offsetY = (settings.backGradientOffsetY || 0) * effH / 100;
                const gradPoints = getGradientPoints(settings.backGradientAngle, effW, effH, settings.backGradientSpread, offsetY);
                const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                settings.backGradientStops.forEach((color, idx, arr) => {
                    grad.addColorStop(idx / (arr.length - 1 || 1), color);
                });
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = settings.backGradientStops[0] || '#313244';
            }
            ctx.fill();
            // Draw clipped image on back part
            drawClippedImage(ctx, loadedImage, effW, effH, defineFolderBackPath);
            // Apply shadow and draw border for back part
            applyShadow();
            defineFolderBackPath(ctx, effW, effH);
            ctx.lineWidth = settings.borderWidth;
            if (settings.borderWidth > 0) {
                if (settings.borderGradientStops && settings.borderGradientStops.length > 1) {
                    const offsetY = (settings.borderGradientOffsetY || 0) * effH / 100;
                    const gradPoints = getGradientPoints(settings.borderGradientAngle, effW, effH, settings.borderGradientSpread, offsetY);
                    const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                    settings.borderGradientStops.forEach((color, idx, arr) => {
                        grad.addColorStop(idx / (arr.length - 1 || 1), color);
                    });
                    ctx.strokeStyle = grad;
                } else {
                    ctx.strokeStyle = settings.borderGradientStops[0] || '#cba6f7';
                }
                ctx.stroke();
            }
            // Draw highlight on back part
            if (settings.highlightStrength > 0 && settings.borderWidth > 1) {
                clearShadow();
                defineFolderBackPath(ctx, effW, effH);
                ctx.lineWidth = Math.max(1, settings.borderWidth / 3);
                ctx.strokeStyle = `rgba(255, 255, 255, ${settings.highlightStrength})`;
                ctx.stroke();
            }
            ctx.restore();
            // Draw front part
            ctx.save();
            clearShadow();
            defineFolderFrontPath(ctx, effW, effH);
            // Fill front part with gradient or solid color
            if (settings.frontGradientStops && settings.frontGradientStops.length > 1) {
                const offsetY = (settings.frontGradientOffsetY || 0) * effH / 100;
                const gradPoints = getGradientPoints(settings.frontGradientAngle, effW, effH, settings.frontGradientSpread, offsetY);
                const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                settings.frontGradientStops.forEach((color, idx, arr) => {
                    grad.addColorStop(idx / (arr.length - 1 || 1), color);
                });
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = settings.frontGradientStops[0] || '#45475a';
            }
            ctx.fill();
            // Draw clipped image on front part
            drawClippedImage(ctx, loadedImage, effW, effH, defineFolderFrontPath);
            // Apply shadow and draw border for front part
            applyShadow();
            defineFolderFrontPath(ctx, effW, effH);
            ctx.lineWidth = settings.borderWidth;
            if (settings.borderWidth > 0) {
                if (settings.borderGradientStops && settings.borderGradientStops.length > 1) {
                    const offsetY = (settings.borderGradientOffsetY || 0) * effH / 100;
                    const gradPoints = getGradientPoints(settings.borderGradientAngle, effW, effH, settings.borderGradientSpread, offsetY);
                    const grad = ctx.createLinearGradient(gradPoints.x0, gradPoints.y0, gradPoints.x1, gradPoints.y1);
                    settings.borderGradientStops.forEach((color, idx, arr) => {
                        grad.addColorStop(idx / (arr.length - 1 || 1), color);
                    });
                    ctx.strokeStyle = grad;
                } else {
                    ctx.strokeStyle = settings.borderGradientStops[0] || '#cba6f7';
                }
                ctx.stroke();
            }
            // Draw highlight on front part
            if (settings.highlightStrength > 0 && settings.borderWidth > 1) {
                clearShadow();
                defineFolderFrontPath(ctx, effW, effH);
                ctx.lineWidth = Math.max(1, settings.borderWidth / 3);
                ctx.strokeStyle = `rgba(255, 255, 255, ${settings.highlightStrength})`;
                ctx.stroke();
            }
            ctx.restore();
            ctx.restore(); // Restore initial canvas state
            // Update download link
            const downloadLink = document.getElementById('downloadLink');
            if (downloadLink && canvas) {
                const dataURL = canvas.toDataURL('image/png');
                downloadLink.href = dataURL;
            }
            hideDownloadLoading();
        } catch (error) {
            console.error("Error generating icon:", error);
            setMessage('❌ Error generating icon', 'error');
            hideCanvas();
            hideDownloadLoading();
        }
    }, 10);
}

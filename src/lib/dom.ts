// Import GSAP for smooth animations
import { gsap } from 'gsap';
import { useAppStore } from './state';
import { renderGradientStopsUI } from './gradients';
import { setMessage } from './utils';

// --- Get DOM Elements ---
export const imageInput = document.getElementById('imageInput') as HTMLInputElement;
export const fileNameDisplay = document.getElementById('fileName') as HTMLElement;
export const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
export const canvas = document.getElementById('outputCanvas') as HTMLCanvasElement;
export const messageArea = document.getElementById('messageArea') as HTMLElement;
export const canvasPlaceholder = document.getElementById('canvasPlaceholder') as HTMLElement;
export const canvasOverlay = document.getElementById('canvasOverlay') as HTMLElement;
export const dropZone = document.getElementById('dropZone') as HTMLElement;
export const customPresetsContainer = document.getElementById('customPresetsContainer') as HTMLElement;
export const customPresetsList = document.getElementById('customPresetsList') as HTMLElement;
export const shadowPreview = document.getElementById('shadowPreview') as HTMLElement;
export const shadowToggle = document.getElementById('shadowToggle') as HTMLInputElement;

// --- Animation Functions ---
export function animateCanvasIn() {
    if (canvas) {
        gsap.fromTo(canvas, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
    }
}

export function animateMessageArea() {
    if (messageArea) {
        gsap.fromTo(messageArea, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    }
}

// --- DOM Update and Drawing functions ---
export function updateControlsFromState() {
    const { settings } = useAppStore.getState();

    // Helper to update a slider and its value display
    const updateSlider = (sliderId: string, valueId: string, value: number, unit: string = '') => {
        const slider = document.getElementById(sliderId) as HTMLInputElement;
        const valueDisplay = document.getElementById(valueId) as HTMLElement;
        if (slider) slider.value = String(value);
        if (valueDisplay) valueDisplay.textContent = `${Math.round(value)}${unit}`;
    };

    // Shape
    updateSlider('strokeWidthSlider', 'strokeWidthValue', settings.borderWidth, 'px');
    updateSlider('cornerRadiusSlider', 'cornerRadiusValue', settings.cornerRadius, 'px');
    updateSlider('taperAmountSlider', 'taperAmountValue', settings.taperAmount, 'px');
    updateSlider('frontOffsetYSlider', 'frontOffsetYValue', settings.frontPartOffsetY, 'px');
    updateSlider('tabWidthSlider', 'tabWidthValue', settings.dynamicTabWidth, 'px');
    updateSlider('tabOffsetSlider', 'tabOffsetValue', settings.dynamicTabOffset, 'px');

    // Colors - Render dynamic UI
    renderGradientStopsUI('front');
    renderGradientStopsUI('back');
    renderGradientStopsUI('border');

    // Image & Effects
    updateSlider('highlightStrengthSlider', 'highlightStrengthValue', settings.highlightStrength * 100, '%');
    updateSlider('imageOpacitySlider', 'imageOpacityValue', settings.currentImageOpacity * 100, '%');
    const imageFitSelect = document.getElementById('imageFitSelect') as HTMLSelectElement;
    if (imageFitSelect) imageFitSelect.value = settings.imageFit;
    const blendModeSelect = document.getElementById('blendModeSelect') as HTMLSelectElement;
    if (blendModeSelect) blendModeSelect.value = settings.currentBlendMode;

    // Image Filter
    updateSlider('imageBlurSlider', 'imageBlurValue', settings.imageBlur || 0, 'px');
    updateSlider('imageBrightnessSlider', 'imageBrightnessValue', settings.imageBrightness || 100, '%');
    updateSlider('imageContrastSlider', 'imageContrastValue', settings.imageContrast || 100, '%');
    updateSlider('imageSaturationSlider', 'imageSaturationValue', settings.imageSaturation || 100, '%');

    // Image Transform
    updateSlider('imageScaleXSlider', 'imageScaleXValue', settings.imageScaleX || 100, '%');
    updateSlider('imageScaleYSlider', 'imageScaleYValue', settings.imageScaleY || 100, '%');
    updateSlider('imageOffsetXSlider', 'imageOffsetXValue', settings.imageOffsetX || 0, 'px');
    updateSlider('imageOffsetYSlider', 'imageOffsetYValue', settings.imageOffsetY || 0, 'px');
    updateSlider('imageSkewXSlider', 'imageSkewXValue', settings.imageSkewX || 0, '°');
    updateSlider('imageSkewYSlider', 'imageSkewYValue', settings.imageSkewY || 0, '°');
    updateSlider('imageSkewZSlider', 'imageSkewZValue', settings.imageSkewZ || 0, '');
    updateSlider('imageRotationSlider', 'imageRotationValue', settings.imageRotation || 0, '°');

    // Shadow
    if (shadowToggle) shadowToggle.checked = settings.dropShadowEnabled;
    const shadowColorPicker = document.getElementById('shadowColorPicker') as HTMLInputElement;
    if (shadowColorPicker) shadowColorPicker.value = settings.shadowColor;
    updateSlider('shadowBlurSlider', 'shadowBlurValue', settings.shadowBlur, 'px');
    updateSlider('shadowOffsetXSlider', 'shadowOffsetXValue', settings.shadowOffsetX, 'px');
    updateSlider('shadowOffsetYSlider', 'shadowOffsetYValue', settings.shadowOffsetY, 'px');
    updateSlider('shadowOpacitySlider', 'shadowOpacityValue', settings.shadowOpacity * 100, '%');
    updateSlider('shadowSpreadSlider', 'shadowSpreadValue', settings.shadowSpread || 0, 'px');
}

export function resetTransformValues() {
    useAppStore.getState().updateSettings({
        imageScaleX: 100,
        imageScaleY: 100,
        imageOffsetX: 0,
        imageOffsetY: 0,
        imageSkewX: 0,
        imageSkewY: 0,
        imageSkewZ: 0,
        imageRotation: 0,
    });
    updateControlsFromState();
    // No need to call drawFolderIcon here as it will be called by the event listener that triggers this.
}

export function handleFile(file: File) {
    const { setLoadedImage, resetLoadedImage } = useAppStore.getState();
    if (!file) {
        setMessage('No file provided.', 'error');
        return;
    }
    if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select/drop an image file.', 'error');
        if(fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';
        if(imageInput) imageInput.value = '';
        return;
    }
    if(fileNameDisplay) fileNameDisplay.textContent = file.name;
    setMessage('⏳ Loading image...', 'info');
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            setLoadedImage(img, (e.target.result as string).split(',')[1]);
            setMessage('✅ Image loaded. Generating icon...', 'success');
            // The event listener in events.ts will call drawFolderIcon
        };
        img.onerror = () => {
            setMessage('❌ Error loading image data.', 'error');
            if(fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';
            resetLoadedImage();
        };
        img.src = e.target.result as string;
    };
    reader.onerror = () => {
        setMessage('❌ Error reading file.', 'error');
        if(fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';
    };
    reader.readAsDataURL(file);
}
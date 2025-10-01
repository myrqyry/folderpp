// DOM Element References
// All DOM element selections in one place for better maintainability
// File Input and Display
export const imageInput = document.getElementById('imageInput') as HTMLInputElement | null;
export const fileNameDisplay = document.getElementById('fileName') as HTMLElement | null;
export const canvas = document.getElementById('outputCanvas') as HTMLCanvasElement | null;
export const messageArea = document.getElementById('messageArea') as HTMLElement | null;
export const canvasPlaceholder = document.getElementById('canvasPlaceholder') as HTMLElement | null;
export const canvasOverlay = document.getElementById('canvasOverlay') as HTMLElement | null;
export const dropZone = document.getElementById('dropZone') as HTMLElement | null;
// Download Controls
export const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement | null;
export const downloadButtonText = document.getElementById('downloadButtonText') as HTMLElement | null;
export const downloadSpinner = document.getElementById('downloadSpinner') as HTMLElement | null;
export const downloadSize = document.getElementById('downloadSize') as HTMLSelectElement | null;
export const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement | null;
// AI/Gemini Controls
export const suggestColorsFromImageButton = document.getElementById('suggestColorsFromImageButton') as HTMLButtonElement | null;
// Preset Controls
export const presetSelect = document.getElementById('presetSelect') as HTMLSelectElement | null;
export const loadPresetButton = document.getElementById('loadPresetButton') as HTMLButtonElement | null;
export const savePresetButton = document.getElementById('savePresetButton') as HTMLButtonElement | null;
export const customPresetsContainer = document.getElementById('customPresetsContainer') as HTMLElement | null;
export const customPresetsList = document.getElementById('customPresetsList') as HTMLElement | null;
// Quick Action Buttons
export const randomizeColorsBtn = document.getElementById('randomizeColorsBtn') as HTMLButtonElement | null;
export const resetToDefaultBtn = document.getElementById('resetToDefaultBtn') as HTMLButtonElement | null;
export const copySettingsBtn = document.getElementById('copySettingsBtn') as HTMLButtonElement | null;
export const pasteSettingsBtn = document.getElementById('pasteSettingsBtn') as HTMLButtonElement | null;
// Shape Controls
export const strokeWidthSlider = document.getElementById('strokeWidthSlider') as HTMLInputElement | null;
export const strokeWidthValue = document.getElementById('strokeWidthValue') as HTMLElement | null;
export const cornerRadiusSlider = document.getElementById('cornerRadiusSlider') as HTMLInputElement | null;
export const cornerRadiusValue = document.getElementById('cornerRadiusValue') as HTMLElement | null;
export const taperAmountSlider = document.getElementById('taperAmountSlider') as HTMLInputElement | null;
export const taperAmountValue = document.getElementById('taperAmountValue') as HTMLElement | null;
export const frontOffsetYSlider = document.getElementById('frontOffsetYSlider') as HTMLInputElement | null;
export const frontOffsetYValue = document.getElementById('frontOffsetYValue') as HTMLElement | null;
export const tabWidthSlider = document.getElementById('tabWidthSlider') as HTMLInputElement | null;
export const tabWidthValue = document.getElementById('tabWidthValue') as HTMLElement | null;
export const tabOffsetSlider = document.getElementById('tabOffsetSlider') as HTMLInputElement | null;
export const tabOffsetValue = document.getElementById('tabOffsetValue') as HTMLElement | null;
// Color Harmony Tools
export const complementaryBtn = document.getElementById('complementaryBtn') as HTMLButtonElement | null;
export const analogousBtn = document.getElementById('analogousBtn') as HTMLButtonElement | null;
export const triadicBtn = document.getElementById('triadicBtn') as HTMLButtonElement | null;
export const monochromaticBtn = document.getElementById('monochromaticBtn') as HTMLButtonElement | null;
// Image Effects Controls
export const imageOpacitySlider = document.getElementById('imageOpacitySlider') as HTMLInputElement | null;
export const imageOpacityValue = document.getElementById('imageOpacityValue') as HTMLElement | null;
export const imageFitSelect = document.getElementById('imageFitSelect') as HTMLSelectElement | null;
export const blendModeSelect = document.getElementById('blendModeSelect') as HTMLSelectElement | null;
export const highlightStrengthSlider = document.getElementById('highlightStrengthSlider') as HTMLInputElement | null;
export const highlightStrengthValue = document.getElementById('highlightStrengthValue') as HTMLElement | null;
// Image Filter Controls
export const imageBlurSlider = document.getElementById('imageBlurSlider') as HTMLInputElement | null;
export const imageBlurValue = document.getElementById('imageBlurValue') as HTMLElement | null;
export const imageBrightnessSlider = document.getElementById('imageBrightnessSlider') as HTMLInputElement | null;
export const imageBrightnessValue = document.getElementById('imageBrightnessValue') as HTMLElement | null;
export const imageContrastSlider = document.getElementById('imageContrastSlider') as HTMLInputElement | null;
export const imageContrastValue = document.getElementById('imageContrastValue') as HTMLElement | null;
export const imageSaturationSlider = document.getElementById('imageSaturationSlider') as HTMLInputElement | null;
export const imageSaturationValue = document.getElementById('imageSaturationValue') as HTMLElement | null;
// Image Transform Controls
export const imageScaleXSlider = document.getElementById('imageScaleXSlider') as HTMLInputElement | null;
export const imageScaleXValue = document.getElementById('imageScaleXValue') as HTMLElement | null;
export const imageScaleYSlider = document.getElementById('imageScaleYSlider') as HTMLInputElement | null;
export const imageScaleYValue = document.getElementById('imageScaleYValue') as HTMLElement | null;
export const imageOffsetXSlider = document.getElementById('imageOffsetXSlider') as HTMLInputElement | null;
export const imageOffsetXValue = document.getElementById('imageOffsetXValue') as HTMLElement | null;
export const imageOffsetYSlider = document.getElementById('imageOffsetYSlider') as HTMLInputElement | null;
export const imageOffsetYValue = document.getElementById('imageOffsetYValue') as HTMLElement | null;
export const imageSkewXSlider = document.getElementById('imageSkewXSlider') as HTMLInputElement | null;
export const imageSkewXValue = document.getElementById('imageSkewXValue') as HTMLElement | null;
export const imageSkewYSlider = document.getElementById('imageSkewYSlider') as HTMLInputElement | null;
export const imageSkewYValue = document.getElementById('imageSkewYValue') as HTMLElement | null;
export const imageSkewZSlider = document.getElementById('imageSkewZSlider') as HTMLInputElement | null;
export const imageSkewZValue = document.getElementById('imageSkewZValue') as HTMLElement | null;
export const imageRotationSlider = document.getElementById('imageRotationSlider') as HTMLInputElement | null;
export const imageRotationValue = document.getElementById('imageRotationValue') as HTMLElement | null;
export const resetTransformBtn = document.getElementById('resetTransformBtn') as HTMLButtonElement | null;
// Shadow Controls
export const shadowColorPicker = document.getElementById('shadowColorPicker') as HTMLInputElement | null;
export const shadowBlurSlider = document.getElementById('shadowBlurSlider') as HTMLInputElement | null;
export const shadowBlurValue = document.getElementById('shadowBlurValue') as HTMLElement | null;
export const shadowOffsetXSlider = document.getElementById('shadowOffsetXSlider') as HTMLInputElement | null;
export const shadowOffsetXValue = document.getElementById('shadowOffsetXValue') as HTMLElement | null;
export const shadowOffsetYSlider = document.getElementById('shadowOffsetYSlider') as HTMLInputElement | null;
export const shadowOffsetYValue = document.getElementById('shadowOffsetYValue') as HTMLElement | null;
export const shadowOpacitySlider = document.getElementById('shadowOpacitySlider') as HTMLInputElement | null;
export const shadowOpacityValue = document.getElementById('shadowOpacityValue') as HTMLElement | null;
export const shadowSpreadSlider = document.getElementById('shadowSpreadSlider') as HTMLInputElement | null;
export const shadowSpreadValue = document.getElementById('shadowSpreadValue') as HTMLElement | null;
// Shadow Preset Buttons
export const softShadowBtn = document.getElementById('softShadowBtn') as HTMLButtonElement | null;
export const hardShadowBtn = document.getElementById('hardShadowBtn') as HTMLButtonElement | null;
export const glowShadowBtn = document.getElementById('glowShadowBtn') as HTMLButtonElement | null;
export const longShadowBtn = document.getElementById('longShadowBtn') as HTMLButtonElement | null;
export const innerShadowBtn = document.getElementById('innerShadowBtn') as HTMLButtonElement | null;
export const noShadowBtn = document.getElementById('noShadowBtn') as HTMLButtonElement | null;
// Advanced Shadow Elements
export const shadowPreview = document.getElementById('shadowPreview') as HTMLElement | null;
export const shadowToggle = document.getElementById('shadowToggle') as HTMLInputElement | null;
// Gradient Controls (these get dynamically generated)
export const frontGradientAngle = document.getElementById('frontGradientAngle') as HTMLInputElement | null;
export const frontGradientAngleValue = document.getElementById('frontGradientAngleValue') as HTMLElement | null;
export const frontGradientSpread = document.getElementById('frontGradientSpread') as HTMLInputElement | null;
export const frontGradientSpreadValue = document.getElementById('frontGradientSpreadValue') as HTMLElement | null;
export const frontGradientOffsetY = document.getElementById('frontGradientOffsetY') as HTMLInputElement | null;
export const frontGradientOffsetYValue = document.getElementById('frontGradientOffsetYValue') as HTMLElement | null;
export const backGradientAngle = document.getElementById('backGradientAngle') as HTMLInputElement | null;
export const backGradientAngleValue = document.getElementById('backGradientAngleValue') as HTMLElement | null;
export const backGradientSpread = document.getElementById('backGradientSpread') as HTMLInputElement | null;
export const backGradientSpreadValue = document.getElementById('backGradientSpreadValue') as HTMLElement | null;
export const backGradientOffsetY = document.getElementById('backGradientOffsetY') as HTMLInputElement | null;
export const backGradientOffsetYValue = document.getElementById('backGradientOffsetYValue') as HTMLElement | null;
export const borderGradientAngle = document.getElementById('borderGradientAngle') as HTMLInputElement | null;
export const borderGradientAngleValue = document.getElementById('borderGradientAngleValue') as HTMLElement | null;
export const borderGradientSpread = document.getElementById('borderGradientSpread') as HTMLInputElement | null;
export const borderGradientSpreadValue = document.getElementById('borderGradientSpreadValue') as HTMLElement | null;
export const borderGradientOffsetY = document.getElementById('borderGradientOffsetY') as HTMLInputElement | null;
export const borderGradientOffsetYValue = document.getElementById('borderGradientOffsetYValue') as HTMLElement | null;
// Canvas context
export const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D | null;

import { useAppStore } from '../state';
import { handleFile, downloadButton, imageInput, fileNameDisplay, dropZone, canvas, canvasOverlay } from '../dom';
import { setMessage } from '../utils';
import { updateAIColorsButtonState } from './ui-interactions';

export function setupFileHandling() {
    if (imageInput) {
        imageInput.addEventListener('change', (event) => {
            setMessage('');
            useAppStore.getState().resetLoadedImage();
            if(downloadButton) downloadButton.disabled = true;
            if(canvas) canvas.classList.add('hidden');
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                handleFile(file);
                setTimeout(() => updateAIColorsButtonState(), 100);
            } else {
                if(fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';
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
                if (canvasOverlay && !canvas?.classList.contains('hidden')) {
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
            useAppStore.getState().resetLoadedImage();
            if(downloadButton) downloadButton.disabled = true;
            if(canvas) canvas.classList.add('hidden');
            const files = (event as DragEvent).dataTransfer?.files;
            if (files && files.length > 0) {
                handleFile(files[0]);
                setTimeout(() => updateAIColorsButtonState(), 100);
                try {
                    if(imageInput) (imageInput as HTMLInputElement).files = files;
                } catch (e) {
                    console.warn("Could not set input files property directly for drag and drop.");
                }
            } else {
                if(fileNameDisplay) fileNameDisplay.textContent = 'No file chosen';
                updateAIColorsButtonState();
            }
        }, false);
        dropZone.addEventListener('click', (e) => {
            if (e.target !== imageInput && !(e.target as HTMLElement).closest('button')) {
                (imageInput as HTMLInputElement)?.click();
            }
        });
    }
}
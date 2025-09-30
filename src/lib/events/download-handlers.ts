import { useAppStore } from '../state';
import { animateCanvasIn } from '../dom';
import { setMessage } from '../utils';

const ICO_SIZE = 256;
const DEFAULT_DOWNLOAD_SIZE = 512;
const SUPER_SCALE_FACTOR = 2;

function downloadAsPNG(canvas: HTMLCanvasElement, downloadLink: HTMLAnchorElement, baseSize: number) {
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

function downloadAsICO(canvas: HTMLCanvasElement, downloadLink: HTMLAnchorElement) {
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

function downloadAsSVG(downloadLink: HTMLAnchorElement, baseSize: number) {
    const { settings } = useAppStore.getState();
    const border = settings.borderWidth;
    const corner = settings.cornerRadius;
    const tabW = settings.dynamicTabWidth;
    const tabO = settings.dynamicTabOffset;
    const tabH = 45;
    const frontY = settings.frontPartOffsetY;
    const width = baseSize;
    const height = baseSize;

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="backGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.backGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.backGradientStops[settings.backGradientStops.length-1]}"/>
    </linearGradient>
    <linearGradient id="frontGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.frontGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.frontGradientStops[settings.frontGradientStops.length-1]}"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${settings.borderGradientStops[0]}"/>
      <stop offset="100%" stop-color="${settings.borderGradientStops[settings.borderGradientStops.length-1]}"/>
    </linearGradient>
  </defs>
  <!-- Back panel -->
  <rect x="5" y="5" width="${width-10}" height="${height-10}" rx="${corner}" fill="url(#backGrad)"/>
  <!-- Front panel -->
  <rect x="0" y="${frontY}" width="${width}" height="${height-frontY}" rx="${corner}" fill="url(#frontGrad)"/>
  <!-- Tab -->
  <rect x="${tabO}" y="${frontY-tabH}" width="${tabW}" height="${tabH+corner}" rx="${Math.floor(corner/2)}" fill="url(#frontGrad)"/>
  <!-- Border -->
  <rect x="0" y="${frontY}" width="${width}" height="${height-frontY}" rx="${corner}" fill="none" stroke="url(#borderGrad)" stroke-width="${border}"/>
</svg>`;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `folder-icon.svg`;
    downloadLink.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
    setMessage(`✅ Icon downloaded as SVG!`, 'success');
}

function pngToIco(pngBuffers: Uint8Array[]): Blob {
    const png = pngBuffers[0];
    const header = new Uint8Array(6);
    header[0] = 0; header[1] = 0;
    header[2] = 1; header[3] = 0;
    header[4] = 1; header[5] = 0;
    const dir = new Uint8Array(16);
    dir[0] = 0;
    dir[1] = 0;
    dir[2] = 0;
    dir[3] = 0;
    dir[4] = 1; dir[5] = 0;
    dir[6] = 32; dir[7] = 0;
    const pngSize = png.length;
    dir[8] = pngSize & 0xFF;
    dir[9] = (pngSize >> 8) & 0xFF;
    dir[10] = (pngSize >> 16) & 0xFF;
    dir[11] = (pngSize >> 24) & 0xFF;
    dir[12] = 22; dir[13] = 0; dir[14] = 0; dir[15] = 0;
    const ico = new Uint8Array(6 + 16 + png.length);
    ico.set(header, 0);
    ico.set(dir, 6);
    ico.set(png, 22);
    return new Blob([ico], { type: 'image/x-icon' });
}

export function downloadIcon() {
    animateCanvasIn();
    const downloadSizeEl = document.getElementById('downloadSize') as HTMLSelectElement;
    const downloadFormatEl = document.getElementById('downloadFormat') as HTMLSelectElement;
    const downloadLink = document.getElementById('downloadLink') as HTMLAnchorElement;
    const canvas = document.getElementById('outputCanvas') as HTMLCanvasElement;
    if (!canvas || !downloadLink) {
        setMessage('❌ No icon to download. Please generate an icon first.', 'error');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setMessage('❌ Canvas context is not available.', 'error');
        return;
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some(pixel => pixel !== 0);
    if (!hasContent) {
        setMessage('❌ No icon to download. Please generate an icon first.', 'error');
        return;
    }
    try {
        const baseSize = parseInt(downloadSizeEl?.value || String(DEFAULT_DOWNLOAD_SIZE));
        const format = downloadFormatEl?.value || 'png';

        if (format === 'png') {
            downloadAsPNG(canvas, downloadLink, baseSize);
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
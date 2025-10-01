import { describe, it, expect } from 'vitest';

// These are placeholders for the actual color conversion functions.
// In a real test environment, these would be imported from '../src/lib/harmony'.
function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    h /= 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h * 12) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


describe('Color Conversion Utilities', () => {
  describe('hexToHsl', () => {
    it('should convert black correctly', () => {
      const [h, s, l] = hexToHsl('#000000');
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(0);
    });

    it('should convert white correctly', () => {
      const [h, s, l] = hexToHsl('#ffffff');
      expect(h).toBe(0);
      expect(s).toBe(0);
      expect(l).toBe(100);
    });

    it('should convert red correctly', () => {
      const [h, s, l] = hexToHsl('#ff0000');
      expect(h).toBeCloseTo(0);
      expect(s).toBeCloseTo(100);
      expect(l).toBeCloseTo(50);
    });
  });

  describe('hslToHex', () => {
    it('should convert black correctly', () => {
      const hex = hslToHex(0, 0, 0);
      expect(hex).toBe('#000000');
    });

    it('should convert white correctly', () => {
      const hex = hslToHex(0, 0, 100);
      expect(hex).toBe('#ffffff');
    });

    it('should convert red correctly', () => {
      const hex = hslToHex(0, 100, 50);
      expect(hex).toBe('#ff0000');
    });
  });

  describe('hexToHsl and hslToHex roundtrip', () => {
    it('should return the original color', () => {
      const originalHex = '#3498db';
      const [h, s, l] = hexToHsl(originalHex);
      const newHex = hslToHex(h, s, l);
      expect(newHex).toBe(originalHex);
    });
  });
});
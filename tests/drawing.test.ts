import { describe, it, expect } from 'vitest';

// This is a placeholder for the actual getGradientPoints function.
// In a real test environment, this would be imported from '../src/lib/drawing'.
const getGradientPoints = (angle, width, height, spread = 100, offsetY = 0) => {
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const diagonal = Math.sqrt(width * width + height * height);
    const length = (diagonal * spread) / 100;
    const centerX = width / 2;
    const centerY = height / 2 + offsetY;
    const halfLength = length / 2;
    const x0 = centerX - cos * halfLength;
    const y0 = centerY - sin * halfLength;
    const x1 = centerX + cos * halfLength;
    const y1 = centerY + sin * halfLength;
    return { x0, y0, x1, y1 };
};

describe('getGradientPoints', () => {
    it('should calculate gradient points correctly for a 0-degree angle', () => {
        const { x0, y0, x1, y1 } = getGradientPoints(0, 200, 100);
        expect(x0).toBeCloseTo(0);
        expect(y0).toBe(50);
        expect(x1).toBeCloseTo(200);
        expect(y1).toBe(50);
    });

    it('should calculate gradient points correctly for a 90-degree angle', () => {
        const { x0, y0, x1, y1 } = getGradientPoints(90, 200, 100);
        expect(x0).toBe(100);
        expect(y0).toBeCloseTo(0);
        expect(x1).toBe(100);
        expect(y1).toBeCloseTo(100);
    });

    it('should handle spread correctly', () => {
        const { x0, y0, x1, y1 } = getGradientPoints(0, 200, 100, 50);
        const expectedLength = 200 * 0.5;
        expect(x1 - x0).toBeCloseTo(expectedLength);
    });

    it('should handle offsetY correctly', () => {
        const { y0, y1 } = getGradientPoints(0, 200, 100, 100, 20);
        expect(y0).toBe(70);
        expect(y1).toBe(70);
    });
});
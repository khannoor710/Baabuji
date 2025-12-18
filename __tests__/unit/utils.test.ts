import { describe, it, expect } from 'vitest';
import { cn, formatPrice, slugify } from '@/lib/utils';

describe('Utils', () => {
  describe('cn() - className merger', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should handle Tailwind conflicts', () => {
      const result = cn('px-2 py-1', 'px-4');
      expect(result).toContain('px-4');
      expect(result).not.toContain('px-2');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });
  });

  describe('formatPrice()', () => {
    it('should format price in paise to INR currency', () => {
      expect(formatPrice(249900)).toBe('₹2,499.00');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('₹0.00');
    });

    it('should format large amounts correctly', () => {
      // Indian number format uses lakh/crore system: 99,99,999 not 9,999,999
      expect(formatPrice(999999900)).toBe('₹99,99,999.00');
    });

    it('should format small amounts with decimals', () => {
      expect(formatPrice(50)).toBe('₹0.50');
    });

    it('should maintain two decimal places', () => {
      expect(formatPrice(10000)).toBe('₹100.00');
      expect(formatPrice(12345)).toBe('₹123.45');
    });

    it('should handle fractional paise correctly', () => {
      expect(formatPrice(12399)).toBe('₹123.99');
      expect(formatPrice(12301)).toBe('₹123.01');
    });
  });

  describe('slugify()', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Cotton & Silk Fabric!')).toBe('cotton-silk-fabric');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Cotton   Solid    Fabric')).toBe('cotton-solid-fabric');
    });

    it('should handle leading and trailing spaces', () => {
      expect(slugify('  Cotton Fabric  ')).toBe('cotton-fabric');
    });

    it('should handle numbers', () => {
      expect(slugify('Product 123')).toBe('product-123');
    });

    it('should handle hyphens correctly', () => {
      expect(slugify('Pre-shrunk Fabric')).toBe('pre-shrunk-fabric');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle unicode characters', () => {
      expect(slugify('Café Fabric')).toBe('caf-fabric');
    });
  });
});

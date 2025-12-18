import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  addressSchema,
  productSchema,
  contactSchema,
  newsletterSchema,
} from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'password123',
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '12345',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+919876543210',
      };
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should accept registration without phone', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        password: 'password123',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should validate Indian phone number formats', () => {
      const testCases = [
        '+919876543210',
        '919876543210',
        '9876543210',
      ];

      testCases.forEach((phone) => {
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone,
        };
        expect(() => registerSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '1234567890', // Doesn't start with 6-9
        '98765432', // Too short
        '98765432101', // Too long
        'abcdefghij', // Not a number
      ];

      invalidPhones.forEach((phone) => {
        const data = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone,
        };
        expect(() => registerSchema.parse(data)).toThrow();
      });
    });
  });

  describe('addressSchema', () => {
    it('should validate correct address data', () => {
      const validData = {
        fullName: 'John Doe',
        phone: '9876543210',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      };
      expect(() => addressSchema.parse(validData)).not.toThrow();
    });

    it('should validate Indian postal code (6 digits)', () => {
      const validData = {
        fullName: 'John Doe',
        phone: '9876543210',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '110001',
        country: 'India',
      };
      expect(() => addressSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid postal codes', () => {
      const invalidPostalCodes = [
        '12345', // Too short
        '1234567', // Too long
        'ABCDEF', // Not numbers
        '400-001', // Has hyphen
      ];

      invalidPostalCodes.forEach((postalCode) => {
        const data = {
          fullName: 'John Doe',
          phone: '9876543210',
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode,
          country: 'India',
        };
        expect(() => addressSchema.parse(data)).toThrow();
      });
    });

    it('should accept optional addressLine2', () => {
      const validData = {
        fullName: 'John Doe',
        phone: '9876543210',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      };
      expect(() => addressSchema.parse(validData)).not.toThrow();
    });

    it('should default country to India', () => {
      const data = {
        fullName: 'John Doe',
        phone: '9876543210',
        addressLine1: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
      };
      const result = addressSchema.parse(data);
      expect(result.country).toBe('India');
    });
  });

  describe('productSchema', () => {
    it('should validate correct product data', () => {
      const validData = {
        name: 'Cotton Solid Fabric',
        description: 'Premium quality cotton fabric for unstitched clothing',
        category: 'MEN',
        fabricType: 'COTTON',
        pattern: 'SOLID',
        color: 'Blue',
        price: 249900, // ₹2,499.00 in paise
        stock: 100,
        isFeatured: false,
        tags: ['cotton', 'premium', 'breathable'],
      };
      expect(() => productSchema.parse(validData)).not.toThrow();
    });

    it('should reject price below minimum', () => {
      const invalidData = {
        name: 'Cotton Solid Fabric',
        description: 'Premium quality cotton fabric',
        category: 'MEN',
        fabricType: 'COTTON',
        pattern: 'SOLID',
        color: 'Blue',
        price: 25, // Less than ₹0.50
        stock: 100,
      };
      expect(() => productSchema.parse(invalidData)).toThrow();
    });

    it('should reject negative stock', () => {
      const invalidData = {
        name: 'Cotton Solid Fabric',
        description: 'Premium quality cotton fabric',
        category: 'MEN',
        fabricType: 'COTTON',
        pattern: 'SOLID',
        color: 'Blue',
        price: 249900,
        stock: -10,
      };
      expect(() => productSchema.parse(invalidData)).toThrow();
    });

    it('should validate all categories', () => {
      const categories = ['MEN', 'WOMEN', 'KIDS', 'UNISEX'];

      categories.forEach((category) => {
        const data = {
          name: 'Test Product',
          description: 'Test description for product',
          category,
          fabricType: 'COTTON',
          pattern: 'SOLID',
          color: 'Blue',
          price: 100000,
          stock: 50,
        };
        expect(() => productSchema.parse(data)).not.toThrow();
      });
    });

    it('should accept optional comparePrice', () => {
      const validData = {
        name: 'Cotton Solid Fabric',
        description: 'Premium quality cotton fabric',
        category: 'MEN',
        fabricType: 'COTTON',
        pattern: 'SOLID',
        color: 'Blue',
        price: 199900,
        comparePrice: 249900, // Original price
        stock: 100,
      };
      expect(() => productSchema.parse(validData)).not.toThrow();
    });
  });

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Product Inquiry',
        message: 'I would like to know more about your cotton fabrics.',
      };
      expect(() => contactSchema.parse(validData)).not.toThrow();
    });

    it('should reject short message', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Short msg', // Less than 20 characters
      };
      expect(() => contactSchema.parse(invalidData)).toThrow();
    });

    it('should reject short subject', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hi', // Less than 5 characters
        message: 'This is a longer message that meets the requirement.',
      };
      expect(() => contactSchema.parse(invalidData)).toThrow();
    });
  });

  describe('newsletterSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'user@example.com' };
      expect(() => newsletterSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = { email: 'invalid-email' };
      expect(() => newsletterSchema.parse(invalidData)).toThrow();
    });

    it('should accept various valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@sub.example.com',
      ];

      validEmails.forEach((email) => {
        expect(() => newsletterSchema.parse({ email })).not.toThrow();
      });
    });
  });
});

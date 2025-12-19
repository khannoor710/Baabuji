import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z
    .string()
    .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number')
    .optional(),
});

// Address validation schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid Indian phone number'),
  addressLine1: z.string().min(5, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'Invalid postal code (6 digits required)'),
  country: z.string().default('India'),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['MEN', 'WOMEN', 'KIDS', 'UNISEX']),
  fabricType: z.enum(['COTTON', 'LINEN', 'SILK', 'WOOL', 'POLYESTER', 'BLENDED']),
  pattern: z.enum(['SOLID', 'PRINTED', 'EMBROIDERED', 'STRIPED', 'CHECKS', 'FLORAL']),
  color: z.string().min(2, 'Color is required'),
  price: z.number().min(50, 'Price must be at least ₹0.50'), // In paise
  comparePrice: z.number().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// Review validation schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Checkout validation schema
export const checkoutSchema = z.object({
  shippingAddressId: z.string().cuid('Invalid shipping address'),
  billingAddressId: z.string().cuid('Invalid billing address'),
  paymentMethod: z.enum(['CARD', 'UPI', 'COD', 'NETBANKING']),
  notes: z.string().optional(),
});

// Password reset schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

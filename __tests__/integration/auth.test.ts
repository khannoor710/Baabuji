import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/prisma';
import * as emailService from '@/lib/email';

// Mock the email service
vi.spyOn(emailService, 'sendWelcomeEmail').mockResolvedValue({
  success: true,
  data: {} as any,
});

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser as any);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '9876543210',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('User created successfully');
      expect(data.user.email).toBe('john@example.com');
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        'john@example.com',
        'John Doe'
      );
    });

    it('should reject registration with existing email', async () => {
      const existingUser = {
        id: 'existing-user-id',
        email: 'john@example.com',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      });

      const response = await registerHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('already exists');
    });

    it('should reject registration with invalid data', async () => {
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'J', // Too short
          email: 'invalid-email',
          password: '123', // Too short
        }),
      });

      const response = await registerHandler(request);

      expect(response.status).toBe(400);
    });

    it('should validate Indian phone number format', async () => {
      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890', // Invalid (doesn't start with 6-9)
        }),
      });

      const response = await registerHandler(request);

      expect(response.status).toBe(400);
    });

    it('should hash password before storing', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const mockCreate = vi.mocked(prisma.user.create);
      mockCreate.mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
      } as any);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      });

      await registerHandler(request);

      expect(mockCreate).toHaveBeenCalled();
      const createCall = mockCreate.mock.calls[0][0];
      expect(createCall.data.password).not.toBe('password123');
      expect(createCall.data.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });

    it('should not block on welcome email failure', async () => {
      // Mock email to throw error
      vi.spyOn(emailService, 'sendWelcomeEmail').mockRejectedValue(
        new Error('Email service down')
      );

      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
      } as any);

      const request = new Request('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      });

      const response = await registerHandler(request);

      // Should still succeed even if email fails
      expect(response.status).toBe(201);
    });
  });
});

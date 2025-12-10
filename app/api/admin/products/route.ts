import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, Category, FabricType, Pattern } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const {
      name,
      slug,
      description,
      category,
      fabricType,
      pattern,
      color,
      price,
      comparePrice,
      stock,
      isActive,
      isFeatured,
      tags,
    } = body;

    // Validation
    if (!name || !slug || !description || !category || !fabricType || !pattern || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Invalid stock quantity' }, { status: 400 });
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        category: category as Category,
        fabricType: fabricType as FabricType,
        pattern: pattern as Pattern,
        color,
        price,
        comparePrice: comparePrice || null,
        stock,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        tags: tags || [],
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
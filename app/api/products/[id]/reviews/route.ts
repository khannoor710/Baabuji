import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validations';
import { logger } from '@/lib/logger';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to submit a review.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, title, comment } = reviewSchema.parse(body);

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        productId: params.id,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: params.id,
        userId: session.user.id,
        rating,
        title: title || null,
        comment,
        isPublished: true,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    logger.info('Review submitted', { productId: params.id, userId: session.user.id, rating });

    return NextResponse.json({ success: true, review, message: 'Thank you for your review!' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid review data', details: error.errors }, { status: 400 });
    }
    logger.error('Review submission error', error, { productId: params.id });
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId: params.id, isPublished: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where: { productId: params.id, isPublished: true } }),
    ]);

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return NextResponse.json({
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      statistics: { totalReviews: total, averageRating: Math.round(avgRating * 10) / 10 },
    });
  } catch (error) {
    logger.error('Fetch reviews error', error, { productId: params.id });
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
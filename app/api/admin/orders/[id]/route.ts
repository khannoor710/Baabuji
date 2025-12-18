import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, OrderStatus, PaymentStatus } from '@prisma/client';
import { logger } from '@/lib/logger';

// PATCH - Update order status
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    // Validation
    if (status && !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    if (paymentStatus && !Object.values(PaymentStatus).includes(paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build update data
    const updateData: {
      updatedAt: Date;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      trackingNumber?: string | null;
      shippedAt?: Date;
      deliveredAt?: Date;
      cancelledAt?: Date;
    } = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;

      // Set timestamps based on status
      if (status === OrderStatus.SHIPPED && !existingOrder.shippedAt) {
        updateData.shippedAt = new Date();
      }
      if (status === OrderStatus.DELIVERED && !existingOrder.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
      if (status === OrderStatus.CANCELLED && !existingOrder.cancelledAt) {
        updateData.cancelledAt = new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    if (trackingNumber !== undefined) {
      updateData.trackingNumber = trackingNumber || null;
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    logger.error('Error updating order', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Type assertion needed because Prisma types haven't refreshed yet
  return orders as Array<typeof orders[number] & {
    customerName: string;
    shippingAddressLine1: string;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
  }>;
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PAID':
      return 'bg-blue-100 text-blue-800';
    case 'SHIPPED':
      return 'bg-purple-100 text-purple-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'PAID':
      return 'bg-green-100 text-green-800';
    case 'FAILED':
      return 'bg-red-100 text-red-800';
    case 'REFUNDED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/account/orders');
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container-custom max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/account"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              ← Back to Account
            </Link>
            <h1 className="font-serif text-4xl font-bold text-gray-900 mt-4">Order History</h1>
            <p className="text-gray-600 mt-2">View and track all your orders</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet.</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          Payment: {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
                            {item.product?.images[0]?.url && (
                              <Image
                                src={item.product.images[0].url}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.productName}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Quantity: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                            {item.product && (
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                              >
                                View Product →
                              </Link>
                            )}
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(item.quantity * item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-gray-600">
                          <p className="mb-1">
                            <span className="font-medium">Shipping:</span> {order.customerName}
                          </p>
                          <p className="mb-1">
                            {order.shippingAddressLine1}, {order.shippingCity}
                          </p>
                          <p>
                            {order.shippingState} - {order.shippingPostalCode}
                          </p>
                          <p className="mt-2">
                            <span className="font-medium">Payment Method:</span>{' '}
                            {order.paymentMethod.replace('_', ' ')}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="space-y-1 text-sm text-gray-600 mb-2">
                            <div className="flex justify-between gap-8">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                              <span>Shipping:</span>
                              <span>{formatCurrency(order.shippingCost)}</span>
                            </div>
                            {order.tax > 0 && (
                              <div className="flex justify-between gap-8">
                                <span>Tax:</span>
                                <span>{formatCurrency(order.tax)}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between gap-8">
                              <span className="font-semibold text-gray-900">Total:</span>
                              <span className="font-bold text-lg text-primary-700">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex gap-3">
                      <Link href={`/order-confirmation/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {order.status === 'DELIVERED' && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                      {order.status === 'PENDING' && order.paymentStatus === 'PENDING' && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
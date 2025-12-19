'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface TrackOrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default function TrackOrderPage({ params }: TrackOrderPageProps) {
  const router = useRouter();
  const { orderNumber } = use(params);
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track order');
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { key: 'PENDING', label: 'Order Placed', icon: '' },
      { key: 'PAID', label: 'Payment Confirmed', icon: '' },
      { key: 'SHIPPED', label: 'Shipped', icon: '' },
      { key: 'DELIVERED', label: 'Delivered', icon: '' },
    ];

    const statusOrder = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8 text-center">
            Track Your Order
          </h1>

          {!order ? (
            /* Tracking Form */
            <div className="card max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    value={orderNumber}
                    disabled
                    className="input bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                  {isLoading ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>
            </div>
          ) : (
            /* Order Details */
            <div className="space-y-8">
              {/* Header */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    {getStatusSteps(order.status).map((step, index, array) => (
                      <div key={step.key} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                              step.completed
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {step.icon}
                          </div>
                          <p
                            className={`text-xs mt-2 text-center font-medium ${
                              step.active ? 'text-green-600' : 'text-gray-600'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {index < array.length - 1 && (
                          <div
                            className={`flex-1 h-1 mx-2 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                      {item.product && item.product.images[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.productName}
                          width={80}
                          height={100}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="text-gray-700">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2">Phone: {order.shippingAddress.phoneNumber}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Print Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
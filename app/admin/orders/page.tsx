import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AdminOrdersTable } from '@/components/admin-orders-table';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        select: {
          quantity: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
}

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/admin/orders');
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect('/');
  }

  const orders = await getOrders();
  const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0), 0);

  return (
    <>
      <Header />
      <main className="min-h-screen py-12 bg-gray-50">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              ← Back to Dashboard
            </Link>
            <div className="mt-4">
              <h1 className="font-serif text-4xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-2">
                Manage all customer orders • {orders.length} total orders • {totalItems} items
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden" data-testid="orders-table">
            <AdminOrdersTable orders={orders} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
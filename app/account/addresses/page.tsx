import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';

async function getUserAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefaultShipping: 'desc' }, { isDefaultBilling: 'desc' }, { createdAt: 'desc' }],
  });

  return addresses;
}

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/account/addresses');
  }

  const addresses = await getUserAddresses(session.user.id);

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
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="font-serif text-4xl font-bold text-gray-900">Saved Addresses</h1>
                <p className="text-gray-600 mt-2">Manage your shipping and billing addresses</p>
              </div>
              <Button>Add New Address</Button>
            </div>
          </div>

          {/* Addresses List */}
          {addresses.length === 0 ? (
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Saved Addresses</h2>
              <p className="text-gray-600 mb-6">
                You haven&apos;t saved any addresses yet. Add one to make checkout faster.
              </p>
              <Button>Add Your First Address</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Address Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {address.fullName}
                      </h3>
                      <div className="flex gap-2">
                        {address.isDefaultShipping && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                            Default Shipping
                          </span>
                        )}
                        {address.isDefaultBilling && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Default Billing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && (
                      <p className="mt-2">
                        <span className="font-medium">Phone:</span> {address.phone}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    {!address.isDefaultShipping && (
                      <Button variant="outline" size="sm">
                        Set as Default Shipping
                      </Button>
                    )}
                    {!address.isDefaultBilling && (
                      <Button variant="outline" size="sm">
                        Set as Default Billing
                      </Button>
                    )}
                    {!address.isDefaultShipping && !address.isDefaultBilling && (
                      <Button variant="outline" size="sm" className="text-red-600 ml-auto">
                        Delete
                      </Button>
                    )}
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
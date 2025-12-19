import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductGrid } from '@/components/product-grid';
import { SortDropdown } from '@/components/sort-dropdown';
import { Pagination } from '@/components/pagination';
import { SkeletonGrid } from '@/components/loading';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { Category, FabricType, Pattern } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Shop Premium Fabrics',
  description:
    'Browse our collection of premium unstitched fabrics for men, women, and kids. Filter by category, fabric type, pattern, and price.',
  openGraph: {
    title: 'Shop Premium Fabrics | Baabuji',
    description: 'Browse our collection of premium unstitched fabrics',
  },
};

// Enable ISR - revalidate every 30 minutes for shop listings
export const revalidate = 1800;

interface SearchParams {
  category?: Category;
  fabricType?: FabricType;
  pattern?: Pattern;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
  search?: string;
}

async function getProducts(searchParams: SearchParams) {
  const {
    category,
    fabricType,
    pattern,
    color,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = '1',
    search,
  } = searchParams;

  const limit = 12;
  const skip = (parseInt(page) - 1) * limit;

  // Build where clause with proper typing
  interface WhereClause {
    isActive: boolean;
    category?: Category;
    fabricType?: FabricType;
    pattern?: Pattern;
    color?: { contains: string; mode: 'insensitive' };
    price?: { gte?: number; lte?: number };
    stock?: { gt: number };
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' };
      description?: { contains: string; mode: 'insensitive' };
      tags?: { has: string };
    }>;
  }

  const where: WhereClause = { isActive: true };

  if (category) where.category = category;
  if (fabricType) where.fabricType = fabricType;
  if (pattern) where.pattern = pattern;
  if (color) where.color = { contains: color, mode: 'insensitive' };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }
  if (inStock === 'true') where.stock = { gt: 0 };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  // Fetch products and total count
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page: parseInt(page),
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { products, pagination } = await getProducts(params);

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 bg-gray-50">
        <div className="container-custom">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-primary-700">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">Shop</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
              Premium Fabrics Collection
            </h1>
            <p className="text-gray-600">
              Discover our curated selection of {pagination.total} high-quality unstitched fabrics
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden lg:block">
              <FilterSidebar />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing{' '}
                    <span className="font-semibold text-gray-900">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-gray-900">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-semibold text-gray-900">{pagination.total}</span>{' '}
                    products
                  </div>
                  <div className="flex items-center gap-3">
                    <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                      Sort by:
                    </label>
                    <SortDropdown className="w-48" />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <Suspense fallback={<SkeletonGrid count={pagination.limit} />}>
                <ProductGrid products={products} />
              </Suspense>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filters Button */}
          <button className="lg:hidden fixed bottom-6 right-6 bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-800 transition-colors z-50">
            🔍 Filters
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

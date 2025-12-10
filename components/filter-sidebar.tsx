'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Category, FabricType, Pattern } from '@prisma/client';

interface FilterSidebarProps {
  className?: string;
}

interface FilterState {
  category?: Category;
  fabricType?: FabricType;
  pattern?: Pattern;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

const CATEGORIES = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'KIDS', label: 'Kids' },
  { value: 'UNISEX', label: 'Unisex' },
];

const FABRIC_TYPES = [
  { value: 'COTTON', label: 'Cotton' },
  { value: 'LINEN', label: 'Linen' },
  { value: 'SILK', label: 'Silk' },
  { value: 'WOOL', label: 'Wool' },
  { value: 'POLYESTER', label: 'Polyester' },
  { value: 'BLENDED', label: 'Blended' },
];

const PATTERNS = [
  { value: 'SOLID', label: 'Solid' },
  { value: 'PRINTED', label: 'Printed' },
  { value: 'EMBROIDERED', label: 'Embroidered' },
  { value: 'STRIPED', label: 'Striped' },
  { value: 'CHECKS', label: 'Checks' },
  { value: 'FLORAL', label: 'Floral' },
];

const COLORS = [
  'Black',
  'White',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
  'Brown',
  'Grey',
  'Beige',
];

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>({
    category: (searchParams.get('category') as Category) || undefined,
    fabricType: (searchParams.get('fabricType') as FabricType) || undefined,
    pattern: (searchParams.get('pattern') as Pattern) || undefined,
    color: searchParams.get('color') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
  });

  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice ? filters.minPrice / 100 : 0,
    max: filters.maxPrice ? filters.maxPrice / 100 : 10000,
  });

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove all filter params
    params.delete('category');
    params.delete('fabricType');
    params.delete('pattern');
    params.delete('color');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('inStock');

    // Add new filter params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: Category | FabricType | Pattern | string | number | boolean | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePriceChange = () => {
    const newFilters = {
      ...filters,
      minPrice: priceRange.min * 100, // Convert to paise
      maxPrice: priceRange.max * 100,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {};
    setFilters(emptyFilters);
    setPriceRange({ min: 0, max: 10000 });
    router.push(pathname);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== null && value !== ''
  );

  return (
    <aside className={className}>
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={filters.category === cat.value}
                  onChange={(e) =>
                    handleFilterChange('category', e.target.checked ? cat.value : undefined)
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-primary-700">
                  {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Fabric Type Filter */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Fabric Type</h3>
          <div className="space-y-2">
            {FABRIC_TYPES.map((fabric) => (
              <label key={fabric.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.fabricType === fabric.value}
                  onChange={(e) =>
                    handleFilterChange('fabricType', e.target.checked ? fabric.value : undefined)
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-primary-700">
                  {fabric.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Pattern Filter */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Pattern</h3>
          <div className="space-y-2">
            {PATTERNS.map((p) => (
              <label key={p.value} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.pattern === p.value}
                  onChange={(e) =>
                    handleFilterChange('pattern', e.target.checked ? p.value : undefined)
                  }
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700 group-hover:text-primary-700">{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => handleFilterChange('color', filters.color === color ? undefined : color)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  filters.color === color
                    ? 'bg-primary-700 text-white border-primary-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  min="0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  min="0"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handlePriceChange} className="w-full">
              Apply Price
            </Button>
          </div>
        </div>

        {/* Stock Availability */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-gray-700 group-hover:text-primary-700 font-medium">
              In Stock Only
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
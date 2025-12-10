'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Category, FabricType, Pattern } from '@prisma/client';

export interface ProductFormData {
  name: string;
  description: string;
  category: Category | '';
  fabricType: FabricType | '';
  pattern: Pattern | '';
  color: string;
  price: string;
  comparePrice: string;
  stock: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

const CATEGORIES = Object.values(Category);
const FABRIC_TYPES = Object.values(FabricType);
const PATTERNS = Object.values(Pattern);

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    fabricType: initialData?.fabricType || '',
    pattern: initialData?.pattern || '',
    color: initialData?.color || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    stock: initialData?.stock || '0',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    tags: initialData?.tags || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.fabricType) {
      newErrors.fabricType = 'Fabric type is required';
    }

    if (!formData.pattern) {
      newErrors.pattern = 'Pattern is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Premium Cotton Kurta Set"
              error={errors.name}
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Elegant unstitched fabric perfect for traditional occasions..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                error={errors.category}
                disabled={isLoading}
                options={[
                  { value: '', label: 'Select Category' },
                  ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
                ]}
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="fabricType" className="block text-sm font-medium text-gray-700 mb-1">
                Fabric Type *
              </label>
              <Select
                id="fabricType"
                value={formData.fabricType}
                onChange={(e) => handleChange('fabricType', e.target.value)}
                error={errors.fabricType}
                disabled={isLoading}
                options={[
                  { value: '', label: 'Select Fabric' },
                  ...FABRIC_TYPES.map((fabric) => ({ value: fabric, label: fabric })),
                ]}
              />
              {errors.fabricType && <p className="mt-1 text-sm text-red-600">{errors.fabricType}</p>}
            </div>

            <div>
              <label htmlFor="pattern" className="block text-sm font-medium text-gray-700 mb-1">
                Pattern *
              </label>
              <Select
                id="pattern"
                value={formData.pattern}
                onChange={(e) => handleChange('pattern', e.target.value)}
                error={errors.pattern}
                disabled={isLoading}
                options={[
                  { value: '', label: 'Select Pattern' },
                  ...PATTERNS.map((ptrn) => ({ value: ptrn, label: ptrn })),
                ]}
              />
              {errors.pattern && <p className="mt-1 text-sm text-red-600">{errors.pattern}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Color *
            </label>
            <Input
              id="color"
              type="text"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder="Navy Blue, Red, etc."
              error={errors.color}
              disabled={isLoading}
            />
            {errors.color && <p className="mt-1 text-sm text-red-600">{errors.color}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="ethnic, festive, traditional"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="2499.00"
              error={errors.price}
              disabled={isLoading}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Compare at Price (₹)
            </label>
            <Input
              id="comparePrice"
              type="number"
              step="0.01"
              value={formData.comparePrice}
              onChange={(e) => handleChange('comparePrice', e.target.value)}
              placeholder="3499.00"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">Original price (for sale items)</p>
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              placeholder="50"
              error={errors.stock}
              disabled={isLoading}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (visible on website)
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => handleChange('isFeatured', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
              Featured Product
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" size="lg" isLoading={isLoading}>
          Save Product
        </Button>
      </div>
    </form>
  );
}
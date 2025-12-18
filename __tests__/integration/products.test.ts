import { describe, it, expect } from 'vitest';

describe('Product Filtering and Search', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Premium Cotton Lawn',
      slug: 'premium-cotton-lawn',
      category: 'WOMEN',
      fabricType: 'COTTON',
      pattern: 'PRINTED',
      color: 'Blue',
      price: 2499,
      stock: 50,
      isActive: true,
      isFeatured: true,
    },
    {
      id: '2',
      name: 'Silk Blend Saree',
      slug: 'silk-blend-saree',
      category: 'WOMEN',
      fabricType: 'SILK',
      pattern: 'EMBROIDERED',
      color: 'Red',
      price: 5999,
      stock: 20,
      isActive: true,
      isFeatured: false,
    },
    {
      id: '3',
      name: 'Linen Kurta Fabric',
      slug: 'linen-kurta-fabric',
      category: 'MEN',
      fabricType: 'LINEN',
      pattern: 'SOLID',
      color: 'White',
      price: 1999,
      stock: 100,
      isActive: true,
      isFeatured: true,
    },
    {
      id: '4',
      name: 'Kids Cotton Print',
      slug: 'kids-cotton-print',
      category: 'KIDS',
      fabricType: 'COTTON',
      pattern: 'PRINTED',
      color: 'Yellow',
      price: 999,
      stock: 0,
      isActive: false,
      isFeatured: false,
    },
  ];

  describe('Category Filter', () => {
    it('should filter products by WOMEN category', () => {
      const filtered = mockProducts.filter(p => p.category === 'WOMEN');
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.category === 'WOMEN')).toBe(true);
    });

    it('should filter products by MEN category', () => {
      const filtered = mockProducts.filter(p => p.category === 'MEN');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Linen Kurta Fabric');
    });

    it('should filter products by KIDS category', () => {
      const filtered = mockProducts.filter(p => p.category === 'KIDS');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('KIDS');
    });
  });

  describe('Fabric Type Filter', () => {
    it('should filter products by COTTON fabric', () => {
      const filtered = mockProducts.filter(p => p.fabricType === 'COTTON');
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.fabricType === 'COTTON')).toBe(true);
    });

    it('should filter products by SILK fabric', () => {
      const filtered = mockProducts.filter(p => p.fabricType === 'SILK');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Silk Blend Saree');
    });

    it('should filter products by LINEN fabric', () => {
      const filtered = mockProducts.filter(p => p.fabricType === 'LINEN');
      
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Pattern Filter', () => {
    it('should filter products by PRINTED pattern', () => {
      const filtered = mockProducts.filter(p => p.pattern === 'PRINTED');
      
      expect(filtered).toHaveLength(2);
    });

    it('should filter products by SOLID pattern', () => {
      const filtered = mockProducts.filter(p => p.pattern === 'SOLID');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].pattern).toBe('SOLID');
    });

    it('should filter products by EMBROIDERED pattern', () => {
      const filtered = mockProducts.filter(p => p.pattern === 'EMBROIDERED');
      
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Price Range Filter', () => {
    it('should filter products within price range', () => {
      const minPrice = 2000;
      const maxPrice = 4000;
      
      const filtered = mockProducts.filter(
        p => p.price >= minPrice && p.price <= maxPrice
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Premium Cotton Lawn');
    });

    it('should filter products under 2000', () => {
      const maxPrice = 2000;
      
      const filtered = mockProducts.filter(p => p.price <= maxPrice);
      
      expect(filtered).toHaveLength(2);
    });

    it('should filter products over 5000', () => {
      const minPrice = 5000;
      
      const filtered = mockProducts.filter(p => p.price >= minPrice);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].price).toBe(5999);
    });
  });

  describe('Multiple Filters', () => {
    it('should apply multiple filters simultaneously', () => {
      const filtered = mockProducts.filter(
        p => p.category === 'WOMEN' && p.fabricType === 'COTTON'
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Premium Cotton Lawn');
    });

    it('should filter by category, fabric, and price', () => {
      const filtered = mockProducts.filter(
        p => 
          p.category === 'WOMEN' && 
          p.fabricType === 'COTTON' && 
          p.price < 3000
      );
      
      expect(filtered).toHaveLength(1);
    });
  });

  describe('Availability Filter', () => {
    it('should filter only in-stock products', () => {
      const filtered = mockProducts.filter(p => p.stock > 0);
      
      expect(filtered).toHaveLength(3);
      expect(filtered.every(p => p.stock > 0)).toBe(true);
    });

    it('should filter only active products', () => {
      const filtered = mockProducts.filter(p => p.isActive);
      
      expect(filtered).toHaveLength(3);
    });

    it('should filter available products (in-stock AND active)', () => {
      const filtered = mockProducts.filter(p => p.stock > 0 && p.isActive);
      
      expect(filtered).toHaveLength(3);
    });
  });

  describe('Featured Filter', () => {
    it('should filter only featured products', () => {
      const filtered = mockProducts.filter(p => p.isFeatured);
      
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.isFeatured)).toBe(true);
    });
  });

  describe('Color Filter', () => {
    it('should filter products by color', () => {
      const filtered = mockProducts.filter(p => p.color === 'Blue');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].color).toBe('Blue');
    });

    it('should filter products by multiple colors', () => {
      const colors = ['Blue', 'Red'];
      const filtered = mockProducts.filter(p => colors.includes(p.color));
      
      expect(filtered).toHaveLength(2);
    });
  });

  describe('Product Search', () => {
    it('should search products by name', () => {
      const searchTerm = 'cotton';
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(filtered).toHaveLength(2);
    });

    it('should search products case-insensitively', () => {
      const searchTerm = 'SILK';
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toContain('Silk');
    });

    it('should return empty array for no matches', () => {
      const searchTerm = 'nonexistent';
      const filtered = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Product Sorting', () => {
    it('should sort products by price ascending', () => {
      const sorted = [...mockProducts].sort((a, b) => a.price - b.price);
      
      expect(sorted[0].price).toBe(999);
      expect(sorted[sorted.length - 1].price).toBe(5999);
    });

    it('should sort products by price descending', () => {
      const sorted = [...mockProducts].sort((a, b) => b.price - a.price);
      
      expect(sorted[0].price).toBe(5999);
      expect(sorted[sorted.length - 1].price).toBe(999);
    });

    it('should sort products by name alphabetically', () => {
      const sorted = [...mockProducts].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      
      expect(sorted[0].name).toBe('Kids Cotton Print');
    });
  });

  describe('Pagination', () => {
    it('should paginate products correctly', () => {
      const page = 1;
      const pageSize = 2;
      const startIndex = (page - 1) * pageSize;
      
      const paginated = mockProducts.slice(startIndex, startIndex + pageSize);
      
      expect(paginated).toHaveLength(2);
    });

    it('should calculate total pages correctly', () => {
      const pageSize = 2;
      const totalPages = Math.ceil(mockProducts.length / pageSize);
      
      expect(totalPages).toBe(2);
    });

    it('should handle last page with fewer items', () => {
      const page = 2;
      const pageSize = 3;
      const startIndex = (page - 1) * pageSize;
      
      const paginated = mockProducts.slice(startIndex, startIndex + pageSize);
      
      expect(paginated).toHaveLength(1);
    });
  });
});

'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/select';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

interface SortDropdownProps {
  className?: string;
}

export function SortDropdown({ className }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy') && searchParams.get('sortOrder')
    ? `${searchParams.get('sortBy')}_${searchParams.get('sortOrder')}`
    : 'createdAt_desc';

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_');
    const params = new URLSearchParams(searchParams.toString());
    
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <Select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        options={SORT_OPTIONS}
        className="w-full"
      />
    </div>
  );
}
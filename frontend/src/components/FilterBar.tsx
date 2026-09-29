'use client';

import { Button } from '@/components/ui/button';

export type TypeFilter = 'all' | 'movie' | 'series';

interface FilterBarProps {
  value: TypeFilter;
  onChange: (value: TypeFilter) => void;
}

const OPTIONS: { label: string; value: TypeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'Series', value: 'series' },
];

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          size="sm"
          variant={value === opt.value ? 'default' : 'outline'}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
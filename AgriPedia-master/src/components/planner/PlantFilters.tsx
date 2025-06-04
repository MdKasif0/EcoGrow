import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface PlantFiltersProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: string[]) => void;
}

const PlantFilters: React.FC<PlantFiltersProps> = ({
  onSearch,
  onSort,
  onFilter,
}) => {
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  const filterOptions = [
    { value: 'fast-growing', label: 'Fast Growing' },
    { value: 'beginner-friendly', label: 'Beginner Friendly' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'low-maintenance', label: 'Low Maintenance' },
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'harvest-asc', label: 'Harvest Time (Fastest)' },
    { value: 'harvest-desc', label: 'Harvest Time (Longest)' },
    { value: 'difficulty-asc', label: 'Difficulty (Easy to Hard)' },
    { value: 'difficulty-desc', label: 'Difficulty (Hard to Easy)' },
  ];

  const handleFilterToggle = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search plants..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4">
        {/* Filter Buttons */}
        <div className="flex-1 flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilters.includes(option.value) ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterToggle(option.value)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <Select onValueChange={onSort}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PlantFilters; 
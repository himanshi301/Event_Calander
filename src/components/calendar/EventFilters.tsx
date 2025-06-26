
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useCalendarStore } from '@/stores/calendarStore';

const CATEGORIES = [
  'Work',
  'Personal', 
  'Health',
  'Family',
  'Education',
  'Travel',
  'Other'
];

const EVENT_COLORS = [
  { color: '#8B5CF6', name: 'Purple' },
  { color: '#06B6D4', name: 'Cyan' },
  { color: '#10B981', name: 'Green' },
  { color: '#F59E0B', name: 'Yellow' },
  { color: '#EF4444', name: 'Red' },
  { color: '#EC4899', name: 'Pink' },
];

export const EventFilters = () => {
  const { setEventFilters, eventFilters } = useCalendarStore();
  const [searchTerm, setSearchTerm] = useState(eventFilters?.search || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(eventFilters?.categories || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(eventFilters?.colors || []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setEventFilters({
      search: value,
      categories: selectedCategories,
      colors: selectedColors,
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setEventFilters({
      search: searchTerm,
      categories: newCategories,
      colors: selectedColors,
    });
  };

  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    setSelectedColors(newColors);
    setEventFilters({
      search: searchTerm,
      categories: selectedCategories,
      colors: newColors,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedColors([]);
    setEventFilters({ search: '', categories: [], colors: [] });
  };

  const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedColors.length > 0;

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 bg-purple-600 text-white rounded-full px-1.5 py-0.5 text-xs">
                {(selectedCategories.length + selectedColors.length + (searchTerm ? 1 : 0))}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Categories</h4>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <div className="space-y-2">
                {EVENT_COLORS.map(({ color, name }) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={color}
                      checked={selectedColors.includes(color)}
                      onCheckedChange={() => handleColorToggle(color)}
                    />
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    <label htmlFor={color} className="text-sm cursor-pointer">
                      {name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm" className="w-full">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

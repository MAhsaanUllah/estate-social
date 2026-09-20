import { useSelector, useDispatch } from 'react-redux';
import { setFilters, clearFilters } from '../redux/listingSlice';
import { X, Search } from 'lucide-react';
import Input from './ui/Input';

function FilterBar() {
  const dispatch = useDispatch();
  const { filters = {} } = useSelector((state) => state.listings || {});

  const hasActiveFilters = filters ? Object.values(filters).some((v) => v !== '' && v !== null) : false;

  const handleChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const purposes = ['Sale', 'Rent'];
  const propertyTypes = ['House', 'Plot', 'Commercial'];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-gray-200/80 dark:border-zinc-800 sticky top-14 z-40 shadow-sm">
      <div className="flex flex-col space-y-4">
        
        {/* Top Row: Search & Chips */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500 z-10" />
            <Input
              type="text"
              placeholder="Search society, block, or title..."
              className="h-10 pl-9"
              value={filters?.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Purpose Chips */}
            <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-zinc-800/50 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
              {purposes.map(p => {
                const isSelected = filters?.purpose === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleChange('purpose', isSelected ? '' : p)}
                    className={`rounded-lg h-8 px-3.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Property Type Chips */}
            <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-zinc-800/50 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
              {propertyTypes.map(t => {
                const isSelected = filters?.propertyType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleChange('propertyType', isSelected ? '' : t)}
                    className={`rounded-lg h-8 px-3.5 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Listed By Chips (Owner vs Agent) */}
            <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-zinc-800/50 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
              {[
                { label: 'Direct Owner', value: 'owner' },
                { label: 'Agent', value: 'agent' }
              ].map(s => {
                const isSelected = filters?.listedBy === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleChange('listedBy', isSelected ? '' : s.value)}
                    className={`rounded-lg h-8 px-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Row: Ranges & Society */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Price Range */}
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min ₨"
              className="h-10 text-sm"
              value={filters?.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max ₨"
              className="h-10 text-sm"
              value={filters?.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Size Range */}
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Size"
              className="h-10 text-sm"
              value={filters?.minSize || ''}
              onChange={(e) => handleChange('minSize', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Size"
              className="h-10 text-sm"
              value={filters?.maxSize || ''}
              onChange={(e) => handleChange('maxSize', e.target.value)}
            />
          </div>

          {/* Society & Clear */}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Society Auto-complete..."
              className="h-10 text-sm"
              value={filters?.society || ''}
              onChange={(e) => handleChange('society', e.target.value)}
              list="societies"
            />
            <datalist id="societies">
              <option value="DHA" />
              <option value="Bahria Town" />
              <option value="Gulberg" />
              <option value="Wapda Town" />
            </datalist>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => dispatch(clearFilters())}
                className="h-8 w-8 rounded-lg text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors flex-shrink-0"
                title="Clear Filters"
                aria-label="Clear Filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default FilterBar;
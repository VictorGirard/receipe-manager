import { Menu, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon, Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  viewMode: 'carousel' | 'list';
  setViewMode: (mode: 'carousel' | 'list') => void;
  categories: string[];
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  categories
}: SearchBarProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
            </button>
          )}
        </div>
        
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-surface shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-700 dark:text-white">
            <span className="mr-2">{selectedCategory || 'Toutes les catégories'}</span>
            <ChevronDownIcon className="h-5 w-5" />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-dark-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`${
                        active ? 'bg-amber-50 dark:bg-amber-900 text-amber-900 dark:text-amber-50' : 'text-gray-700 dark:text-white'
                      } block w-full text-left px-4 py-2 text-sm`}
                    >
                      Toutes les catégories
                    </button>
                  )}
                </Menu.Item>
                {categories.map((category) => (
                  <Menu.Item key={category}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`${
                          active ? 'bg-amber-50 dark:bg-amber-900 text-amber-900 dark:text-amber-50' : 'text-gray-700 dark:text-white'
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        {category}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-lg ${
              viewMode === 'carousel'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors duration-200`}
            title="Vue carrousel"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-dark-surface text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            } transition-colors duration-200`}
            title="Vue liste"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 
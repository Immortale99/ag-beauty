import { Search, SortAsc, SortDesc } from 'lucide-react';

export default function GalleryFilters({ 
  onSort, 
  onFilter, 
  sortOrder,
  selectedCategory 
}) {
  const categories = ['Tout', 'Nail Art', 'French', 'Gel', 'Déco'];

  return (
    <div className="sticky top-0 bg-white z-10 p-4 shadow-sm space-y-4">
      {/* Tri */}
      <div className="flex gap-2">
        <button
          onClick={() => onSort(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
          Prix {sortOrder === 'asc' ? 'croissant' : 'décroissant'}
        </button>
      </div>

      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onFilter(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
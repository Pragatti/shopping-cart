import { formatCategory } from '../utils/formatCategory';
import { SORT_OPTIONS } from '../utils/sortOptions';
import './FilterBar.css';

export default function FilterBar({
  searchInput,
  onSearchInputChange,
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__field filter-bar__field--search">
        <label htmlFor="listing-search">Search</label>
        <input
          id="listing-search"
          type="search"
          placeholder="Search by product title…"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
        />
      </div>

      <div className="filter-bar__field">
        <label htmlFor="listing-category">Category</label>
        <select
          id="listing-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {formatCategory(cat)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-bar__field">
        <label htmlFor="listing-sort">Sort by</label>
        <select id="listing-sort" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

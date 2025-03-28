import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import '../styles/components/products-page.scss';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, userProducts, fetchProducts, loading } = useStore();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState(15);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  useEffect(() => {
    fetchProducts().catch(() => setLocalError('Failed to load data'));
  }, [fetchProducts]);

  useEffect(() => {
    setVisibleItems(15);
  }, [filter, searchQuery, sortOrder]);

  const mergedProducts = [...products, ...userProducts];
  
  const filteredProducts = mergedProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return filter === 'favorites' ? product.liked && matchesSearch : matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleItems);
  const showLoadMore = sortedProducts.length > visibleItems;

  const handleRetry = async () => {
    setLocalError(null);
    try {
      await fetchProducts();
    } catch {
      setLocalError('Failed to fetch data after retry');
    }
  };

  let content;
  
  if (loading) {
    content = Array.from({ length: 6 }).map((_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ));
  } else if (localError) {
    content = (
      <div className="error-container">
        <div className="error-message">{localError}</div>
        <div className="retry-buttons">
          <button onClick={handleRetry}>Retry</button>
          <button onClick={() => setLocalError(null)}>
            Continue with available data
          </button>
        </div>
      </div>
    );
  } else if (displayedProducts.length > 0) {
    content = displayedProducts.map(product => (
      <ProductCard key={product.id} product={product} />
    ));
  } else {
    content = (
      <div className="empty-state">
        No products found matching your criteria
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-page__filters">
        <input
          type="text"
          placeholder="Search products..."
          className="products-page__search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'favorites')}
          className="products-page__filter"
        >
          <option value="all">All Products</option>
          <option value="favorites">Favorites</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'none' | 'asc' | 'desc')}
          className="products-page__filter"
        >
          <option value="none">Default Order</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
        
        <button
          onClick={() => navigate('/create-product')}
          className="products-page__create-button"
        >
          Create Product
        </button>
      </div>

      <div className="products-page__grid">
        {content}
      </div>

      {!loading && !localError && showLoadMore && (
        <button 
          onClick={() => setVisibleItems(prev => prev + 15)}
          className="products-page__load-more"
        >
          Show more
        </button>
      )}
    </div>
  );
}
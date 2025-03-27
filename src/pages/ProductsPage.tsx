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

  useEffect(() => {
    fetchProducts().catch(() => setLocalError('Failed to load data'));
  }, [fetchProducts]);

  const mergedProducts = [...products, ...userProducts];
  
  const filteredProducts = mergedProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return filter === 'favorites' ? product.liked && matchesSearch : matchesSearch;
  });

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
  } else if (filteredProducts.length > 0) {
    content = filteredProducts.map(product => (
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
    </div>
  );
}
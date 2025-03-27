import { useStore } from '../store/useStore';
import { Product } from '../types/product';
import { Link } from 'react-router-dom';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/solid';
import '../styles/components/product-card.scss';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleLike, deleteProduct } = useStore();

  return (
    <div className="product-card">
      <div className="product-card__actions">
        <button 
          onClick={() => toggleLike(product.id)}
          className="product-card__button"
        >
          <HeartIcon className={product.liked ? 'liked' : ''} />
        </button>
        <button 
          onClick={() => deleteProduct(product.id)}
          className="product-card__button"
        >
          <TrashIcon />
        </button>
      </div>
      
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
        />
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">${product.price}</p>
      </Link>
    </div>
  );
}
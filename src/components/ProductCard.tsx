import { useStore } from '../store/useStore';
import { Product } from '../types/product';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/solid';
import '../styles/components/product-card.scss';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleLike, deleteProduct } = useStore();
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-card__actions">
        <button
          onClick={() => navigate(`/edit-product/${product.id}`)}
          className="product-card__button"
          aria-label="Edit product"
        >
          <PencilIcon className="product-card__icon" />
        </button>

        <button 
          onClick={() => toggleLike(product.id)}
          className="product-card__button"
          aria-label={product.liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon className={`product-card__icon ${product.liked ? 'liked' : ''}`} />
        </button>

        <button 
          onClick={() => deleteProduct(product.id)}
          className="product-card__button"
          aria-label="Delete product"
        >
          <TrashIcon className="product-card__icon" />
        </button>
      </div>
      
      <Link to={`/products/${product.id}`} className="product-card__content">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__image"
        />
        <h3 className="product-card__title">{product.title}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">
          ${product.price.toFixed(2)}
        </p>
      </Link>
    </div>
  );
}
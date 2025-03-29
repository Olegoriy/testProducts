import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import '../styles/components/product-detail.scss';

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useStore(); 
  const product = products.find(p => p.id === Number(id));

  if (!product) return <div className="product-not-found">Product not found</div>;

  return (
    <div className="product-detail">
      <Link to="/products" className="product-detail__back-link">
        <span className="arrow"> &larr; Back to Products</span>
      </Link>
      
      <div className="product-detail__card">
        <img
          src={product.image}
          alt={product.title}
          className="product-detail__image"
        />
        <h1 className="product-detail__title">{product.title}</h1>
        <p className="product-detail__description">{product.description}</p>
        <p className="product-detail__price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
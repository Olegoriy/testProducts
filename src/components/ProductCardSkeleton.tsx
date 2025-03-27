import '../styles/components/product-card-skeleton.scss';

export default function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-price"></div>
    </div>
  );
}
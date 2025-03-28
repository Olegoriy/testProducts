import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Product } from '../types/product';
import '../styles/components/product-form.scss';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, userProducts, updateProduct } = useStore();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<Product | null>(null);

  useEffect(() => {
    const allProducts = [...products, ...userProducts];
    const productToEdit = allProducts.find(p => p.id === Number(id));
    
    if (productToEdit) {
      setProductData(productToEdit);
    } else {
      navigate('/products', { replace: true });
    }
  }, [id, products, userProducts, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData) return;
    
    try {
      await updateProduct(productData.id, {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        image: productData.image,
        liked: productData.liked
      });
      navigate('/products');
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (!productData) return <div>Loading...</div>;

  return (
    <div className="product-form__container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="product-form">

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={productData.title}
            onChange={e => setProductData({ ...productData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={productData.description}
            onChange={e => setProductData({ ...productData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={productData.price}
            onChange={e => setProductData({ ...productData, price: Number(e.target.value) })}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            type="url"
            value={productData.image}
            onChange={e => setProductData({ ...productData, image: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={productData.liked}
              onChange={e => setProductData({ ...productData, liked: e.target.checked })}
            />
            Liked
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/products')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
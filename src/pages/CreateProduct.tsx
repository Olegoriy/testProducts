import { useForm } from 'react-hook-form';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import '../styles/components/create-product.scss';

export default function CreateProduct() {
  const navigate = useNavigate();
  const { addProduct } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Product, 'id'>>();

  const onSubmit = (data: Omit<Product, 'id'>) => {
    addProduct(data);
    navigate('/products');
  };

  return (
    <div className="create-product">
      <h1 className="create-product__title">Create New Product</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <div className={`form-group ${errors.title ? 'invalid' : ''}`}>
          <label className="form-label">Product Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="form-input"
            placeholder="Enter product title"
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className={`form-group ${errors.description ? 'invalid' : ''}`}>
          <label className="form-label">Description</label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: {
                value: 20,
                message: 'Description must be at least 20 characters'
              }
            })}
            className="form-input"
            rows={4}
            placeholder="Enter product description"
          />
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        <div className={`form-group ${errors.price ? 'invalid' : ''}`}>
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { 
              required: 'Price is required',
              min: {
                value: 0.01,
                message: 'Price must be greater than 0'
              }
            })}
            className="form-input"
            placeholder="Enter price"
          />
          {errors.price && <span className="error-message">{errors.price.message}</span>}
        </div>

        <div className={`form-group ${errors.image ? 'invalid' : ''}`}>
          <label className="form-label">Image URL</label>
          <input
            {...register('image', { 
              required: 'Image URL is required',
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: 'Invalid URL format'
              }
            })}
            className="form-input"
            placeholder="Enter image URL"
          />
          {errors.image && <span className="error-message">{errors.image.message}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn btn--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}
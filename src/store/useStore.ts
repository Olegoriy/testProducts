import { create } from 'zustand';
import { Product } from '../types/product';
import { fetchWithRetry } from '../utils/api';
import { mockProducts } from '../mock/products';

interface StoreState {
  products: Product[];
  userProducts: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  userProducts: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWithRetry();
      
      set({
        products: data,
        loading: false,
        error: null
      });
      
      localStorage.setItem('cachedProducts', JSON.stringify(data));
    } catch (error) {
      console.error('API Error:', error);
      const cached = localStorage.getItem('cachedProducts');
      
      set({
        products: cached ? JSON.parse(cached) : mockProducts,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false
      });
    }
  },

  toggleLike: (id) => set((state) => ({
    products: state.products.map(product => 
      product.id === id ? {...product, liked: !product.liked} : product
    )
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
    userProducts: state.userProducts.filter(product => product.id !== id)
  })),

  addProduct: (product) => set((state) => ({
    userProducts: [...state.userProducts, { ...product, id: Date.now() }]
  }))
}));
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/product';
import { fetchWithRetry } from '../utils/api';

interface StoreState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      products: [],
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const apiProducts = await fetchWithRetry();
          const normalizedProducts = apiProducts.map(p => ({
            ...p,
            price: Number(p.price),
            isUserCreated: false
          }));

          set(state => {
            // Сохраняем пользовательские продукты и локальные изменения
            const existingProducts = state.products.filter(p => p.isUserCreated);
            const mergedProducts = normalizedProducts.map(apiProduct => {
              const existing = state.products.find(p => p.id === apiProduct.id);
              return existing ? { ...apiProduct, ...existing } : apiProduct;
            });

            return {
              products: [...mergedProducts, ...existingProducts],
              loading: false,
              error: null
            };
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            loading: false
          });
        }
      },

      toggleLike: (id) => set(state => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, liked: !p.liked } : p
        )
      })),

      deleteProduct: (id) => set(state => ({
        products: state.products.filter(p => p.id !== id)
      })),

      addProduct: (product) => set(state => ({
        products: [
          ...state.products,
          {
            ...product,
            id: Date.now(),
            price: Number(product.price),
            liked: false,
            isUserCreated: true
          }
        ]
      })),

      updateProduct: (id, updatedProduct) => set(state => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...updatedProduct } : p
        )
      })),
    }),
    {
      name: 'products-store',
      partialize: (state) => ({ products: state.products }),
    }
  )
);
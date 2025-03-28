import axios from 'axios';
import { Product } from '../types/product'; 

const API_URL = 'https://dummyjson.com/products';

export const fetchWithRetry = async (retries = 3): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL, {
      timeout: 15000,
      params: {
        limit: 0,
        select: 'id,title,description,price,thumbnail'
      }
    });
    
    return response.data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.thumbnail,
      liked: false 
    }));
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchWithRetry(retries - 1);
    }
    throw error;
  }
};
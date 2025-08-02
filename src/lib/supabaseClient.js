// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions untuk products
export const productService = {
  // Get all products
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
    
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(query) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};
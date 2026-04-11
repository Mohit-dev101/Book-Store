import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

const CATEGORY_ICONS = {
  'Computer Science': '💻',
  'Science': '🔬',
  'Mathematics': '📐',
  'Language': '📝',
  'Engineering': '⚙️',
  'Business': '📊',
  'Arts': '🎨',
  'History': '🏛️',
  'Other': '📦',
};

export const CATEGORIES = Object.keys(CATEGORY_ICONS);

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || '📦';
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { currentUser } = useAuth();
  
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      // map _id back to id for frontend compatibility
      const mapped = data.map(p => ({ ...p, id: p._id }));
      setProducts(mapped);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  async function addProduct(productData) {
    if (!currentUser || !currentUser.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(productData)
      });
      const newProduct = await res.json();
      setProducts([{...newProduct, id: newProduct._id}, ...products]);
      return newProduct;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateProduct(id, updates) {
    if (!currentUser || !currentUser.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map(p => (p.id === id ? { ...updated, id: updated._id } : p)));
      }
    } catch (error) {
       console.error(error);
    }
  }

  async function deleteProduct(id) {
    if (!currentUser || !currentUser.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
       console.error(error);
    }
  }

  function getSellerProducts(sellerId) {
    return products.filter(p => p.sellerId === sellerId);
  }

  function getProductById(id) {
    return products.find(p => p.id === id || p._id === id);
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts,
    getProductById,
    refreshProducts: fetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

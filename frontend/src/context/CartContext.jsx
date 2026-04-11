import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      })
      .catch(console.error);
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  async function addToCart(product) {
    if (!currentUser || !currentUser.token) return;
    try {
      // product.id or product._id must be sent as productId
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ productId: product.id || product._id, quantity: 1 })
      });
      if (res.ok) {
        // Optimistically update or re-fetch cart. It's easiest to re-fetch nicely
        const updatedReq = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const updatedData = await updatedReq.json();
        setCartItems(updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFromCart(productId) {
    if (!currentUser || !currentUser.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      if (res.ok) {
        setCartItems(cartItems.filter(item => item.id !== productId && item._id !== productId));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateQuantity(productId, quantity) {
    if (!currentUser || !currentUser.token) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        // Re-fetch to ensure mapped state
        const updatedReq = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const updatedData = await updatedReq.json();
        setCartItems(updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function clearCart() {
    if (!currentUser || !currentUser.token) return;
    // Real implementation would ideally drop the cart in the backend entirely, 
    // but we can clear local state for now or iterate
    setCartItems([]);
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function getCartCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ LocalStorage nếu có
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Lưu giỏ hàng vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Hàm thêm sách vào giỏ
  const addToCart = (product) => {
    setCart((prevCart) => {
      const isExist = prevCart.find((item) => item.id === product.id);
      if (isExist) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Hàm cập nhật số lượng
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Hàm xóa sản phẩm
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
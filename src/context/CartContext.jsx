import React, { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { cartId } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartId === cartId
      );

      let updatedItems;

      if (existingItemIndex !== -1) {
        updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + action.payload.quantity;
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: existingItem.price * newQuantity,
        };
      } else {
        updatedItems = [...state.items, action.payload];
      }

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return { ...state, items: updatedItems, totalAmount, totalItems };
    }

    case "REMOVE_ITEM": {
      const { cartId } = action.payload;
      const itemToRemove = state.items.find((item) => item.cartId === cartId);

      if (!itemToRemove) return state;
      const updatedItems = state.items.filter((item) => item.cartId !== cartId);
      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return { ...state, items: updatedItems, totalAmount, totalItems };
    }

    case "UPDATE_QUANTITY": {
      const { cartId, quantity } = action.payload;

      const updatedItems = state.items
        .map((item) => {
          if (item.cartId === cartId) {
            return {
              ...item,
              quantity: quantity,
              totalPrice: item.price * quantity,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      const totalAmount = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return { ...state, items: updatedItems, totalAmount, totalItems };
    }

    case "REPLACE_CART":
      return action.payload;

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

const CartContext = createContext(initialState);

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : initial;
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: "REMOVE_ITEM", payload: { cartId } });
  };

  const updateQuantity = (cartId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { cartId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

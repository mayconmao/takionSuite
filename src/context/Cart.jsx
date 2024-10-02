import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

// totalItem: amount * item.pirce,

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [ordersInProgress, setOrdersInProgress] = useState([])
  // console.log("ordersInProgress", JSON.stringify(total, null, 2))

  useEffect(() => {
    let sum = cart.reduce((soma, item) => soma + item.amount * item.price, 0);
    setTotal(sum);
  }, [cart]);

  const alredyExist = id => {
    return cart.find(item => item.id === id);
  };

  const addItemCart = product => {
    const { id } = product;
    const newItem = { ...product, amount: 1 };

    if (alredyExist(id)) {
      const newCart = [...cart].map(item => {
        if (item.id === id) {
          return { ...item, amount: item.amount + 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeItemCart = id => {
    const filteredCart = cart.filter(item => {
      return item.id !== id;
    });
    setCart(filteredCart);
  };

  const increaseItem = product => {
    const { id } = product;
    if (alredyExist(id)) {
      const newCart = cart.map(item => {
        if (item.id === id) {
          return {
            ...item,
            amount: alredyExist(id).amount + 1,
          };
        } else {
          return item;
        }
      });
      setCart(newCart);
      addItemCart(alredyExist(id));
    }
  };

  const decreaseItem = product => {
    const { id } = product;
    if (alredyExist(id)) {
      const newCart = [...cart].map(item => {
        if (item.id === id) {
          return { ...item, amount: item.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
    }
    alredyExist(id).amount < 2 && removeItemCart(id);
  };

  const addOrdersInProgress = addOrder => {
    setOrdersInProgress(currentOrders => {
      // `addOrder` um objeto representando um novo pedido
      // Determinar o próximo índice baseado no número de pedidos existentes
      const nextIndex = currentOrders.length + 1;

      // Criar um novo objeto de pedido com um índice
      const newOrderWithIndex = { pedido: nextIndex, ...addOrder };

      // Adicionar o novo pedido ao array e retornar o novo estado
      return [...currentOrders, newOrderWithIndex];
    });
  };

  const store = {
    cart,
    total,
    ordersInProgress,
    clearCart,
    addItemCart,
    removeItemCart,
    increaseItem,
    decreaseItem,
    addOrdersInProgress
  };

  return (
    <CartContext.Provider value={store}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext);

  const { cart, addItemCart, removeItemCart, increaseItem, decreaseItem, total, clearCart, addOrdersInProgress, ordersInProgress } =
    context;

  return {
    cart,
    ordersInProgress,
    clearCart,
    addItemCart,
    removeItemCart,
    increaseItem,
    decreaseItem,
    total,
    addOrdersInProgress
  };

  // if (!context) {
  //   throw new Error('useBleContext must be used within a BleProvider');
  // }
  // return context;
}
import React, { createContext, useState, useContext, useEffect } from 'react';
import { menuApi } from '@ethio-buna/shared';
import toast from 'react-hot-toast';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        menuApi.getAll({ adminView: true }),
        menuApi.getCategories(),
      ]);

      const itemsArr = Array.isArray(menuRes?.data)
        ? menuRes.data
        : Array.isArray(menuRes)
        ? menuRes
        : [];
      const catsArr = Array.isArray(catRes?.data)
        ? catRes.data
        : Array.isArray(catRes)
        ? catRes
        : [];

      setItems(itemsArr);
      setCategories(catsArr);
    } catch (error) {
      console.error('MenuContext fetchData error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (payload) => {
    try {
      await menuApi.create(payload);
      toast.success('Dish Published!');
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  const updateMenuItem = async (id, payload) => {
    try {
      await menuApi.update(id, payload);
      toast.success('Dish Updated!');
      await fetchData();
    } catch (err) {
      throw err;
    }
  };

  const toggleAvailability = async (id, isAvailable) => {
    try {
      await menuApi.toggle(id, isAvailable);
      setItems((prev) =>
        Array.isArray(prev)
          ? prev.map((item) =>
              item.id === id ? { ...item, isAvailable } : item,
            )
          : [],
      );
      toast.success(isAvailable ? 'Item Marked In-Stock' : 'Item Hidden (Out of Stock)', {
        icon: isAvailable ? '✅' : '🚫',
      });
    } catch (error) {
      toast.error('Toggle failed');
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await menuApi.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Dish Deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  useEffect(() => {
    fetchData();

    const handleMenuUpdate = () => {
      fetchData();
    };
    window.addEventListener('menu_updated', handleMenuUpdate);
    return () => {
      window.removeEventListener('menu_updated', handleMenuUpdate);
    };
  }, []);

  return (
    <MenuContext.Provider
      value={{
        items,
        categories,
        loading,
        addMenuItem,
        updateMenuItem,
        toggleAvailability,
        deleteMenuItem,
        fetchData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);

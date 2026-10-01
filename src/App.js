import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Banner from "./components/Banner";
import Catalog from "./pages/Home";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import HeaderSkeleton from "./components/HeaderSkeleton";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";

const readStoredArray = (key) => {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return [];
  }

  try {
    let parsedValue;

    try {
      parsedValue = JSON.parse(storedValue);
    } catch (error) {
      // JSON.stringify serializes NaN as null, but manually edited storage
      // can contain the non-standard NaN token.
      parsedValue = JSON.parse(
        storedValue.replace(
          /(^|[,[{:\s])(?:NaN|-?Infinity)(?=\s*[,}\]])/g,
          "$1null",
        ),
      );
    }

    if (Array.isArray(parsedValue)) {
      return parsedValue.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.id !== null &&
          item.id !== undefined &&
          (typeof item.id !== "number" || Number.isFinite(item.id)) &&
          (typeof item.id !== "string" || item.id.trim() !== "NaN"),
      );
    }

    throw new TypeError(`Stored value for "${key}" is not an array`);
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error);
    localStorage.removeItem(key);
    return [];
  }
};

function App() {
  const location = useLocation();
  const [isCatalogLoading, setIsCatalogLoading] = React.useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = React.useState(true);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [cartItems, setCartItems] = React.useState(() => {
    return readStoredArray("cartItems");
  });

  const [favorites, setFavorites] = React.useState(() => {
    return readStoredArray("favorites");
  });
  const [orders, setOrders] = React.useState(() => {
    return readStoredArray("orders");
  });

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const formatPrice = (price) => new Intl.NumberFormat("uk-UA").format(price);
  const [orderId, setOrderId] = React.useState(() => {
    const savedOrderId = localStorage.getItem("orderId");
    return savedOrderId ? Number(savedOrderId) : 1;
  });

  React.useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  React.useEffect(() => {
    localStorage.setItem("orderId", orderId);
  }, [orderId]);

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  React.useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  React.useEffect(() => {
    setIsFavoritesLoading(false);
  }, []);

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      if (currentItems.some((cartItem) => cartItem.id === item.id)) {
        return currentItems;
      }

      return [...currentItems, item];
    });
  };

  const onAddToFavorite = (obj) => {
    setFavorites((prev) => {
      const isFavorite = prev.some(
        (favObj) => Number(favObj.id) === Number(obj.id),
      );

      return isFavorite
        ? prev.filter((item) => Number(item.id) !== Number(obj.id))
        : [...prev, obj];
    });
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  };

  const onRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onCreateOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="App">
      {location.pathname === "/" && isCatalogLoading ? (
        <HeaderSkeleton />
      ) : (
        <Header
          onCartClick={() => setIsCartOpen(true)}
          totalPrice={totalPrice}
          formatPrice={formatPrice}
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen((prev) => !prev)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      )}

      {isCartOpen && (
        <Drawer
          items={cartItems}
          totalPrice={totalPrice}
          formatPrice={formatPrice}
          onClose={() => setIsCartOpen(false)}
          onRemove={onRemoveItem}
          setCartItems={setCartItems}
          orderId={orderId}
          setOrderId={setOrderId}
          onCreateOrder={onCreateOrder}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isCatalogLoading && <Banner />}
              <Catalog
                onAddToCart={addToCart}
                onRemoveItem={onRemoveItem}
                isItemAdded={isItemAdded}
                onAddToFavorite={onAddToFavorite}
                favorites={favorites}
                onLoadingChange={setIsCatalogLoading}
              />
            </>
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites
              items={favorites}
              onAddToCart={addToCart}
              onRemoveItem={onRemoveItem}
              isItemAdded={isItemAdded}
              onAddToFavorite={onAddToFavorite}
              favorites={favorites}
              isLoading={isFavoritesLoading}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              orders={orders}
              onAddToCart={addToCart}
              onRemoveItem={onRemoveItem}
              isItemAdded={isItemAdded}
              onAddToFavorite={onAddToFavorite}
              favorites={favorites}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;

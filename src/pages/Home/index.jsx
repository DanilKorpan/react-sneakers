import React, { useEffect } from "react";

import "./style.scss";

import CardItem from "../../components/CardItem";
import SearchBlock from "../../components/SearchBlock";
import SiteSkeleton from "../../components/SiteSkeleton";

const Catalog = ({
  onAddToCart,
  onRemoveItem,
  isItemAdded,
  onAddToFavorite,
  favorites = [],
  onLoadingChange,
}) => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchValue, setSearchValue] = React.useState("");

  useEffect(() => {
    fetch("http://localhost:3001/items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Failed to load catalog:", error);
      })
      .finally(() => {
        setIsLoading(false);
        onLoadingChange(false);
      });
  }, [onLoadingChange]);

  if (isLoading) {
    return <SiteSkeleton />;
  }

  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(normalizedSearchValue),
  );

  return (
    <div className="catalog">
      <div className="container">
        <SearchBlock
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <div className="catalog__list">
          {filteredItems.length > 0 ? (
            filteredItems.map((obj) => (
              <div className="catalog__item" key={obj.id}>
                <CardItem
                  id={obj.id}
                  title={obj.title}
                  price={obj.price}
                  imageUrl={obj.imageUrl}
                  onAddToCart={() => onAddToCart(obj)}
                  onRemoveItem={(id) => onRemoveItem(id)}
                  isAdded={isItemAdded(obj.id)}
                  onFavorite={onAddToFavorite}
                  isFavorite={favorites.some(
                    (fav) => Number(fav.id) === Number(obj.id),
                  )}
                />
              </div>
            ))
          ) : (
            <p className="catalog__empty">Товары не найдены</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;

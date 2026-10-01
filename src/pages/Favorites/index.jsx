import React from "react";
import { Link } from "react-router-dom";

import CardItem from "../../components/CardItem";
import FavoritesSkeleton from "../../components/FavoritesSkeleton";
import ArrowBack from "../../assets/icons/arrowBack.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";

import "./style.scss";

const Favorites = ({
  onAddToCart,
  onRemoveItem,
  isItemAdded,
  onAddToFavorite,
  favorites = [],
  items = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  return (
    <div className="favorite__box">
      <div className="container">
        {favorites.length > 0 ? (
          <>
            <div className="favorite__top">
              <Link to="/">
                <img src={ArrowBack} alt="ArrowBack" />
              </Link>
              <h2 className="favorite__title">Мои закладки</h2>
            </div>

            <div className="favorite__list-items">
              {items.map((obj) => (
                <div className="catalog__item" key={obj.id}>
                  <CardItem
                    id={obj.id}
                    title={obj.title}
                    price={obj.price}
                    imageUrl={obj.imageUrl}
                    onAddToCart={() => onAddToCart(obj)}
                    onRemoveItem={(id) => onRemoveItem(id)}
                    isAdded={isItemAdded(obj.id)}
                    onFavorite={() => onAddToFavorite(obj)}
                    isFavorite={favorites.some(
                      (fav) => Number(fav.id) === Number(obj.id),
                    )}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="favorite__empty">
            <span className="favorite__emoji" role="img" aria-label="sad">
              🥺
            </span>
            <h2 className="favorite__empty-title">Закладок нет :(</h2>  
            <p className="favorite__empty-text">
              Вы ничего не добавляли в закладки
            </p>
            <Link to="/" className="green__button">
              <img src={ArrowLeft} alt="Arrow" />
              Вернуться назад
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

import React from "react";

import "./style.scss";

import Add from "../../assets/icons/plus.svg";
import Added from "../../assets/icons/added.svg";
import Unliked from "../../assets/icons/unliked.svg";
import Liked from "../../assets/icons/liked.svg";

const CardItem = ({
  title,
  imageUrl,
  price,
  onAddToCart,
  onRemoveItem,
  isAdded,
  id,
  onFavorite,
  isFavorite,
}) => {


  const onClickFavorite = () => {
    onFavorite({ id, title, price, imageUrl });
  };

  const onClickAdd = () => {
    if (isAdded) {
      onRemoveItem(id);
    } else {
      onAddToCart();
    }
  };

  return (
    <div>
      <div className="container">
        <div className="card">
          <button className="card__favorite" onClick={onClickFavorite}>
            <img src={isFavorite ? Liked : Unliked} alt="" />
          </button>

          <img className="img__main" src={imageUrl} alt="" />

          <h5 className="card__title">{title}</h5>

          <div className="card__bottom">
            <div className="card__price">
              <span>Цена:</span>
              <b>{price} грн.</b>
            </div>
            <button className="card__add-btn" onClick={onClickAdd}>
              <img src={isAdded ? Added : Add} alt="Add" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;

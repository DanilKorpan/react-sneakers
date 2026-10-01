import React from "react";
import { Link } from "react-router-dom";

import CardItem from "../../components/CardItem";
import ArrowBack from "../../assets/icons/arrowBack.svg";
import ArrowLeft from "../../assets/icons/arrowLeft.svg";

import "./style.scss";

const Profile = ({
  orders = [],
  onAddToCart,
  onRemoveItem,
  isItemAdded,
  onAddToFavorite,
  favorites = [],
}) => {
  return (
    <main className="profile">
      <div className="container">
        <div className="profile__top">
          <Link to="/">
            <img src={ArrowBack} alt="Вернуться назад" />
          </Link>
          <h1 className="profile__top-title">
            {orders.length > 0 ? "Мои покупки" : "Профиль"}
          </h1>
        </div>

        {orders.length > 0 ? (
          <section className="profile__orders">
            <div className="profile__orders-list">
              {orders.map((order) => (
                <section className="profile__order" key={order.id}>
                  <div className="profile__order-header">
                    <h2>Заказ #{order.id}</h2>
                    <span>{order.totalPrice} грн.</span>
                  </div>

                  <div className="profile__order-items">
                    {order.items.map((item) => (
                      <div
                        className="profile__order-item"
                        key={`${order.id}-${item.id}`}
                      >
                        <CardItem
                          id={item.id}
                          title={item.title}
                          price={item.price}
                          imageUrl={item.imageUrl}
                          onAddToCart={() => onAddToCart(item)}
                          onRemoveItem={onRemoveItem}
                          isAdded={isItemAdded(item.id)}
                          onFavorite={onAddToFavorite}
                          isFavorite={favorites.some(
                            (favorite) =>
                              Number(favorite.id) === Number(item.id),
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : (
          <section className="profile__content">
            <span className="profile__emoji" role="img" aria-label="sad">
              🥺
            </span>
            <h2 className="profile__empty-title">У вас нет заказов</h2>
            <p className="profile__empty-text">Вы ничего не заказывали</p>
            <Link to="/" className="profile__button">
              <img src={ArrowLeft} alt="" />
              Вернуться назад
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default Profile;

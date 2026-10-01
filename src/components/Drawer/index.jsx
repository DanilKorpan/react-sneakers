import React, { useEffect } from "react";

import Info from "../Info";

import "./style.scss";

import Remove from "../../assets/icons/remove.svg";
import arrowRight from "../../assets/icons/arrowRight.svg";
import completeOrderImg from "../../assets/images/complete-order.png";
import emptyCartImg from "../../assets/images/empty-cart.png";

const Drawer = ({
  items = [],
  totalPrice,
  onClose,
  formatPrice,
  onRemove,
  setCartItems,
  orderId,
  setOrderId,
  onCreateOrder,
}) => {
  const tax = Math.round(totalPrice * 0.05);

  const [isOrderComplete, setIsOrderComplete] = React.useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onClickOrder = () => {
    onCreateOrder({
      id: orderId,
      items,
      totalPrice,
    });
    setIsOrderComplete(true);
    setCartItems([]);
    // setOrderId((prev) => prev + 1);
  };

  const handleClose = () => {
    if (isOrderComplete) {
      setOrderId((prev) => prev + 1);
    }
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer__header">
          <h2 className="drawer__title">Корзина</h2>
          <button
            type="button"
            className="drawer__close"
            aria-label="Закрыть корзину"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="items">
              {items.map((item) => (
                <div className="cart__items" key={item.id}>
                  <img src={item.imageUrl} alt={item.title} />

                  <div>
                    <p>{item.title}</p>
                    <b>{item.price} грн.</b>
                  </div>

                  <button onClick={() => onRemove(item.id)}>
                    <img className="remove" src={Remove} alt="remove" />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart__total-block">
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{formatPrice(totalPrice)} грн.</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{formatPrice(tax)} грн.</b>
                </li>
              </ul>
              <button onClick={onClickOrder} className="green__btn">
                Оформить заказ
                <img src={arrowRight} alt="Arrow" />
              </button>
            </div>
          </>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
            }
            image={isOrderComplete ? completeOrderImg : emptyCartImg}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Drawer;

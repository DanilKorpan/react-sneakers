import React from "react";
import { Link } from "react-router-dom";

import "./style.scss";

import Logo from "../../assets/images/logo.png";
import Cart from "../../assets/icons/cart.svg";
import Favorite from "../../assets/icons/favorite.svg";
import Profile from "../../assets/icons/profile.svg";

const Header = ({
  onCartClick,
  totalPrice,
  formatPrice,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
}) => {
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="header__logo">
          <img src={Logo} alt="Logo" />
          <div className="header__logo-info">
            <h3>REACT SNEAKERS</h3>
            <p>Магазин лучших кроссовок</p>
          </div>
        </a>

        <div className="header__mobile-actions">
          <button type="button" className="header__cart-button" onClick={onCartClick}>
            <img src={Cart} alt="Cart" />
            <span className="header__cart">{formatPrice(totalPrice)} грн.</span>
          </button>

          <button
            type="button"
            className={`header__burger ${isMenuOpen ? "header__burger--open" : ""}`}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={onMenuToggle}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
          <ul className="header__list">
            <li className="header__item header__item--desktop-cart">
              <button type="button" onClick={onCartClick}>
                <img src={Cart} alt="Cart" />
                <span className="header__cart">{formatPrice(totalPrice)} грн.</span>
              </button>
            </li>

            <li className="header__item">
              <Link to="/favorites" onClick={onMenuClose}>
                <img src={Favorite} alt="Favorite" /> <span>Закладки</span>
              </Link>
            </li>

            <li className="header__item">
              <Link to="/profile" className="header__button" onClick={onMenuClose}>
                <img src={Profile} alt="Profile" /> <span>Профиль</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;

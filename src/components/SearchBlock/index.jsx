import React from "react";

import "./style.scss";

import Search from "../../assets/icons/search.svg";

const SearchBlock = ({ searchValue, onSearchChange }) => {
  return (
    <div className="container">
      <div className="catalog__top">
        <h2>Все кроссовки</h2>
        <div className="search-block">
          <img src={Search} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Поиск..."
            className="search-input"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Поиск товаров"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBlock;

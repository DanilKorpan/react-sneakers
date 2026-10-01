import React from "react";

import CardSkeleton from "../CardSkeleton";

import "./style.scss";

const FavoritesSkeleton = () => {
  return (
    <div className="favorites-skeleton" aria-hidden="true">
      <div className="container">
        <div className="favorites-skeleton__top">
          <div className="favorites-skeleton__back" />
          <div className="favorites-skeleton__title" />
        </div>

        <div className="favorites-skeleton__list">
          {Array.from({ length: 4 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoritesSkeleton;

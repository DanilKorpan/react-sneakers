import React from "react";

import "./style.scss";

const CardSkeleton = () => {
  return (
    <div className="card-skeleton" aria-hidden="true">
      <div className="card-skeleton__favorite" />
      <div className="card-skeleton__image" />
      <div className="card-skeleton__title" />
      <div className="card-skeleton__bottom">
        <div>
          <div className="card-skeleton__label" />
          <div className="card-skeleton__price" />
        </div>
        <div className="card-skeleton__button" />
      </div>
    </div>
  );
};

export default CardSkeleton;

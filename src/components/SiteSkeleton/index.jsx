import React from "react";

import CardSkeleton from "../CardSkeleton";

import "./style.scss";

const SiteSkeleton = () => {
  return (
    <>
      <div className="container">
        <section className="site-skeleton__banner" aria-hidden="true" />
      </div>

      <div className="container">
        <div className="site-skeleton__top" aria-hidden="true">
          <div className="site-skeleton__heading" />
          <div className="site-skeleton__search" />
        </div>

        <div className="site-skeleton__list" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SiteSkeleton;

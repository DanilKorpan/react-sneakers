import React from "react";

import "./style.scss";

const HeaderSkeleton = () => {
  return (
    <header className="header-skeleton" aria-hidden="true">
      <div className="container">
        <div className="header-skeleton__logo">
          <div className="header-skeleton__logo-image" />
          <div>
            <div className="header-skeleton__title" />
            <div className="header-skeleton__subtitle" />
          </div>
        </div>
        <div className="header-skeleton__nav">
          <div className="header-skeleton__nav-item" />
          <div className="header-skeleton__nav-item" />
          <div className="header-skeleton__nav-item" />
        </div>
      </div>
    </header>
  );
};

export default HeaderSkeleton;

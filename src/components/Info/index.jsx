import React from "react";
import "./style.scss";

import Arrow from "../../assets/icons/arrowLeft.svg";

const Info = ({ title, image, description, onClose }) => {
  return (
    <div className="cartEmpty">
      <img className="cartEmpty__icon" src={image} alt="Info" />
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onClose} className="greenButton">
        <img src={Arrow} alt="Arrow" />
        Вернуться назад
      </button>
    </div>
  );
};

export default Info;

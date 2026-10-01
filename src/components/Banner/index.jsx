import BannerImg from "../../assets/images/banner.png";

import "./style.scss";

const Banner = () => {
  return (
    <section className="banner">
      <div className="container">
        <img src={BannerImg} alt="Banner" />
      </div>
    </section>
  );
};

export default Banner;

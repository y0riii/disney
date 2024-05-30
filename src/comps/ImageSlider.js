import React from 'react'
import "../styles/ImageSlider.css"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay:true,
  };
  return (
    <div className="ImageSlider">
      <Slider {...settings} className="slider">
        <div className="wrap">
          <img src="/images/slider-badag.jpg" alt="slider" />
        </div>
        <div className="wrap">
          <img src="/images/slider-badging.jpg" alt="slider" />
        </div>
        <div className="wrap">
          <img src="/images/slider-scale.jpg" alt="slider" />
        </div>
        <div className="wrap">
          <img src="/images/slider-scales.jpg" alt="slider" />
        </div>
      </Slider>
    </div>
  )
}

export default ImageSlider
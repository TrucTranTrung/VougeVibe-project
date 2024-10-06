import React, { useContext, useEffect, useState } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { currency } from "../../App";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [ imgDisplay, setImgDisplay ] = useState(product.image[0])
  useEffect(()=> {
    setImgDisplay(product.image[0]);
  },[product])
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {product.image.map((img, i) => (
            <div key={i}    className={`rounded-md overflow-hidden w-[110px] ${img === imgDisplay ? "bg-gray-400": " "}`}>
              <img
                className={`w-full h-full object-cover cursor-pointer transition duration-200`}
                src={img}
                alt="img"
                onClick={()=> setImgDisplay(img)}
              />
            </div>
          ))}
        </div>
        <div  data-aos="fade-up" data-aos-once="true" className="productdisplay-img rounded-md overflow-hidden">
          <img
            className="productdisplay-main-img object-cover transition duration-200"
            src={imgDisplay}
            alt="img"
          />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            {currency}
            {product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            {currency}
            {product.new_price}
          </div>
        </div>
        <div className="productdisplay-right-description">
          {product.description}
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button className="rounded-lg hover:bg-[#EB423F]/80 hover:text-white transition duration-200" onClick={() => addToCart(product._id)}>ADD TO CART</button>
        <p className="productdisplay-right-category">
          <span>Category :</span> Women, T-shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;

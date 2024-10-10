import React, { memo, useContext } from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { currency } from "../../App";
import { ShopContext } from '../../Context/ShopContext'

const Item = memo((props) => {
  const { addToCart } = useContext(ShopContext);
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={props.delay}
      data-aos-offset={props.offset}
      className={`item group shadow-xl rounded-xl p-2 cursor-pointer group relative ${props.classs}`}
    >
      {props.cart && <button className={`rounded-lg bg-[#EB423F]/80  hover:bg-[#EB423F]/90 text-white transition duration-200 absolute top-3 right-4 z-30 p-1 hidden group-hover:block `} onClick={() => addToCart(props.id)}><MdOutlineShoppingCart className="text-[24px]"/></button>}
      <Link className="flex flex-col h-full duration-200 transition-all"  to={"/product/" + props.id} onClick={()=> handleScrollToTop()}>
        <div className="rounded-md overflow-hidden h-full w-full">
          <img
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-200"
            onClick={window.scrollTo(0, 0)}
            src={props.image[0]}
            alt="products"
          />
        </div>
        <p className="line-clamp-2 px-2 mt-3 font-medium text-lg h-[75px]">{props.name}</p>
        <div className="item-prices p-2 items-end">
          <div className="item-price-new text-sm">
            {currency}
            {props.new_price}
          </div>
          <div className="item-price-old text-sm">
            {currency}
            {props.old_price}
          </div>
        </div>
      </Link>
    </div>
  );
});

export default Item;

import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";
import { currency } from "../../App";

const Item = (props) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={props.delay}
      data-aos-offset={props.offset}
      className={`item group shadow-xl rounded-xl p-2 cursor-pointer group ${props.class}`}
    >
      <Link className="flex flex-col" to={"/product/" + props.id}>
        <div className="rounded-md overflow-hidden h-full">
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-200"
            onClick={window.scrollTo(0, 0)}
            src={props.image[0]}
            alt="products"
          />
        </div>
        <p className="line-clamp-2 px-2 font-medium text-lg">{props.name}</p>
        <div className="item-prices p-2">
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
};

export default Item;

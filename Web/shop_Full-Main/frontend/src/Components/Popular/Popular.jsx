import React from "react";
import "./Popular.css";
import Item from "../Item/Item.jsx";

const Popular = (props) => {
  return (
    <div className="popular w-[80%] m-auto">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      {props.data.length === 0 ? (
        ""
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-2">
          <div className="lg:col-span-2 lg:row-span-2 ">
            <Item
              classs={"h-full w-full"}
              id={props.data[0]._id}
              name={props.data[0].name}
              image={props.data[0].image}
              new_price={props.data[0].new_price}
              old_price={props.data[0].old_price}
            />
          </div>

          <div className="lg:col-span-1 lg:row-span-1">
            <Item
            classs={"h-full w-full"}
              id={props.data[1]._id}
              name={props.data[1].name}
              image={props.data[1].image}
              new_price={props.data[1].new_price}
              old_price={props.data[0].old_price}
            />
          </div>

          <div className="lg:col-span-1 lg:row-span-1">
            <Item
            classs={"h-full w-full"}
              id={props.data[2]._id}
              name={props.data[2].name}
              image={props.data[2].image}
              new_price={props.data[2].new_price}
              old_price={props.data[0].old_price}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default Popular;

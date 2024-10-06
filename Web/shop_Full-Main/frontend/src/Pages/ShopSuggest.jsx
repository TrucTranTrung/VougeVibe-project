import React, { useMemo, useState } from "react";
import { FiCameraOff } from "react-icons/fi";
import { FaCameraRetro } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import Item from "../Components/Item/Item";
import { Camera } from "../Components/Camera/Camera";
import { useEffect } from "react";
import { FiChevronsLeft } from "react-icons/fi";
import { FourSquare  } from "react-loading-indicators"

export const ShopSuggest = () => {
  const [showCam, setShowCam] = useState(false);
  const [products, setProducts] = useState(
    localStorage.getItem("product-recommented")  ? JSON.parse(localStorage.getItem("product-recommented")) : []
  );
  const [currentData, setCurrentData] = useState([]);
  const [categoryList, setCategoryList] = useState(
    localStorage.getItem("categorys-recommented") ? JSON.parse(localStorage.getItem("categorys-recommented")) : ["Full products"]);
  const [category, setCategory] = useState("Full products");
  const filteredData = useMemo(() => {
    if (products == null) return [];
    return products.filter((item) => category === "Full products" ? true : item.category === category);
  }, [products, category]);

  useEffect(() => {
    setCurrentData(filteredData);
  }, [filteredData]);

  return (
    <div className="w-full">
      <div className="flex justify-center h-[560px] mt-7 mx-24">
        <Camera
          show={showCam}
          setProducts={setProducts}
          setCategoryList={setCategoryList}
          categoryList={categoryList}
        />
        <div
          className={`w-full ml-10 transition-all duration-700 rounded-2xl shadow-2xl py-4 px-5 overflow-hidden relative  ${
            currentData.length <= 0 ? (showCam ? "w-1/2" : " ") : "w-full"
          }`}
        >
          <div className={`absolute bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-30 ${currentData.length > 0 ? "hidden" : "block"}`}>
            <FourSquare color="#FF4141" size="medium" text="" textColor="" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h1
              className={`text-xl font-poppins text-[#626262] border-b-[3px] border-[#FF4141] inline-block  pb-2 `}
            >suggested products</h1>
            <div className="flex items-center">
              <div
                className="group px-5 py-2 min-w-[170px] rounded-full border-black border-[1px] flex items-center 
              justify-center cursor-pointer relative hover:bg-[#EB423F]/80 hover:border-white transition-all 
              duration-200 shadow-md inset-0 after:content-[''] after:block after:w-full after:h-full after:absolute 
              after:top-1/2 after:left-0 mr-4 z-30"
              >
                <p className="group-hover:text-white min-w-32">{category}</p>
                <FiChevronsLeft className="ml-3 group-hover:-rotate-90 transition-all duration-200 text-lg group-hover:text-white" />
                <div className="absolute left-0 right-0 top-full p-2 rounded-lg mt-1 bg-white shadow-xl overflow-hidden hidden group-hover:block">
                  <ul>
                    {categoryList.map((cat) => (
                      <li
                        key={cat}
                        className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {showCam ? (
                <FiCameraOff
                  onClick={() => setShowCam((pre) => !pre)}
                  className="text-4xl font-thin px-2 py-1 bg-[#FF4141]/50 rounded-md cursor-pointer hover:bg-[#ff4141]/60 mr-2"
                />
              ) : (
                <FaCameraRetro
                  onClick={() => setShowCam((pre) => !pre)}
                  className="text-4xl font-thin px-2 py-1 bg-[#FF4141]/50 rounded-md cursor-pointer hover:bg-[#ff4141]/60 mr-2"
                />
              )}
              <IoReload className="text-4xl font-bold px-2 py-1 bg-[#FF4141]/50 rounded-md cursor-pointer hover:bg-[#ff4141]/60" />
            </div>
          </div>
          <div className="overflow-y-auto overflow-x-hidden p-2 h-[474px]">
            <div
              className="grid lg:grid-cols-3 md:grid-cols-2 gap-4"
              data-aos="fade-up"
            >
              {currentData.map((item, i) => {
                return (
                  <Item
                    cart={true}
                    classs={"max-h-[400px] transition-all duration-200"}
                    delay={i * 200}
                    offset={-9999}
                    id={item._id}
                    key={i}
                    name={item.name}
                    image={item.image}
                    new_price={item.new_price}
                    old_price={item.old_price}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

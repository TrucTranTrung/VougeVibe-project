import React, { useState } from "react";

export const ShortCategory = ({props}) => {
  const [category, setCategory] = useState("Full products");
  return (
    <div className="group px-5 py-2 min-w-[200px] rounded-full border-black border-[1px] flex items-center justify-center cursor-pointer relative hover:bg-[#EB423F]/80 hover:border-white transition-all duration-200 shadow-md inset-0 after:content-[''] after:block after:w-full after:h-full after:absolute after:top-1/2 after:left-0">
      <p className="group-hover:text-white">{category}</p>
      <FiChevronsLeft className="ml-3 group-hover:-rotate-90 transition-all duration-200 text-lg group-hover:text-white" />

      <div className="absolute left-0 right-0 top-full p-2 rounded-lg mt-1 bg-white shadow-xl overflow-hidden hidden group-hover:block">
        <ul>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Full products")}
          >
            Full products
          </li>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Bag")}
          >
            Bag
          </li>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Shoes")}
          >
            Shoes
          </li>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Shirt")}
          >
            Shirt
          </li>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Watch")}
          >
            Watch
          </li>
          <li
            className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1"
            onClick={() => setCategory("Pants")}
          >
            Pants
          </li>
        </ul>
      </div>
    </div>
  );
};

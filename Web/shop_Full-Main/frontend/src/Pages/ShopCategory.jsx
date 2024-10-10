import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FiChevronsLeft } from "react-icons/fi";
import ReactPaginate from 'react-paginate';
import Item from "../Components/Item/Item";
import { backend_url } from "../App";
import "./CSS/ShopCategory.css";
import './CSS/Pagination.css'; 
import { useCallback } from "react";
import Aos from "aos";

const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentDataView, setCurrentDataView] = useState([]);
  const [indexShow, setIndexShow]= useState(0);
  const [category, setCategory] = useState("Full products");

  const itemsPerPage = 8;

  const fetchInfo = useCallback(async () => {
    try {
      const res = await fetch(`${backend_url}/allproducts/${props.gender}`);
      if (!res.ok) {
        throw new Error("API did not respond");
      }
      const data = await res.json();
      setProducts(data);
      // setError(null); // Reset lỗi nếu thành công
    } catch (err) {
      // setError(err.message); // Lưu thông điệp lỗi
    }
  }, [props.gender]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  useEffect(() => {
    let datafilter =  products.filter(item => category === "Full products" ? true : item.category === category)
    setCurrentData(datafilter)
    setCurrentDataView(datafilter.slice(0, itemsPerPage));
  }, [category, products]); 
  
   
  const handlePageChange = (selectedPage) => {
    let startIndex = selectedPage.selected * itemsPerPage;
    setIndexShow(startIndex);
    const endIndex = Math.min(currentData.length, startIndex + itemsPerPage);
    setCurrentDataView(currentData.slice(startIndex, endIndex));
    Aos.refresh();
  };

  

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort flex items-center">
        <p>
          <span>
            Showing {indexShow + 1 } - {Math.min(currentData.length, indexShow + itemsPerPage)}
          </span>{" "}
          out of {currentData.length} Products
        </p>
        <ReactPaginate
        nextLabel={<FaChevronRight />} // Thay thế bằng icon
        onPageChange={handlePageChange}
        pageCount={Math.ceil(currentData.length / itemsPerPage)}
        previousLabel={<FaChevronLeft />} // Thay thế bằng icon
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName="page-item"
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        />
        <div className="group px-5 py-2 min-w-[200px] rounded-full border-black border-[1px] flex items-center justify-center cursor-pointer relative hover:bg-[#EB423F]/80 hover:border-white transition-all duration-200 shadow-md inset-0 after:content-[''] after:block after:w-full after:h-full after:absolute after:top-1/2 after:left-0">
          <p className="group-hover:text-white">{category}</p>
          <FiChevronsLeft className="ml-3 group-hover:-rotate-90 transition-all duration-200 text-lg group-hover:text-white" />

          <div className="absolute left-0 right-0 top-full p-2 rounded-lg mt-1 bg-white shadow-xl overflow-hidden hidden group-hover:block z-30">
            <ul>
              {["Full products", "BAG", "SHOES", "SHIRT", "HEADWEAR", "PANTS"].map((item, index) => (
                 <li key={index} className={`w-full px-4 py-1 hover:bg-gray-400 rounded-md mb-1 ${category === item ? "bg-gray-300": ""}`} onClick={()=> setCategory(item)}>{item}</li>  
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="shopcategory-products grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5 ">
        {currentDataView.map((item, i) => {
              return (
                <Item
                  classs={"max-h-[450px]"}
                  delay={i * 200}
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
      <div className="shopcategory-loadmore hover:bg-[#EB423F] hover:text-white hover:border-white transition duration-200 cursor-pointer">
        <Link to="/" style={{ textDecoration: "none" }}>
          Explore More
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;

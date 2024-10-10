import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import "./Pagination.css";
import cross_icon from "../Assets/cross_icon.png";
import { backend_url, currency } from "../../App";
import ReactPaginate from "react-paginate";
import { FiChevronsLeft } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentDataView, setCurrentDataView] = useState([]);
  const [indexShow, setIndexShow] = useState(0);
  const [category, setCategory] = useState("Full products");

  const itemsPerPage = 8;
  

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${backend_url}/allproducts/all`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await fetch(`${backend_url}/removeproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to remove product", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredData = allProducts.filter(item => 
      category === "Full products" ? true : item.category === category
    );
    setCurrentData(filteredData);
    setCurrentDataView(filteredData.slice(0, itemsPerPage));
  }, [allProducts, category]);

  const handlePageChange = (selectedPage) => {
    const startIndex = selectedPage.selected * itemsPerPage;
    setIndexShow(startIndex);
    const endIndex = Math.min(startIndex + itemsPerPage, currentData.length);
    setCurrentDataView(currentData.slice(startIndex, endIndex));
  };

  return (
    <div className="listproduct">
      <h1 className="text-2xl font-bold">All Products List</h1>
      <div className="flex items-center justify-between w-full mx-4">
        <p>
          Showing {indexShow + 1} - {Math.min(indexShow + itemsPerPage, currentData.length)} out of {currentData.length}
        </p>
        <ReactPaginate
          nextLabel={<FaChevronRight />}
          onPageChange={handlePageChange}
          pageCount={Math.ceil(currentData.length / itemsPerPage)}
          previousLabel={<FaChevronLeft />}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          containerClassName="pagination"
          pageClassName="page-item"
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
          <div className="absolute left-0 right-0 top-full p-2 rounded-lg mt-1 bg-white shadow-xl overflow-hidden hidden group-hover:block">
            <ul>
              {["Full products", "BAG", "SHOES", "SHIRT", "HEADWEAR", "PANTS"].map((cat) => (
                <li key={cat} className="w-full px-4 py-1 hover:bg-gray-300 rounded-md mb-1" onClick={() => setCategory(cat)}>
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="listproduct-format-main">
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New Price</p> <p>Gender</p> <p>Category</p> <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {currentDataView.map((e, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={e.image[0]} alt="" />
              <p className="cartitems-product-title">{e.name}</p>
              <p>{currency}{e.old_price}</p>
              <p>{currency}{e.new_price}</p>
              <p>{e.sex}</p>
              <p>{e.category}</p>
              <img className="listproduct-remove-icon" onClick={() => removeProduct(e.id)} src={cross_icon} alt="" />
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;

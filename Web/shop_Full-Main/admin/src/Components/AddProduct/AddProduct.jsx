import React, { useState } from "react";
import "./AddProduct.css";
import { IoMdClose } from "react-icons/io";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../App";

const AddProduct = () => {

  const [image, setImage] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: [],
    sex: "FEMALE",
    category: "SHORT",
    new_price: "",
    old_price: ""
  });

  

  const AddProduct = async () => {

    let dataObj;
    let product = productDetails;

    let formData = new FormData();
    image.length !==0 ? image.forEach(item => formData.append('product', item)): 
    formData.append('product', null)

    await fetch(`${backend_url}/upload`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json())
      .then((data) => { dataObj = data });

      
    if (dataObj.success) {
      product.image = dataObj.image_url;
      await fetch(`${backend_url}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
        .then((resp) => resp.json())
        .then((data) => { data.success ? alert("Product Added") : alert("Failed") });

    }
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  }

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input type="text" name="description" value={productDetails.description} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="number" name="old_price" value={productDetails.old_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="number" name="new_price" value={productDetails.new_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Gender</p>
        <select value={productDetails.sex} name="sex" className="add-product-selector" onChange={(e)=>changeHandler(e)}>
          <option value="FEMALE">Women</option>
          <option value="MALE">Men</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select value={productDetails.category} name="category" className="add-product-selector" onChange={(e)=>changeHandler(e)}>
          <option value="SHORT">Short</option>
          <option value="BAG">Bag</option>
          <option value="SHOES">Shoes</option>
          <option value="SHIRT">Shirt</option>
          <option value="PANTS">Pants</option>
          <option value="HEADWEAR">Headwear</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product image</p>
        <div className="flex">
          {image.length !== 0 ? image.map((item, i) => (
            <span key={i} className="relative mr-3 mb-3 mt-3 rounded-md drop-shadow-md overflow-hidden group w-[127px] h-[129px]">
              <img className="w-full h-full object-cover" src={URL.createObjectURL(item)} alt="" />
              <IoMdClose className="absolute top-1 right-1 text-black cursor-pointer hidden group-hover:block" onClick={()=>setImage(pre => pre.filter(p => p!==item))}/>
            </span>
            )): ""}
        </div>
        <label htmlFor="file-input">
          <img  className="addproduct-thumcbnail-img" src={upload_area} alt="" />
        </label>
        <input onChange={(e) => setImage(pre => [...pre, ...e.target.files])} type="file" name="image" id="file-input" accept="image/*" hidden multiple/>
      </div>
      <button className="addproduct-btn" onClick={() => { AddProduct() }}>ADD</button>
    </div>
  );
};

export default AddProduct;

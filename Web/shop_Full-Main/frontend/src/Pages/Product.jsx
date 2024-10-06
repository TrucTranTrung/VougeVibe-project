import React, { useContext, useEffect, useState } from 'react'
import Breadcrums from '../Components/Breadcrums/Breadcrums'
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox'
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import Aos from 'aos'

const Product = () => {
  const {products} = useContext(ShopContext);
  const {productId} = useParams();
  const [product,setProduct] = useState(false);

  useEffect(()=>{
    setProduct(products.find((e)=>e._id === productId))
    Aos.init();
    Aos.refresh();
  },[products,productId])
  return product ? (
    <div>
      <Breadcrums product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts id={product._id} category={product.category} gender={product.sex}/>
    </div>
  ) : null
}

export default Product

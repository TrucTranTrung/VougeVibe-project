import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { backend_url } from '../../App';

const RelatedProducts = ({category,id, gender}) => {

  const [related,setRelated] = useState([]);

  useEffect(()=>{
    fetch(`${backend_url}/relatedproducts`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({category:category, sex:gender}),
      })
    .then((res)=>res.json()).then((data)=>setRelated(data))
  },[category, gender])

  return (
    <div className='relatedproducts w-[80%] m-auto my-6'>
      <h1 className='text-[30px] w-full text-center font-bold'>Related Products</h1>
      <hr className='rounded-lg w-[120px] h-[3px] bg-black m-auto mt-4 mb-8'/>
      <div className="relatedproducts-item grid grid-cols-4 gap-4">
        {related.map((item,index)=>
          <Item key={index} id={item._id} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>
        )}
      </div>
    </div>
  )
}

export default RelatedProducts

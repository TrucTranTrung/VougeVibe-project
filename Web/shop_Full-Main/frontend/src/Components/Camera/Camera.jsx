

import React, { useEffect, useRef, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";
import { FaCameraRotate } from "react-icons/fa6";
import { backend_url } from "../../App";
// import { ThreeDot } from "react-loading-indicators"
export const Camera = ({ show, setProducts, setCategoryList, categoryList }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dataImage, setDataImage] = useState(false);
  const [error, setError] = useState({
    "message": ""
  })

  useEffect(() => {
    const getWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        alert("Error accessing webcam");
        console.error("Error accessing webcam:", err);
      }
    };

    getWebcam();

    // Dọn dẹp khi component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(()=>{
    if(error.message === "Please wait a minute")
      return 
    const timer = setTimeout(()=>{
      setError({"message": ""})
    }, 5000)
    return ()=> clearTimeout(timer);
  }, [error.message])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob((blob) => {
        setDataImage(new File([blob], "imageCapture.png", {type: blob.type}))
      }, "image/png");
    }
  };

  const fetchApi = async ()=>{
    try{
      setError({"message": "Please wait a minute"})
      setProducts([])
      const formData = new FormData();
      formData.append("file", dataImage);
      setDataImage(false)
      const res = await fetch("http://localhost:8000/api-detect", {
        method: 'POST',
        body: formData,
      })
      if(!res.ok) return setError("Server not response")
        const data = await res.json();
      if(!data.status){
        console.log(data.message)
        return setError({"message": "Please choose the image other than"})
      }
      setCategoryList([ "Full products", ...data.dataRes[0].categorys])
      localStorage.setItem("categorys-recommented", JSON.stringify([ "Full products", ...data.dataRes[0].categorys]))
      const res_product = await fetch(`${backend_url}/findproductbyimg`,{
        method: 'POST', // Sử dụng POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            images: data.dataRes[0].data.flat().map(item => item.split('.')[0]),
            gender: data.dataRes[0].gender
        }),
      })

      const res_product_result = await res_product.json();
      localStorage.setItem("product-recommented", JSON.stringify(res_product_result))
      setProducts(res_product_result)
      setError({"message": ""})
    }catch(e){
      console.log(e)
      setError({"message": "Not connect model api yolo"})
    }

  }

  useEffect(()=>{
    if(dataImage){
      fetchApi();
    }
  }, [dataImage]);
  

  const uploadFile = () => {
    let input = document.getElementById("uploadImage");
    
    input.addEventListener("change", (e)=>{
      if(e.target.files[0] !== null){
        setDataImage(e.target.files[0]);
        input.value = '';
      }
        
    })
    input.click();
  }
  
  const changeCamera = ()=>{

  }

  return (
    <div className={`flex justify-center bg-black h-[560px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 ${show ? "w-full" : "w-0 "} relative`}>
      <video ref={videoRef} height="100%" autoPlay style={{transform: 'scale(-1, 1)'}}></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="absolute bottom-12 right-1/2 transform translate-x-1/2">
        <button onClick={()=> changeCamera()} className=" p-3 rounded-full bg-white/40  cursor-pointer hover:bg-white/60"><FaCameraRotate className="text-2xl text-black"/></button>
        <button onClick={()=> handleCapture()} className=" p-4 rounded-full bg-[#FF4141]/80  cursor-pointer hover:bg-[#ff4141]/60 mx-4"><FaCameraRetro className="text-2xl text-white"/></button>
        <button onClick={()=> uploadFile()} className="p-3 rounded-full bg-white/40  cursor-pointer hover:bg-white/60"><MdDriveFolderUpload  className="text-2xl text-black"/></button>
      </div>
      <input type="file" name="uploadImage" id="uploadImage" className="hidden" />
      <h2 className={`absolute bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-30 min-w-[100px] text-nowrap px-4 py-2 text-xl bg-gray-300 text-white text-center rounded-md bg-opacity-30 transition-all duration-200 ${error.message === "" ? "hidden": "inline-block"}`}>{error.message}</h2>
    </div>
  );
};

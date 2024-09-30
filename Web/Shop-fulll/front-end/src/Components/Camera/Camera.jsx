import React, { useEffect, useRef, useState } from "react";


export const Camera = ({show}) => {
    const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  // Khởi tạo webcam khi component được gắn vào DOM
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
      });
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasRef.current.toBlob((blob) => {
        const formData = new FormData();
        formData.append("image", blob, "capture.png");

        // Gửi dữ liệu hình ảnh đến server
        // axios
        //   .post("/upload", formData)
        //   .then((response) => {
        //     console.log("Server response:", response.data);
        //   })
        //   .catch((error) => {
        //     console.error("Error uploading image:", error);
        //   });
      }, "image/png");
    }
  };
  return (
    <div
      className={`flex justify-center bg-black  h-[560px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 ${
        show ? "w-[800px]" : "w-0"
      }`}
    >
      <video ref={videoRef} height="100%" autoPlay></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

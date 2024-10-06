import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-responsive-pagination/themes/classic.css';
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import women_banner from "./Components/Assets/banner_women.png";
import men_banner from "./Components/Assets/banner_mens.png";
import LoginSignup from "./Pages/LoginSignup";
import { ShopSuggest } from "./Pages/ShopSuggest";


// export const backend_url = 'https://shop-server-v60o.onrender.com';
export const backend_url = 'http://localhost:4000'
export const currency = '$';

function App() {
  useEffect(() => {
    AOS.init({
      // offset: 500,
      duration: 500,
      easing: "ease-in-sine",
      delay: 0,
    });
    AOS.refresh();

    const clearLocalStorage = () => {
      console.log("Clearing localStorage"); // Kiểm tra xem hàm có được gọi không
      localStorage.removeItem("product-recommented");
      localStorage.removeItem("categorys-recommented");
      localStorage.removeItem("menu")
    };

    window.addEventListener('beforeunload', clearLocalStorage);

    // Cleanup
    return () => {
      clearLocalStorage(); // Gọi hàm xóa khi component unmount
      window.removeEventListener('beforeunload', clearLocalStorage);
    };
  }, []);

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="all" />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} gender="MALE" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} gender="FEMALE" />} />
          {/* <Route path="/kids" element={<ShopCategory banner={kid_banner} gender="kids" />} /> */}
          <Route path="/suggest"  element={<ShopSuggest/>}/>
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

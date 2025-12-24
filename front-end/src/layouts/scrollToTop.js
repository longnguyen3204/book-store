import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang một cách mượt mà hoặc ngay lập tức
    window.scrollTo(0, 0);
  }, [pathname]); // Chạy lại mỗi khi pathname (đường dẫn) thay đổi

  return null;
};

export default ScrollToTop;

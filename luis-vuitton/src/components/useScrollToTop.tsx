import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location]);
};

export default useScrollToTop;

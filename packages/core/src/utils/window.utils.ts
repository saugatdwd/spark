import _ from "lodash";
import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const updateWindowWidth = _.throttle(() => {
    setWidth(window.innerWidth);
  }, 100);
  useEffect(() => {
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width <= 992 && width >= 768,
    isMediumScreen: width < 1024 && width > 767,
  };
};

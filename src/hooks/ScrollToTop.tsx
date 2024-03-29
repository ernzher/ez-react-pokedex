import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = ({ children }: any) => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/pokemons") window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;

import React, {useEffect} from 'react';
import { useLocation } from "react-router-dom";

const Employ = () => {
  const location = useLocation();
  const getCurrPath = sessionStorage.getItem("currentUrl");
  useEffect(()=> {
    if(!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', undefined);
    } else if(location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', getCurrPath);
    }
  }, []);
  return (
    <div>Not available Now</div>
  )
}
export default Employ;

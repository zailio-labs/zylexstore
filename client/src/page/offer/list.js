import React, {useEffect, useState} from 'react';
import "./css/offer.css"
import { useLocation } from "react-router-dom";
import { IoMdShareAlt } from "react-icons/io";
import { LuAlarmClock, LuPackage } from "react-icons/lu";
import { SiTrustpilot } from "react-icons/si";
import { FaHandshake } from "react-icons/fa6";
import ShimmerDownListLoading from "../../components/list_down"

const List = () => {
  const location = useLocation();
  const [list, setList] = useState({
    status: true,
    list: []
  });
  const [ref, setRef] = useState(0);
  const getCurrPath = sessionStorage.getItem("currentUrl");
  useEffect(() => {
    if(!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', undefined);
    } else if(location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', getCurrPath);
    }
  }, []);
  useEffect(() => {
    const divs = document.querySelectorAll(".item-ofr-events .image");
    
    divs.forEach(div => {
        const maxScroll = div.scrollWidth - div.clientWidth;
        const currentScroll = ref + 1;
        if (currentScroll * div.clientWidth >= maxScroll) {
            div.scrollTo({
                left: 0,
                behavior: "smooth"
            });
            setTimeout(() => setRef(0), 2500);
        } else {
            div.scrollTo({
                left: currentScroll * div.clientWidth,
                behavior: "smooth"
            });
            setTimeout(() => setRef(currentScroll), 2500);
        }
    });
}, [ref]);


  return (
    list.status === false ? 
    <ShimmerDownListLoading /> 
    : <div className="ofr-events-list">
      <div className="item-ofr-events">
      <IoMdShareAlt className="icon" size={24} />
        <div className="image">
        <img src="https://i.ibb.co/GV9cRnn/bt.jpg" alt="shoes" />
        <img src="https://i.ibb.co/4Y9T6K2/bt.jpg" alt="shoes" />
        <img src="https://i.ibb.co/GV9cRnn/bt.jpg" alt="shoes" />
        <img src="https://i.ibb.co/4Y9T6K2/bt.jpg" alt="shoes" />
        <img src="https://i.ibb.co/GV9cRnn/bt.jpg" alt="shoes" /> 
        </div>
        <div className="info">
          <h2>Shoes</h2>
          <p className="tim-evt-started"><LuAlarmClock className="time" size={16}/>started at 10:10 AM</p>
          <p id="desc">get two pair choose in just 999 rs</p>
          <div className="some-info">
            <p>99 +<LuPackage className="extra" size={13} /></p>
            <p>7@ <SiTrustpilot className="extra" size={13} /></p>
            <p>99 + <FaHandshake className="extra" size={13} /></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default List;

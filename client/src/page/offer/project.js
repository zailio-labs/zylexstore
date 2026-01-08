import React, {useCallback, useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import LoadingSearchAnimation from "../../components/loading_search";
import { FaInstagram, FaWhatsapp, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoShareSocialOutline, IoCloseSharp } from "react-icons/io5";
import "./css/project.css";

const ListOffer = () => {
  const location = useLocation();
  const [item, setitem] = useState({
    status: null,
    dom: "https://i.ibb.co/",
    selection: 2,
    price: 999,
    data: [
      {
        img: [
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      },
      {
        img: [
          "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg",
           "GV9cRnn/bt.jpg",
           "4Y9T6K2/bt.jpg"
        ],
        size: ["10","6","5","4","3"],
        color: ["red","green","yellow","blue"]
      }
    ]
  });
  const [error, setError] = useState({
    status: false,
    msg: ""
  });
  const [color, setColor] = useState(false);
  const [size, setSize] = useState(false);
  const [selection, setSelection] = useState([]);
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState(0);
  const [show, setShow] = useState(false);
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
  useEffect(()=> {
    const listImageOffers = document.querySelectorAll('.list-image-offer');
    listImageOffers.forEach((offer, index) => {
      offer.style.setProperty('--i', index); // Apply index as custom property for delay
    });
}, [item])
  useEffect(()=>{
    const div = document.querySelectorAll(".list-image-offer");
    div.forEach(d=> {
      if(d.scrollWidth - d.clientWidth === 0) return;
        if (ref * d.clientWidth >= d.scrollWidth) {
            d.scrollTo({
                left: 0,
                behavior: "smooth"
            });
            setTimeout(() => setRef(0), 3000);
        } else {
            d.scrollTo({
                left: (ref + 1) * d.clientWidth,
                behavior: "smooth"
            });
            setTimeout(() => setRef(ref + 1), 3000);
        }
    })
  },[ref]);
  useEffect(()=> {
    const dots = document.querySelectorAll(".display-image-offer .img-length p");
    dots.forEach((a,_)=> {
      if(_ === count) {
        a.style.padding = "4px 8px";
        a.style.borderRadius = "8px";
      } else {
        a.style.padding = "4px";
        a.style.borderRadius = "100%";
      }
    });
  }, [count]);
  useEffect(() => {
    const main = document.querySelector(".shop-data-offer");
    if(selection.length >= item.selection) {
      main.style.paddingBottom = "160px";
    } else if(selection.length >= 1) {
      main.style.paddingBottom = "130px";
    };
    if(show === false) return;
    const div = document.querySelector(".offer-infos-ofr");
    if(selection.length >= item.selection) {
      div.style.width ="70%";
      div.style.top ="40%";
    } else if(selection.length >= 1) {
      div.style.width ="70%";
      div.style.top ="45%";
    };
  }, [selection, show, item]);
  const loadInfo = (v) => {
    document.querySelector(".shop-data-offer").style.filter = "blur(5px)";
    setShow(v);
  };
  const closeIt = () => {
    document.querySelector(".shop-data-offer").style.filter = "none";
    setShow(false);
  }
  const scrollIt = useCallback((t) => {
    const div = document.querySelector('.image-list-spec-ofr');
    const maxScroll = div.scrollWidth;
    const currentScroll = t === "right" ? count + 1 : count - 1;
    if(currentScroll === -1) return;
    if (currentScroll * div.clientWidth >= maxScroll) {
      div.scrollTo({
                left: 0,
                behavior: "smooth"
        });
        setCount(0)
       } else {
            div.scrollTo({
                left: currentScroll * div.clientWidth,
                behavior: "smooth"
            });
            setCount(currentScroll)
        }
  }, [count]);
  const selectIt = useCallback(() => {
    if(show === false) return;
    if(!size) return setError({status: true, msg: "select a size"});
    if(!color) return setError({status: true, msg: "select a color"});
    const valuesExist = [...selection];
    valuesExist.push({
      img: item.data[show].img[0],
      size, color
    });
    if(valuesExist.length > item.selection) valuesExist.splice(0,1);
    setSelection(valuesExist);
    setShow(false);
    setColor(false);
    setSize(false);
    document.querySelector(".shop-data-offer").style.filter = "none";
  },[size,color, selection, show, item]);
  const setIt = useCallback((f, v, id) => {
    if(f === "s") {
      const value ={...item.data[show]};
      if(value.size[id] !== v) return setError({status: true,msg: "Internal Server Error"});
      const button = document.querySelectorAll(".display-size-offer button");
      button.forEach((v,_) => {
        if(_ === id) {
          return v.style.boxShadow = "0 0 10px #000"
        };
        v.style.boxShadow = "none"
      });
      setSize(v);
    } else if(f === "c") {
      const value ={...item.data[show]};
      if(value.color[id] !== v) return setError({status: true,msg: "Internal Server Error"});
      const button = document.querySelectorAll(".display-color-offer button");
      button.forEach((v,_) => {
        if(_ === id) {
          return v.style.boxShadow = "0 0 10px #000"
        };
        v.style.boxShadow = "none"
      });
      setColor(v);
    }
  }, [item, show]);
  const removeSelect = useCallback((v) => {
    const datas = [...selection];
    datas.splice(v, 1);
    setSelection(datas);
  }, [selection]);
  return (
    item.status === false ? 
    <LoadingSearchAnimation /> :
    item.status === null ? 
    <h1 id="not-offer">Offer Not available</h1> 
    : <div className="main-offer-project">
      <header className="header-w-animation-offer">
        <div id="image">
          <img src="https://i.ibb.co/4Y9T6K2/bt.jpg/" alt="hy"/>
        </div>
        <div id="info">
          <h1>shopyfy combo offer</h1>
        <FaInstagram className="ig icon" size={25}/>
        <FaWhatsapp className="wa icon" size={25}/>
        <IoShareSocialOutline className="share icon" size={25}/>
        </div>
      </header>
      <div className="shop-data-offer">
       {
        item.data.map((a,i)=>(
          <div className="list-image-offer" key={i} onClick={() => loadInfo(i)}>
            {
              a.img.map((a,i) => (
                <img src={item.dom + a} key={i}/>
              ))
            }
          </div>
        ))
       }
       </div>
       {show !== false &&
        <div className="offer-infos-ofr">
          <div className="display-image-offer">
              <>
              {
                error.status && <p id="information">{error.msg}</p>
              }
              <div className="image-list-spec-ofr">
              {
                item.data[show].img.map((a,_)=> (
                  <img src={item.dom + a} key={_} alt="shows" />
                ))
              }
              </div>
              {
                item.data[show].img.length === 2 ?
                <FaArrowRight id="right" size={30} onClick={() => scrollIt('right')}/>
                : item.data[show].img.length > 1 && 
                <>
                  <FaArrowLeft id="left" size={30} onClick={() => scrollIt('left')}/>
                  <FaArrowRight id="right" size={30} onClick={() => scrollIt('right')}/>
                </>
              }
              {
                item.data[show].img.length > 1 && 
                <div className="img-length">
              {
                item.data[show].img.map((a,_)=> (
                  <p key={_}></p>
                ))
              }
              </div>
              }
              </>
          </div>
          {
            item.data[show].size.length && <div className="display-size-offer">
              <p>size: </p>
            {
              item.data[show].size.map((a,_)=> (
                <button key={_} onClick={()=> setIt("s", a, _)}>{a}</button>
              ))
            }
          </div>
          }
          {
            item.data[show].color.length && <div className="display-color-offer">
              <p>color: </p>
            {
              item.data[show].color.map((a,_)=> (
                <button key={_} style={{
                  background: a
                }} onClick={()=> setIt("c", a, _)}></button>
              ))
            }
          </div>
          }
          <div className="accpent-or-remove-offer">
            <button onClick={closeIt}>Close</button>
            <button onClick={selectIt}>Select</button>
          </div>
         </div>
       }
       {
        selection.length && 
        <div className="slectiosn-my-offer">
          <div className="list-selection-offer">
        {
          selection.length === 1 ? 
          <>
          <div id="image">
            <img src={item.dom + selection[0].img} alt="selection" />
          </div>
          <div id="info">
            <IoCloseSharp id="rm" size={25} onClick={()=> removeSelect(0)}/>
            <p><strong>size: </strong>{selection[0].size}</p>
            <p><strong>color: </strong>{selection[0].color}</p>
            <b>Please select your secound choice</b>
          </div>
          </> :
          <>
          {
            selection.map((a,_) => (
              <div id="image-more" key={_}>
            <img src={item.dom + a.img} alt="selection" />
            <IoCloseSharp id="rm" size={17} onClick={()=> removeSelect(_)}/>
          </div>
            ))
          }
          </>
        }
        </div>
        {
          item.selection === selection.length &&
          <button id="buy-now">Buy Now</button>
        }
       </div>
       }
    </div>
  )
}

export default ListOffer;

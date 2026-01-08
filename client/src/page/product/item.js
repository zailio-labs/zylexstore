import React, { useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../../socket";
import { formatNumber, makeid } from "../../fn/fn";
import "./product.css";
import OfferList from "./offerList";
import loading from "../../assets/loading.gif";

import { IoChevronBackSharp, IoClose } from "react-icons/io5";
import { FaSearch, FaTruckMoving } from "react-icons/fa";
import { IoIosShareAlt, IoMdArrowDropright, IoMdCart } from "react-icons/io";
import { FaHandshakeSimple } from "react-icons/fa6";
import {
  RiSecurePaymentLine,
  RiRefund2Fill,
  RiExchangeBoxLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { CgUnavailable } from "react-icons/cg";
import { AiOutlineLike } from "react-icons/ai";
import { LuSendHorizonal } from "react-icons/lu";
import { CiCircleInfo } from "react-icons/ci";

export default function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("AUTH-T");
  const User = storedUser ? JSON.parse(storedUser) : {};
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const [pageMetadata, setPageMetadata] = useState({
    title: "Product Review - INRL",
    description: "Read our detailed review of the latest products on INRL.",
    ogTitle: "Product Review - INRL",
    keywords: 'inrl, shop, products, kerala, online, website',
    ogDescription: "Explore our comprehensive review of the newest products available on INRL.",
    ogType: "website",
    ogUrl: "https://www.inrl.online/product",
    ogImage: "https://www.inrl.online/icon/logo.png",
    ogSiteName: "INRL",
    twitterTitle: "Product Review - INRL",
    twitterDescription: "Get in-depth insights and reviews of the latest products on INRL.",
    twitterImage: "https://www.inrl.online/icon/logo.png",
    canonicalUrl: "https://www.inrl.online/product",
    appleTouchIcon: "https://www.inrl.online/icon/apple-touch-icon.png",
    favicon: "https://www.inrl.online/icon/favicon.ico",
    shortcutIcon: "https://www.inrl.online/icon/favicon.ico",
    maskIcon: "https://www.inrl.online/icon/safari-pinned-tab.svg",
    themeColor: "#ffffff"
  });
  const [pid, setPid] = useState(false);
  const [srh, setSrh] = useState({s: []});
  const [tick, setTick] = useState([false, false]);
  const [cart, setCart] = useState(false);
  const [basic, setBasic] = useState({color: false, size: false});
  const [popup, setPopup] = useState({
    msg: '',
    yes: '',
    args: {}
  });
  const [pAction, setPAction] = useState('');
  const [product, setProduct] = useState({
    status: false,
    isPurchased: false,
    userInfo: {},
    sellerInfo: {},
    isAvailable: false,
    category: [],
    item: {
      subtitle: "",
      img: [],
      price: 1,
      discountPrice: 1,
      LastPrice: 1,
      cashOnDelivery: "no",
      freeDelivery: "yes",
      returnPolicy: "exchange",
      description: "",
      sizeCategory: false,
      size: [],
      colorSelections: [],
      offers: []
    },
  });
  const [comments, setComments] = useState([]);
  const [scroll, setScroll] = useState(1);
  const [dot, setDot] = useState([1, 2, 3]);

  useEffect(() => {
    if (!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem("perviousUrl", undefined);
    } else if (location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem("perviousUrl", getCurrPath);
    }
    const searchOnLocal = localStorage.getItem('srh');
    if(searchOnLocal) setSrh(JSON.parse(searchOnLocal));
    const isSharedBy = location.search
      ? new URLSearchParams(location.search)
      : false;
    const sharedAddress = isSharedBy ? isSharedBy.get("id") : false;
    const shareid = isSharedBy ? isSharedBy.get("shid") : false;
    if(shareid) {
    	const list = localStorage.getItem('shid');
        const shared = list ? JSON.parse(list) : { p: []};
        shared.p.push({id: pid, shid: shareid});
        localStorage.setItem('shid', JSON.stringify(shared));
    };
    const id_product =
      location.state && location.state.id ? location.state.id : false;
    const product_id = id_product || sharedAddress;
    if (!product_id) {
      navigate("/");
    }
    setPageMetadata((a) => ({
      ...a,
      ogUrl: `${a.ogUrl}?id=${product_id}`,
      canonicalUrl: `${a.canonicalUrl}?id=${product_id}`
    }));
    setPid(product_id);
    const search = document.querySelector('.sh-pr input');
    search.addEventListener('input', function() {
        socket.emit('search-update', search.value);
    });
    socket.once('connection-success', (a) => {
            socket.emit("get-product-info", { auth: User, pid: product_id });
      });
    socket.emit("get-product-info", { auth: User, pid: product_id });
  }, []);
  useEffect(() => {
    const cmt = document.querySelector(".add-a-cmt-pr");
    const loading = document.querySelector(".loading-an-pr");
    const content = document.querySelector(".all-content-pr");
    const handleProductInfo = (prdct) => {
      if (!prdct.status) return navigate("/");
      if(!prdct.isAvailable) {
        const buy = document.querySelector('.buy-b-pr');
        const buyBut = document.querySelector('.buy-b-pr button');
        buy.style.background = 'gray';
        buyBut.style.background = 'gray';
        buyBut.style.color = '#2b2b2b';
      };
      setPageMetadata(a=> ({
          ...a,
          title: prdct.item.subtitle,
          description: prdct.item.description,
          keywords: prdct.item.tags,
          ogTitle: prdct.item.subtitle,
          ogDescription: prdct.item.description,
          ogImage: prdct.item.img[0],
          twitterTitle: prdct.item.subtitle,
          twitterDescription: prdct.item.twitterDescription,
          twitterImage: prdct.item.img[0]
      }));
      if (prdct.comments.length) setComments(prdct.comments);
      delete prdct.comments;
      if (prdct.isPurchased) cmt.style.display = "flex";
      loading.style.display = "none";
      content.style.display = "block";
      const item = [];
      for (let i = 1; i <= prdct.item.img.length; i++) {
        item.push(i);
      }
      setDot(item);
      setProduct(prdct);
    };
    socket.on('product-info', handleProductInfo);
    return () => {
      socket.off('product-info', handleProductInfo);
    };
  }, [navigate, product, socket]);
  useEffect(() => {
    const el = document.querySelector(".cmt-lists-pr");
    const cmts = [...comments];
    const fn = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        if (cmts.slice(-1)[0].type === "promise") {
          cmts.pop();
          socket.emit("load-comments", { id: pid, count: cmts.length, auth: User });
        }
      }
    };
    socket.on("new-comments", (cmt) => {
      setComments([...cmts, ...cmt]);
    });
    if(el) {
      el.addEventListener("scroll", (e) => fn(e));
      return el.removeEventListener("scroll", fn);
    };
  }, [comments, pid]);
  const addOfr = useCallback(
    (id, c, type) => {
      if (type === "add") {
        const element = document.getElementById(`offer-${id}-pr`);
        const offers = [...product.item.offers];
        element.style.background = "green";
        const all = [...tick];
        const ticks = all.map((a, i) => {
          if (i === c) return true;
          return false;
        });
        setTick(ticks);
      } else {
      }
    },
    [tick],
  );
  const openDiv = useCallback((title, id) => {
    const main = document.querySelector(".popup-pr");
    const head = document.querySelector(".top-popup-pr h2");
    head.innerText = title;
    main.style.display = "block";
    if (id === "offers") {
      const el = document.querySelector(".bottum-pr-pup");
      const offer = product.item.offers;
      const root = createRoot(el);
      root.render(
        <OfferList
          offers={offer}
          addOffer={addOfr}
          tick={tick}
          setTick={setTick}
        />,
      );
    }
  }, [product]);
  const backTo = (to) => {
    if (to === "home:cart") {
      return navigate("/#cart");
    } else {
      const back = sessionStorage.getItem("perviousUrl") || false;
      if (back !== undefined) {
        return navigate(back);
      } else {
        navigate("/");
      }
    }
  };
  const addLike = useCallback(
    (id) => {
      if(!User.reg_pkocd) {
      const info = document.querySelector(".infos-pr");
      info.style.display = "block";
      info.innerText = "can't add or remove likes befor a successful login";
      setTimeout(() => {
        info.style.display = "none";
      }, 4200);
    } else {
      const cmt = comments.filter((a) => a.id === id)[0];
      const btn = document.querySelector(`#${id}cmt-like`);
      const likes = document.querySelector(`#${id}cmt-count`);
      const edited = [...comments];
      if (cmt.liked === false) {
        btn.style.color = "#0000FF";
        btn.style.bottom = '13px';
        const likesToFormat = typeof cmt.likes.length === 'number' ? cmt.likes + 1  : cmt.likes.length + 1; 
        likes.innerText = formatNumber(likesToFormat);
        socket.emit("add-cmt-like", { auth: User, id: pid, cmtId: id });
        const newCmt = edited.map((e) => {
          if (id === e.id) {
            return { ...e, liked: true };
          }
          return e;
        });
        setComments(newCmt);
      } else {
        setPopup({
          msg: 'did your really want to remove this like?',
          yes:'like',
          args: { id }
        });
        document.querySelector(".popup").style.display = "block";
        document.querySelector(".all-content-pr").style.filter = 'blur(10px)';
      }
    }
    },
    [comments, pid, User],
  );
  const share = useCallback(
    (title, description) => {
      if (navigator.share) {
        navigator
          .share({
            title: title,
            text: description,
            url: `${window.location.href}?id=${pid}`,
          })
          .then(() => {
            console.log("Content shared successfully");
          })
          .catch((error) => {
            console.error("Error sharing content:", error);
          });
      } else {
        alert("Web Share API is not supported in your browser.");
      }
    },
    [pid],
  );
  const run = useCallback(
    (e) => {
      const scrollableDiv = document.querySelector(".listed-img-pr");
      const elemnts = Array.from(scrollableDiv.children);
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) {
        scrollableDiv.scrollTo({
          left: (scrollableDiv.scrollWidth / elemnts.length) * scroll,
          behavior: "smooth",
        });
        if (scroll === 1) {
          scrollableDiv.scrollTo({
            left: (scrollableDiv.scrollWidth / elemnts.length) * elemnts.length,
            behavior: "smooth",
          });
          setScroll(elemnts.length);
        } else {
          scrollableDiv.scrollBy({
            left: -scrollableDiv.scrollWidth / elemnts.length,
            behavior: "smooth",
          });
          setScroll((a) => a - 1);
        }
      } else {
        if (scroll === elemnts.length) {
          scrollableDiv.scrollTo({
            left: 0,
            behavior: "smooth",
          });
          setScroll(1);
        } else {
          scrollableDiv.scrollTo({
            left: (scrollableDiv.scrollWidth / elemnts.length) * scroll,
            behavior: "smooth",
          });
          setScroll((a) => a + 1);
        }
      }
    },
    [scroll],
  );
  const Color = useCallback(
    (c) => {
      const colors = product.item.colorSelections;
      const elment = document.getElementById(`color-s-pr${c}`);
      colors.forEach((a) => {
        if (a === c) {
          elment.style.margin = "10px 10px 0 0";
          elment.style.boxShadow = `0 0 10px ${c}`;
          setBasic(m=>({
          	...m,
              color: a
}));
        } else {
          const elemnt = document.getElementById(`color-s-pr${a}`);
          elemnt.style.margin = "10px 8px 0 0";
          elemnt.style.boxShadow = "none";
        }
      });
    },
    [product, basic],
  );
  const Size = useCallback(
    (s) => {
      const sizes = product.item.size;
      const elment = document.getElementById(`size-ca-pr${s}`);
      sizes.forEach((a) => {
        if (a === s) {
          elment.style.margin = "0 10px 0 0";
          elment.style.boxShadow = `0 0 15px #9f2089`;
          setBasic(m=>({
          	...m,
              size: a
}));
        } else {
          const elemnt = document.getElementById(`size-ca-pr${a}`);
          elemnt.style.margin = "0 8px 0 0";
          elemnt.style.boxShadow = "none";
        }
      });
    },
    [product, basic],
  );
  const addCmt = useCallback(
    (e) => {
      e.preventDefault();
      if(!User.reg_pkocd) {
      const info = document.querySelector(".infos-pr");
      info.style.display = "block";
      info.innerText = "can't add comments befor a successful login";
      setTimeout(() => {
        info.style.display = "none";
      }, 4200);
    } else {
      const text = document.querySelector(".add-a-cmt-pr input");
      if (!text.value) {
        text.placeholder = "writing something usefull!";
        setTimeout(() => {
          text.placeholder = "add a review...";
        }, 2500);
      } else {
        const cmts = [...comments];
        const msgs = [
          {
            username: product.userInfo.username,
            cmt: text.value,
            likes: [],
            img: product.userInfo.img,
            type: "info",
            id: makeid(),
            userId: User.reg_pkocd,
            me: true,
            pid: pid,
          },
        ];
        text.value = "";
        setComments(msgs.concat(cmts));
        socket.emit("add-a-comment", msgs);
      }
    }
    },
    [comments, pid, product, User],
  );
  const removeCmt = (id) => {
      setPopup({
        msg: 'did your really want to remove this comment?',
        yes:'comment',
        args: { id }
      });
      document.querySelector(".popup").style.display = "block";
      document.querySelector(".all-content-pr").style.filter = 'blur(10px)';
  };
  const cartUpdate = useCallback(() => {
    if(!User.reg_pkocd) {
      const info = document.querySelector(".infos-pr");
      info.style.display = "block";
      info.innerText = "can't update carts before a successful login";
      setTimeout(() => {
        info.style.display = "none";
      }, 4200);
    } else {
      const el = document.querySelector(".cart-b-pr button");
      if (cart === false) {
        socket.emit("add-to-cart", { auth: User, id: pid });
        setCart(true);
        el.innerText = "Go to cart";
      } else {
        return navigate("/#cart");
      }
    }
  }, [cart, pid, User]);
  function giveInfo(t) {
    const info = document.querySelector(".infos-pr");
    info.style.display = "block";
    info.innerText = t;
    setTimeout(() => {
      info.style.display = "none";
    }, 4200);
  }
  const close = () => {
    const main = document.querySelector(".popup-pr");
    main.style.display = "none";
  };
  const closePopup = () => {
    document.querySelector(".all-content-pr").style.filter = 'none';
    document.querySelector(".popup").style.display = "none";
  };
  useEffect(()=> {
    const cmt = [...comments];
    if(pAction === 'comment') {
      const Newcmts = cmt.filter(a=> a.id !== popup.args.id);
      socket.emit('remove-a-cmt', {id: popup.args.id, pid, auth: User});
      setPopup({msg: '', yes: '',args: {}});
      setComments(Newcmts);
      setPAction('');
    } else if(pAction === 'like') {
      const btn = document.querySelector(`#${popup.args.id}cmt-like`);
      const likes = document.querySelector(`#${popup.args.id}cmt-count`);
      const newCmt = cmt.map((e) => {
          if (popup.args.id === e.id) {
            return { ...e, liked: false, likes: e.likes - 1 };
          }
          return e;
        });
        setComments(newCmt);
        setPopup({msg: '', yes: '',args: {}});
        setPAction('');
        likes.innerText = "";
        btn.style.color = "#000";
        btn.style.bottom = '0';
        socket.emit("remove-cmt-like", { auth: User, id: pid, cmtId: popup.args.id });
    };
  }, [pAction, comments, User, pid, popup])
  const runAction = (v) => {
    document.querySelector(".all-content-pr").style.filter = 'none';
    document.querySelector(".popup").style.display = "none";
    setPAction(v);
  }
  const search = (e) => {
    const main = document.querySelector('.all-content-pr');
    const sh = document.querySelector('.perform-sh-pr');
    main.style.display = 'none';
    sh.style.display = 'block';
  };
  const RunASearch = (txt) => {
    if(txt) {
      return navigate(`/search?id=${txt}`);
    } else {
     const v = document.querySelector('.sh-pr input');
     if(!v.value) return v.placeholder = 'enter something to search..';
     const data = localStorage.getItem('srh');
     const search = data ? JSON.parse(data) : {s: []};
     search.s.push({search: v.value, type: 'local', id: makeid(8) });
     localStorage.setItem('srh', JSON.stringify(search));
     return navigate(`/search?id=${v.value}`);
    };
  };
  const dltSearch = (id) => {
    const data = localStorage.getItem('srh');
    const search = data ? JSON.parse(data) : {s: []};
    const res = search.s.filter(a=>a.id !== id);
    localStorage.setItem('srh', JSON.stringify({s: res}));
    setSrh({s: res});
  };
  const stopSearch = (e) => {
    const main = document.querySelector('.all-content-pr');
    const sh = document.querySelector('.perform-sh-pr');
    main.style.display = 'block';
    sh.style.display = 'none';
  }
  const goCategory = (id) => {
    return navigate(`/category/${id}`)
  }
  const buyNow = useCallback(() => {
    if(!product.isAvailable) {
      const info = document.querySelector(".infos-pr");
      info.style.display = "block";
      info.innerText = 'item not available at now';
      setTimeout(() => {
        info.style.display = "none";
      }, 3500);
    } else {
      sessionStorage.setItem('set-done-info', JSON.stringify({basic, id: pid }));
      return navigate(`/placeorder/${pid}`);
    };
  }, [product, basic, pid]);
  return (
    <div className="main-div-pr">
    <Helmet>
      <title>{pageMetadata.title}</title>
      <meta name="description" content={pageMetadata.description} />
      <meta name="keywords" content={pageMetadata.keywords} />
      <meta property="og:title" content={pageMetadata.ogTitle} />
      <meta property="og:description" content={pageMetadata.ogDescription} />
      <meta property="og:type" content={pageMetadata.ogType} />
      <meta property="og:url" content={pageMetadata.ogUrl} />
      <meta property="og:image" content={pageMetadata.ogImage} />
      <meta property="og:site_name" content={pageMetadata.ogSiteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMetadata.twitterTitle} />
      <meta name="twitter:description" content={pageMetadata.twitterDescription} />
      <meta name="twitter:image" content={pageMetadata.twitterImage} />
      <link rel="canonical" href={pageMetadata.canonicalUrl} />
      <link rel="apple-touch-icon" href={pageMetadata.appleTouchIcon} />
      <link rel="icon" href={pageMetadata.favicon} />
      <link rel="shortcut icon" href={pageMetadata.shortcutIcon} />
      <link rel="mask-icon" href={pageMetadata.maskIcon} color={pageMetadata.themeColor} />
      <meta name="theme-color" content={pageMetadata.themeColor} />
  </Helmet>
      <img src={loading} alt="loading" className="loading-an-pr" />
      <div className="popup">
        <div>
           <span onClick={closePopup}>&times;</span>
           <p>{popup.msg}</p>
           <button onClick={()=>runAction(popup.yes)}>Yes</button>
           <button onClick={closePopup}>No</button>
       </div>
      </div>
      <div className="perform-sh-pr">
      <div className="sh-pr">
      <IoClose className="cls-pr" onClick={stopSearch}/>
      <input type="text" placeholder="search something.."/>
      <FaSearch className="search-two-pr" onClick={RunASearch}/>
      </div>
      <div className="old-sc-pr">
          {srh.s.map((a, i) => (
            <div className="pr-list-sh" key={i}>
              <p onClick={()=> RunASearch(a.search)}>{a.search}</p>
              {a.type === "local" ? <RiDeleteBin6Line className="pr-sh-del" onClick={()=>dltSearch(a.id)}/> : null}
            </div>
          ))}
        </div>
      <div className="category-sh-pr">
        <h3>Tending categories</h3>
        {
          product.category.map(a=>(
            <button
              onClick={()=>goCategory(a.category)}
              >{a.display}
            </button>
          ))
        }
      </div>
    </div>
      <div className="all-content-pr">
        <div className="infos-pr"></div>
        <div className="main-pr">
          <IoChevronBackSharp className="back-pr-main" onClick={backTo} />
          <p onClick={backTo}>Home</p>
          <FaSearch onClick={search} className="search-pr" />
          <IoMdCart onClick={() => backTo("home:cart")} className="cart-pr" />
        </div>
        <div className="listed-img-pr">
          {product.item.img.map((img, index) => (
            <img key={index} src={img} alt="img" onClick={run} />
          ))}
        </div>
        <div className="dot-show-pr">
          {dot.map((a, index) =>
            scroll === dot.indexOf(a) + 1 ? (
              <p
                style={{
                  color: "gray",
                }}
                key={index}
              >
                -
              </p>
            ) : (
              <p key={index}>-</p>
            ),
          )}
        </div>
        {
          product.isAvailable === false ? 
            <div className="una-pr">
            item not available at now
            </div> : null
        }     
        <div className="pr-info-pr">
          <h3>{product.item.subtitle}</h3>
          <div className="price-pr">
            <h1>₹{product.item.discountPrice}</h1>
            <del>₹{product.item.price}</del>
            <p>
              <span>
                {Math.ceil(((product.item.price-product.item.LastPrice) / product.item.price) * 100)}
                %{" "}
              </span>{" "}
              discount
            </p>
            <IoIosShareAlt
              onClick={() =>
                share(product.item.subtitle, product.item.description)
              }
              className="share-pr"
            />
          </div>
          {product.item.offers && product.item.offers.length !== 0 ? (
            <button
              className="extra-dis-pr"
              onClick={() => openDiv("Extra offees", "offers")}
            >
              get it low as ₹{product.item.LastPrice}
            </button>
          ) : null}
          <p>{product.item.description}</p>
        </div>
        <div className="split-pr"></div>
        <div className="pr-major-info">
          {product.item.cashOnDelivery === "both" ? (
            <div>
              <FaHandshakeSimple className="mi-icon-pr" />
              <p>
                cash only delivery: <span>Yes</span>
              </p>
            </div>
          ) : (
            <div>
              <RiSecurePaymentLine className="mi-icon-pr" />
              <p>cash only delivery: no</p>
            </div>
          )}
          {product.item.freeDelivery === "yes" ? (
            <div>
              <FaTruckMoving className="mi-icon-pr" />
              <p>
                free delivery: <span>Yes</span>
              </p>
            </div>
          ) : (
            <div>
              <FaTruckMoving className="mi-icon-pr" />
              <p>
                delivery charge: <span>{product.item.freeDelivery}rs</span>
              </p>
            </div>
          )}
          {product.item.returnPolicy === "no" ? (
            <div>
              <CgUnavailable className="mi-icon-pr" />
              <p>
                <span>refund unavailable</span>
              </p>
            </div>
          ) : product.item.returnPolicy === "exchange" ? (
            <div>
              <RiExchangeBoxLine className="mi-icon-pr" />
              <p>
                <span>exchange available</span>
              </p>
            </div>
          ) : (
            <div>
              <RiRefund2Fill className="mi-icon-pr" />
              <p>
                return possibility: <span>{product.item.returnPolicy}</span>
              </p>
            </div>
          )}
        </div>
        <div className="split-pr"></div>
        {product.item.colorSelections !== 'no' ? (
          <div>
            <div className="color-ca-pr">
              <h3>choose a color</h3>
              {product.item.colorSelections.map((a, index) => (
                <div
                  style={{
                    background: a,
                    border: "1px solid gray",
                    width: "35px",
                    height: "35px",
                    display: "inline-flex",
                    margin: "10px 5px 0 0",
                  }}
                  id={`color-s-pr${a}`}
                  onClick={() => Color(a)}
                  key={index}
                ></div>
              ))}
            </div>
            <div className="split-pr"></div>
          </div>
        ) : null}
        {product.item.sizeCategory !== 'no' ? (
          <div>
            <div className="size-ca-pr">
              <h3>Select a Size</h3>
              {product.item.size.map((a, index) => (
                <button
                  id={`size-ca-pr${a}`}
                  onClick={() => Size(a)}
                  key={index}
                >
                  {a}
                </button>
              ))}
            </div>
            <div className="split-pr"></div>
          </div>
        ) : null}
        <div className="admn-info-pr">
          <h3>seller info</h3>
          <div className="admin-info-pr">
            {product.sellerInfo.isTrusted ? (
              <p>
                trusted by <span>inrl</span>
              </p>
            ) : null}
            <img src={product.sellerInfo.img} alt="admin-uaid" />
            <h3>{product.sellerInfo.name}</h3>
            <div>
              <a href={product.sellerInfo.ig} className="a-info-pr-ig">
                Instagram
              </a>
              <a href={product.sellerInfo.wa} className="a-info-pr-wa">
                whastapp
              </a>
            </div>
          </div>
        </div>
        <div className="split-pr"></div>{" "}
        <div className="cmds-info-pr">
          <CiCircleInfo
            onClick={() =>
              giveInfo(
                "please purchase this product to add your thoughts about this product",
              )
            }
            className="how-i-cmd-pr"
          />
          {comments.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                margin: 0,
                fontWeight: 1000,
                fontSize: "17px",
                opacity: 0.6,
              }}
            >
              products reviews unavailable
            </p>
          ) : (
            <div>
              <h3>list of reviews</h3>

              <div className="cmt-lists-pr">
                {comments.map((a, index) =>
                  a.type === "info" ? (
                    <div className="cmt-list-pr" key={index}>
                      <img src={a.img} alt="profile-info" />
                      <div>
                        <h3>{a.username}</h3>
                        <p>{a.cmt}</p>
                      </div>
                      {a.me === false ? (
                        <div
                          className="cmt-like-ct-pr"
                          onClick={() => addLike(a.id)}
                        >
                        <div className="right-like-pr"> 
                          <AiOutlineLike
                            className="likes-add-pr"
                            id={`${a.id}cmt-like`}
                          />
                          <p
                            className="likes-count-pr"
                            id={`${a.id}cmt-count`}
                          ></p>
                        </div>
                      </div>
                      ) : (
                        <div
                          className="cmt-like-ct-pr"
                          onClick={() => removeCmt(a.id)}
                        >
                          <RiDeleteBin6Line
                            className="rm-cmt-pr"
                            id={`${a.id}cmt-like`}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="cmt-ld-pr" key={index}>
                      Loading...
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
              <form className="add-a-cmt-pr" onSubmit={addCmt}>
                <input type="text" placeholder="add a review..." />
                <LuSendHorizonal className="send-cmt-pr" onClick={addCmt} />
              </form>
        </div>
        <div className="bottom-pr">
          <div className="cart-b-pr">
            <IoMdCart className="icon-cart-pr" />
            <button onClick={cartUpdate}>Add to Cart</button>
          </div>
          <div className="buy-b-pr">
            <IoMdArrowDropright className="icon-buy-pr" />
            <button onClick={buyNow}>Buy Now</button>
          </div>
        </div>
        <div className="popup-pr">
          <div className="top-popup-pr">
            <h2>Loading...</h2>
            <IoClose onClick={close} className="close-event-pr" />
          </div>
          <div className="bottum-pr-pup"></div>
        </div>
      </div>
    </div>
  );
}

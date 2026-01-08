import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { socket } from "../../socket";
import { roundNumber, makeid } from "../../fn/fn";
import loading from "../../assets/loading.gif";
import "./search.css";

import { FaSearch } from "react-icons/fa";
import { IoChevronBackSharp, IoClose } from "react-icons/io5";
import { IoMdCart, IoIosHeart } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { VscWorkspaceTrusted } from "react-icons/vsc";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sid, setSid] = useState("");
  const [bcount, setBcount] = useState("500+");
  const [category, setCategory] = useState([]);
  const [srh, setSrh] = useState({ s: [] });
  const [isan, setIsan] = useState(false);
  const storedUser = localStorage.getItem("AUTH-T");
  const User = storedUser ? JSON.parse(storedUser) : {};
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const [product, setProduct] = useState({
    status: false,
    list: [],
  });
  const [popup, setPopup] = useState({
    msg: '',
    yes: '',
    args: {}
  });
  const [cart, setCart] = useState([]);
  const [pageMetadata, setPageMetadata] = useState({
    title: "Product Search - INRL",
    description: "Search and find detailed information about the latest products on INRL.",
    ogTitle: "Product Search - INRL",
    keywords: "inrl, shop, products, kerala, online, website, search",
    ogDescription: "Discover a wide range of products available on INRL with our comprehensive search feature.",
    ogType: "website",
    ogUrl: "https://www.inrl.online/search",
    ogImage: "https://www.inrl.online/icon/logo.png",
    ogSiteName: "INRL",
    twitterTitle: "Product Search - INRL",
    twitterDescription: "Find and explore products easily with our detailed search feature on INRL.",
    twitterImage: "https://www.inrl.online/icon/logo.png",
    canonicalUrl: "https://www.inrl.online/search",
    appleTouchIcon: "https://www.inrl.online/icon/apple-touch-icon.png",
    favicon: "https://www.inrl.online/icon/favicon.ico",
    shortcutIcon: "https://www.inrl.online/icon/favicon.ico",
    maskIcon: "https://www.inrl.online/icon/safari-pinned-tab.svg",
    themeColor: "#ffffff"
  });

  useEffect(() => {
    const main = document.querySelector(".search-content-sr");
    if (!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem("perviousUrl", undefined);
    } else if (location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem("perviousUrl", getCurrPath);
    }
    const searchOnLocal = localStorage.getItem("srh");
    if (searchOnLocal) setSrh(JSON.parse(searchOnLocal));
    const isSharedBy = location.search
      ? new URLSearchParams(location.search)
      : false;
    const sharedAddress = isSharedBy ? isSharedBy.get("id") : false;
    const id_product =
      location.state && location.state.id ? location.state.id : false;
    const search_id = id_product || sharedAddress;
    if (!search_id) {
      navigate("/");
    } else {
      setSid(search_id);
      setPageMetadata((a) => ({
        ...a,
        ogUrl: `${a.ogUrl}?id=${search_id}`,
        canonicalUrl: `${a.canonicalUrl}?id=${search_id}`
      }));
      socket.once("connection-success", (a) => {
        socket.emit("get-searched-output", { auth: User, sid: search_id });
      });
      socket.emit("get-searched-output", { auth: User, sid: search_id });
      socket.on("search-results", (v) => {
        if (v.status === true) main.style.display = "block";
        if(v.category) setCategory(v.category);
        delete v.category;
        setProduct(v);
        setPageMetadata(a=> ({
          ...a,
          title: v.list[0].title,
          ogTitle: v.list[0].title,
          ogImage: v.list[0].img,
          twitterTitle: v.list[0].title,
          twitterImage: v.list[0].img
      }));
      });
    }
  }, []);

  useEffect(() => {
    const element = document.querySelector(".pr-list-sr");
    const lastP = [...product.list];
    const last = lastP[lastP.length - 2];
    if(last) {
    const typeofLast = lastP[lastP.length - 1];
    const elementLast = document.getElementById(`prdct-sr${last.id}`);

    product.list.forEach((a) => {
      setBcount(roundNumber(a.buys));
      if (a.isAvailable === false) {
        const id = document.getElementById(`prdct-info-sr${a.id}`);
        if (id) {
          id.style.filter = "blur(1px)";
        }
      };
      if(a.cart === true) {
        const element = document.getElementById(`cart-sr${a.id}`);
        element.background = "#fff";
        element.color = "#c25151";
        setCart(c=>[...c, a.id]);
      }
    });
    if (typeofLast.type !== "info" && elementLast) {
      elementLast.style.marginBottom = "20px";
    }

    const checkout = () => {
      if (
        element.scrollTop + element.clientHeight >= element.scrollHeight &&
        typeofLast.type !== "info"
      ) {
        socket.emit("load-new-product", { auth: User, sid: sid });
      }
    };
    const handleProductInfo = (p) => {
      lastP.pop();
      lastP.concat(p);
      setProduct((a) => ({
        ...a,
        list: [...lastP],
      }));
    };
    socket.on("new-search-result", handleProductInfo);
    element.addEventListener("scroll", checkout);

    return () => {
      socket.off("new-search-result", handleProductInfo);
      element.removeEventListener("scroll", checkout);
    };
  }
  }, [product, sid]);
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
  const search = (e) => {
    const category = document.querySelector(".head-sr");
    const main = document.querySelector(".pr-list-sr");
    const sh = document.querySelector(".perform-sh-sr");
    main.style.filter = "blur(10px)";
    sh.style.display = "block";
    category.style.display = "none";
  };
  const stopSearch = (e) => {
    const category = document.querySelector(".head-sr");
    const main = document.querySelector(".pr-list-sr");
    const sh = document.querySelector(".perform-sh-sr");
    main.style.filter = "none";
    sh.style.display = "none";
    category.style.display = "flex";
  };

  const RunASearch = (txt) => {
    if(txt) {
      console.log(txt, typeof txt);
      return navigate(`/search?id=${txt}`, {replace: true});
    } else {
    const v = document.querySelector(".sh-sr input");
    if (!v.value) return (v.placeholder = "enter something to search..");
    const data = localStorage.getItem("srh");
    const search = data ? JSON.parse(data) : { s: [] };
    search.s.push({ search: v.value, type: "local", id: makeid(8) });
    localStorage.setItem("srh", JSON.stringify(search));
    return navigate(`/search?id=${v.value}`, {replace: true});
    };
  };
  const dltSearch = (id) => {
    const data = localStorage.getItem("srh");
    const search = data ? JSON.parse(data) : { s: [] };
    const res = search.s.filter((a) => a.id !== id);
    localStorage.setItem("srh", JSON.stringify({ s: res }));
    setSrh({ s: res });
  };
  const goCategory = (id) => {
    return navigate(`/category/${id}`);
  };
  const loadProduct = (id) => {
    navigate("/product", { state: { id } });
  };
  const cartUpdate = useCallback((id) => {
    const element = document.getElementById(`cart-sr${id}`);
    const info = document.querySelector('.info-sr-nt');
    if(!User.reg_pkocd) {
      if(isan) {
          clearTimeout(isan);
          info.style.animation = 'none';
      };
      info.style.display = "block";
      info.innerText = "can't update carts before a successful login";
      info.style.animation = 'notficationPopUp 4s';
      const time = setTimeout(() => {
        info.style.display = "none";
      }, 7200);
      console.log(time);
      setIsan(time);
    } else {
      const info = document.querySelector('.info-sr-nt');
      if (!cart.includes(id)) {
        socket.emit("add-to-cart", { auth: User, id: sid });
        setCart(a=>[...a, id]);
        if(isan) {
          clearTimeout(isan);
          info.style.animation = 'none';
        };
        element.style.color = "#c25151";
        element.style.background = "#fff";
        info.style.display = "block";
        info.innerText = "added to cart";
        info.style.animation = 'notficationPopUp 2s';
        const time = setTimeout(() => {
          info.style.display = "none";
        }, 5000);
        console.log(time);
        setIsan(time);
      } else {
            setPopup({
              msg: 'did your really want to remove this product from cart?',
              yes:'cart',
              args: { id }
            });
            document.querySelector(".popup-sr").style.display = "block";
            document.querySelector(".pr-list-sr").style.filter = 'blur(10px)';
      };
    }
  }, [cart, sid, User, isan]);
  const runAction = useCallback((v) => {
    document.querySelector(".pr-list-sr").style.filter = 'none';
    document.querySelector(".popup-sr").style.display = "none";
    if(v === 'cart') {
        const carts = [...cart];
        const newCart = carts.filter(a=> a !== popup.args.id);
        setCart([...newCart]);
        const element = document.getElementById(`cart-sr${popup.args.id}`);
        element.style.color = "#fff";
        element.style.background = "#c25151";
        setPopup({msg: '', yes: '',args: {}});
    };
  }, [cart, popup]);
  const closePopup = () => {
    document.querySelector(".pr-list-sr").style.filter = 'none';
    document.querySelector(".popup-sr").style.display = "none";
  };
  return (
    <div className="search-res">
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
      {product.status === false ? (
        <img className="loading-sr" src={loading} alt="loading" />
      ) : product.status === "error" ? (
        <h4 className="e-s-e-sr">Internal server error!</h4>
      ) : null}
      <div className="popup-sr">
        <div>
           <span onClick={closePopup}>&times;</span>
           <p>{popup.msg}</p>
           <button onClick={()=>runAction(popup.yes)}>Yes</button>
           <button onClick={closePopup}>No</button>
       </div>
      </div>
      <div className="search-content-sr">
        <div className="info-sr-nt">loading...</div>
        <div className="perform-sh-sr">
          <div className="sh-sr">
            <IoClose className="cls-sr" onClick={stopSearch} />
            <input type="text" placeholder="search something.." />
            <FaSearch className="search-two-sr" onClick={RunASearch} />
          </div>
          <div className="old-sc-sr">
            {srh.s.map((a, i) => (
              <div className="sr-list-sh" key={i}>
                <p onClick={()=> RunASearch(a.search)}>{a.search}</p>
                {a.type === "local" ? (
                  <RiDeleteBin6Line
                    className="dlt-my-sh"
                    onClick={() => dltSearch(a.id)}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="category-sh-sr">
            <h3>Tending categories</h3>
            {category.map((a, key) => (
              <button key={key} onClick={() => goCategory(a.category)}>
                {a.display}
              </button>
            ))}
          </div>
        </div>
        <div className="head-sr">
          <IoChevronBackSharp className="back-sr-hd" onClick={backTo}/>
          <h3>{sid}</h3>
          <IoMdCart className="sr-sr-hd" onClick={()=>backTo('home:cart')}/>
          <FaSearch className="sr-ca-hd" onClick={search} />
        </div>
        <div className="pr-list-sr">
          {product.list.map((a, i) => (
            <div key={i}>
              {a.type === "info" ? (
                <div className="pr-sr" id={`prdct-sr${a.id}`}>
                  {a.isAvailable === false ? (
                    <div className="sld-ot-sr"> item sold out</div>
                  ) : null}
                  <IoIosHeart className="add-crt-sr" id={`cart-sr${a.id}`} onClick={()=> cartUpdate(a.id)}/>
                  <div id={`prdct-info-sr${a.id}`}>
                    <img src={a.img} alt="img" />
                    <div className="p-info-sr" onClick={() => loadProduct(a.id)}>
                      <h3>{a.title}</h3>
                      <p className="prc-sr">₹{a.discountPrice} onwards</p>
                      <p className="l-s-sr">get it low as ₹{a.LastPrice}</p>
                      {a.freeDelivery === "yes" ? (
                        <p className="f-dl-sr">free delivery</p>
                      ) : (
                        <p className="f-dl-sr">
                          <span>
                            {Math.ceil(
                              ((a.price - a.LastPrice) / a.price) * 100,
                            )}
                            %
                          </span>{" "}
                          discount
                        </p>
                      )}
                      <div className="tt-sr">
                        <BiSolidPurchaseTag className="bct-sr" />
                        <p>{bcount}</p>
                      </div>
                      {a.isTrusted ? (
                        <div className="tr-sr">
                          <VscWorkspaceTrusted className="trstd-sr" />
                          <p>inrl</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loading-new-sr">Loading</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

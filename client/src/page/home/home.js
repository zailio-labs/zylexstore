import React, { useState, useRef, useEffect, useCallback } from "react";
import "./home.css";
import { useNavigate, useLocation } from "react-router-dom";
import UAParser from 'ua-parser-js';
import { socket } from "../../socket";
import { sleep } from "../../fn/fn";
import axios from "axios";
import image from "../../assets/logo.jpg";
import loading from "../../assets/loading.gif";
import useMetadata from '../../helmet';

import { FaRegCircleUser } from "react-icons/fa6";
import { CiLocationOn, CiDeliveryTruck, CiUser } from "react-icons/ci";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoIosPricetag, IoMdSearch, IoIosNotifications, IoMdArrowDropdown } from "react-icons/io";
import { BiSupport } from "react-icons/bi";
import { FaExchangeAlt, FaShoppingCart } from "react-icons/fa";
import { IoHome, IoHeart, IoHeadsetOutline, IoCloseSharp } from "react-icons/io5";
import { MdDownloadDone, MdOutlineWatch } from "react-icons/md";
import { GiRunningShoe, GiAmpleDress } from "react-icons/gi";
import { TbCarSuv } from "react-icons/tb";
import { PiTShirtDuotone } from "react-icons/pi";
import { RiShareForward2Line } from "react-icons/ri";



const Home = () => {
  const helmet = useMetadata('home');
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const storedUser = localStorage.getItem('AUTH-T');
  const User = storedUser ? JSON.parse(storedUser) : {};
  const [accInfo, setAcc] = useState(false);
  const [cartMsg, setcartMsg] = useState({
    status: false,
    msg: "not found",
    list: [],
  });
  const [offers, setOffers] = useState({
    status: false,
    price: "not found",
    title: "not found",
    desc: "not found",
    img: "not found",
    id: false
  });
  const [product, setProduct] = useState({
    description: 'We are here for unbeatable deals.',
    status: false,
    1: {
      scroll: 1,
      px: 0,
      head: "Today Offer's",
      list: [],
    },
    2: {
      scroll: 1,
      px: 0,
      head: "Shoes",
      list: [],
    },
    3: {
      scroll: 1,
      px: 0,
      head: "Watches",
      list: [],
    },
  });
  const [openProfile, setopenProfile] = useState({
    1: false,
    2: false,
    3: false
  });
  const [profileValues, setProfileValues] = useState({
    client: {},
    product: 0,
    earning: 0
  });
  const [showInfo, setShowInfo] = useState(false);
  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    const rootes = ['cart', 'notification','account'];
    if(!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', undefined);
    } else if(location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', getCurrPath);
      socket.emit("home-updates", { auth: User });
    }
    const animation = document.querySelector(".loading-home");
    const head = document.querySelector(".head-home");
    const mainDiv = document.querySelector(".main-homepage");
    const cart = document.querySelector(".home-cart");
    const notification = document.querySelector(".home-notification");
    const profile = document.querySelector(".home-profile");
    const cartIcon = document.getElementById("home-icon-cart");
    const notificationIcon = document.getElementById("home-icon-notification");
    const profileIcon = document.getElementById("home-icon-profile");
    const homeIcon = document.getElementById("home-icon-home");
    
    const isSharedBy = location.search ? new URLSearchParams(location.search) : false;
    const sharedAddress = isSharedBy ? isSharedBy.get('refer_smr_id') : false;
    if(!User || !User.reg_pkocd) {
      if(sharedAddress) {
        localStorage.setItem('AUTH-T', JSON.stringify({
          from_ref_id: sharedAddress,
          reg_pkocd: false,
          next_my_ref: undefined
        }));
      }
    }
    if (location.hash) {
      const hash = location.hash.substring(1);
      if(rootes.includes(hash)) {
        if(hash === 'cart') {
          animation.style.display = 'none';
          head.style.display = 'flex';
          mainDiv.style.display = "none";
          cart.style.display = "block";
          notification.style.display = "none";
          profile.style.display = "none";
          cartIcon.style.background = "gray";
          cartIcon.style.color = "white";
          homeIcon.style.background = "#fff";
          homeIcon.style.color = "#000";
          notificationIcon.style.background = "#fff";
          notificationIcon.style.color = "#000";
          profileIcon.style.background = "#fff";
          profileIcon.style.color = "#000";
          socket.emit("cart-update", {
              auth: User
            });
        } else if(hash === 'notification') {

        } else {

        }
      }
    } else {
      homeIcon.style.background = "gray";
      homeIcon.style.color = "white";
      socket.on('connection-success', (a) => {
          socket.emit("home-updates", { 
            auth: User,
            browser: `${result.browser.name} ${result.browser.version}`,
            os: `${result.os.name} ${result.os.version}`,
            device: result.device.model ? `${result.device.vendor} ${result.device.model} (${result.device.type})` : 'Unknown Device'
          });
      });
    };
    socket.on("lists-of-products-home", (product) => {
      const animation = document.querySelector(".loading-home");
      const home = document.querySelector(".loading-main-homepage");
      home.style.display = "block";
      animation.style.display = "none";
      setProduct(product);
      if(!product.client && User && User.reg_pkocd) {
          let b = User;
          b.reg_pkocd = false;
          localStorage.setItem("AUTH-T", JSON.stringify(b));
          const error = document.querySelector(".error-home");
          error.style.display = "block";
          error.innerText = "Internal server Error!";
          setTimeout(() => {
            error.style.display = "none";
          }, 2250);
       } else {
          setAcc(product.client);
       }
    });
    
    socket.on("top-today-offers", (offer) => {
      setOffers(offer);
    });
    if (User && User.reg_pkocd) {
      socket.on("cart-updates", (list) => {
        setcartMsg(list);
      });
      window.addEventListener("online", (e) => {
            socket.emit("user-chat-info", {
              status: "online",
              id: User,
            });
          });
          window.addEventListener("offline", (e) => {
            const date = new Date().toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
            });
            const timeOptions = {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            };
            socket.emit("user-chat-info", {
              status: `last seen at ${new Date(date).toLocaleTimeString("en-US", timeOptions)}`,
              id: User,
            });
          });
    }
  }, []);
  useEffect(() => {
    const divScrollOne = document.querySelector(".three-div-one");
    const divScrollTwo = document.querySelector(".three-div-two");
    const divScrollThree = document.querySelector(".three-div-three");
    socket.on("new-more-products-home", (newProduct) => {
      if (newProduct.id === 1) {
        let list = [...product["1"].list];
        list.pop();
        list = list.concat(newProduct.list);
        setProduct((a) => ({
          description: a.description,
          1: {
            scroll: newProduct.scroll,
            px: newProduct.px,
            head: a["1"].head,
            list: [...list],
          },
          2: {
            ...a["2"],
          },
          3: {
            ...a["3"],
          },
        }));
      } else if (newProduct.id === 2) {
        let list = [...product["2"].list];
        list.pop();
        list = list.concat(newProduct.list);
        setProduct((a) => ({
          description: a.description,
          1: {
            ...a["1"],
          },
          2: {
            scroll: newProduct.scroll,
            px: newProduct.px,
            head: a["2"].head,
            list: [...list],
          },
          3: {
            ...a["3"],
          },
        }));
      } else if (newProduct.id === 3) {
        let list = [...product["3"].list];
        list.pop();
        list = list.concat(newProduct.list);
        setProduct((a) => ({
          description: a.description,
          1: {
            ...a["1"],
          },
          2: {
            ...a["2"],
          },
          3: {
            scroll: newProduct.scroll,
            px: newProduct.px,
            head: a["3"].head,
            list: [...list],
          },
        }));
      }
    });
    const scrollEventOne = (e) => {
      const scrolled = e.target.scrollLeft + divScrollOne.clientWidth;
      if (
        scrolled === divScrollOne.scrollWidth
        && 
        scrolled !== product['1'].px
        && product['1'].list.slice(-1)[0].type !== 'done'
      ) {
        socket.emit("show-more-product-home", {
          px: scrolled,
          scroll: product['1'].scroll,
          list: 1,
          auth: User
        });
      }
    }
    const scrollEventTwo = (e) => {
      const scrolled = e.target.scrollLeft + divScrollTwo.clientWidth;
      if (
        scrolled === divScrollTwo.scrollWidth 
        && 
        scrolled !== product['2'].px
        && product['2'].list.slice(-1)[0].type !== 'done'
      ) {
        socket.emit("show-more-product-home", {
          px: scrolled,
          scroll: product['2'].scroll,
          list: 2,
          auth: User
        });
      }
    }
    const scrollEventThree = (e) => {
      const scrolled = e.target.scrollLeft + divScrollThree.clientWidth;
      if (
        scrolled === divScrollThree.scrollWidth
        && 
        scrolled !== product['3'].px
        && product['3'].list.slice(-1)[0].type !== 'done'
      ) {
        socket.emit("show-more-product-home", {
          px: scrolled,
          scroll: product['3'].scroll,
          list: 3,
          auth: User
        });
      }
    }
    divScrollOne.addEventListener("scroll", scrollEventOne);
    divScrollTwo.addEventListener("scroll",  scrollEventTwo);
    divScrollThree.addEventListener("scroll", scrollEventThree);
    return () => {
      divScrollOne.removeEventListener('scroll', scrollEventOne);
      divScrollTwo.removeEventListener('scroll', scrollEventTwo);
      divScrollThree.removeEventListener('scroll', scrollEventThree);
    };
  }, [product]);
  useEffect(()=> {
    const acc = document.querySelector(".acc-info");
    const login = document.querySelector(".auth-login-button");
    const u_in = document.querySelector(".acc-info .button-upload img");
    const username = document.querySelector(".username-home");
    const div = document.querySelector(".user-info-name-home");
    if (accInfo) {
      u_in.style = "width:45px;height:45px;border-radius:100%;border:1px solid black;box-shadow:0 0 20px rgba(0,0,0,0.7);";
      acc.style.height = "200px";
      document.querySelector(".infos-home").style.marginTop = "10px";
      username.style = "font-size:15px;text-align:center;text-shadow:1px 0 black,0 1px black,1px 0 black,0 1px black;color:white;margin:5px;position:relative;left:5px;";
      div.style = "display: inline-flex;align-items: center;";
      username.innerText = `@${accInfo.username}`;
      login.innerText = "Logout";
    }
  }, [accInfo]);
  useEffect(() => {
    const main = document.querySelector(".top-offers-home");
    const price = document.querySelector(".top-offers-home #price");
    const time = document.querySelector(".top-offers-home #time");
    let interval, hours, minutes, seconds;
    if (offers.status) {
      interval = setInterval(() => {
        const time1 = new Date();
        const timeNow = new Date()
          .toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false })
          .split(",")[1]
          .replace(/[^0-9:]/g, "")
          .split(":");
        time1.setHours(timeNow[0], timeNow[1], timeNow[2]);
        const time2 = new Date();
        time2.setHours(
          offers.time.split(":")[0],
          offers.time.split(":")[1],
          offers.time.split(":")[2],
        );
        const timeDiff = time2.getTime() - time1.getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        price.innerText = offers.price;
        time.innerText = `offer ends in ${hours} hour's,${minutes} minutes, ${seconds} seconds.`;
        main.style.display = "flex";
        if ((hours === 0 && minutes === 0 && seconds === 0) || seconds < 0) {
          main.style.display = "none";
          setOffers({
            status: false,
            price: "not found",
            title: "not found",
            desc: "not found",
            img: "not found",
          });
          clearInterval(interval);
        }
      }, 1000);
    } else if (!offers.status) {
      main.style.display = "none";
      //clearInterval(interval)
    }
  }, [offers]);

  const infoAcc = useCallback((e) => {
    //e.preventDefault();
    const acc = document.querySelector(".acc-info");
    if (showInfo === false) {
      acc.style.display = "block";
      return setShowInfo(true);
    } else {
      acc.style.display = "none";
      return setShowInfo(false);
    }
  }, [showInfo]);
  const checkLogin = useCallback(() => {
    if (accInfo) {
      let newStrage = User;
      newStrage.reg_pkocd = false;
      localStorage.setItem("AUTH-T", JSON.stringify(newStrage));
      navigate("/login");
    } else {
      navigate("/login");
    }
  }, [accInfo]);
  const hiddenFileInput = useRef(null);

  const handleClick = useCallback(async (event) => {
    event.preventDefault();
    const accINFO = document.querySelector(".acc-info");
    const icon = document.querySelector(".show-user-info-home");
    if (!accInfo) {
      icon.onClick = false;
      const error = document.querySelector(".error-home");
      error.style.display = "block";
      error.innerText = "Unable to process this task before login!";
      accINFO.style.animation = "hide 2.25s";
      await sleep(2250);
      icon.onClick = "infoAcc";
      error.style.display = "none";
      accINFO.style.animation = "none";
    } else {
      hiddenFileInput.current.click();
    }
  }, [accInfo]);

  const handleChange = async (e) => {
    if (e.target.files[0]) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("token", User.reg_pkocd);
      return await axios("/api/url", {
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "multipart/form-data; ",
        },
      }).catch((e) => e.response);
    }
  };

  const inputHome = async (e) => {
    e.preventDefault();
    const text = document.querySelector(".home-search #input");
    if (!text.value) {
      text.placeholder = "Enter something to search...";
      text.style.border = "1px solid red";
      await sleep(2000);
      text.style.border = "1px solid #000";
      text.placeholder = "Search for Products...";
    } else {
      navigate(`/search`, { state: { id: text.value } });
     }
  };
  const switchPage = useCallback((page) => {
    const animation = document.querySelector(".loading-home");
    const head = document.querySelector(".head-home");
    const mainDiv = document.querySelector(".main-homepage");
    const cart = document.querySelector(".home-cart");
    const notification = document.querySelector(".home-notification");
    const profile = document.querySelector(".home-profile");
    const homeIcon = document.getElementById("home-icon-home");
    const cartIcon = document.getElementById("home-icon-cart");
    const notificationIcon = document.getElementById("home-icon-notification");
    const profileIcon = document.getElementById("home-icon-profile");
    if(page === 'home') {
    head.style.display = 'flex';
    mainDiv.style.display = "block";
    cart.style.display = "none";
    notification.style.display = "none";
    profile.style.display = "none";
    homeIcon.style.background = "gray";
    homeIcon.style.color = "white";
    cartIcon.style.background = "#fff";
    cartIcon.style.color = "#000";
    notificationIcon.style.background = "#fff";
    notificationIcon.style.color = "#000";
    profileIcon.style.background = "#fff";
    profileIcon.style.color = "#000";
      if(!product.status) {
        socket.emit("home-updates", { auth: User });
        animation.style.display = 'block';
      };
    } else if(page === 'cart') {
    	head.style.display = 'flex';
    mainDiv.style.display = "none";
    cart.style.display = "block";
    notification.style.display = "none";
    profile.style.display = "none";
    cartIcon.style.background = "gray";
    cartIcon.style.color = "white";
    homeIcon.style.background = "#fff";
    homeIcon.style.color = "#000";
    notificationIcon.style.background = "#fff";
    notificationIcon.style.color = "#000";
    profileIcon.style.background = "#fff";
    profileIcon.style.color = "#000";
    socket.emit("cart-update", {
      auth: User,
    });
    } else if(page === 'notification') {
    	head.style.display = 'flex';
    mainDiv.style.display = "none";
    cart.style.display = "none";
    notification.style.display = "block";
    profile.style.display = "none";
    notificationIcon.style.background = "gray";
    notificationIcon.style.color = "white";
    cartIcon.style.background = "#fff";
    cartIcon.style.color = "#000";
    homeIcon.style.background = "#fff";
    homeIcon.style.color = "#000";
    profileIcon.style.background = "#fff";
    profileIcon.style.color = "#000";
    } else if(page === 'profile') {
    	head.style.display = 'none';
    mainDiv.style.display = "none";
    cart.style.display = "none";
    notification.style.display = "none";
    profile.style.display = "block";
    profileIcon.style.background = "gray";
    profileIcon.style.color = "white";
    cartIcon.style.background = "#fff";
    cartIcon.style.color = "#000";
    homeIcon.style.background = "#fff";
    homeIcon.style.color = "#000";
    notificationIcon.style.background = "#fff";
    notificationIcon.style.color = "#000";
    }
  }, [product]);

  const removeFromCart = (id) => {
    const icon = document.getElementById(id);
    if (icon.style.color === "gray") {
      icon.style.color = "red";
      socket.emit("update-cart", {
        type: "add",
        id: id,
        auth: User,
      });
    } else {
      icon.style.color = "gray";
      socket.emit("update-cart", {
        type: "remove",
        id: id,
        auth: User,
      });
    }
  };
  const loginNow = () => {
    navigate("/login");
  };
  const loadProduct = (id) => {
      navigate('/product',{ state: { id } })
  };
  const redirectedTo = (id) => {
      navigate(`/category/${id}`);
   };
  const goToNewOffers = (id) => {
    id ? navigate(`/offer/${id}`) : navigate(`/offer`);
  };
  const explain = useCallback(async(id) => {
    const cl = document.querySelector('.h-p-cl-ex');
    const er = document.querySelector('.h-p-er-ex');
    const pr = document.querySelector('.h-p-pr-ex');
    const data = {...profileValues};
    if(id === 'client') {
      if(openProfile['1'] === false) {
        setopenProfile(data=>({
          1: true,
          2: data['2'],
          3: data['3']
        }));
        cl.style.display = 'flex';
        cl.style.animation = 'heights 3s';
        await sleep(300);
        if(!accInfo) {
            cl.style.animation = 'none';
            cl.style.height = '50px';
            cl.innerHTML = "<a href='/login'>click</a><p>here to login and fetch your data</p>";
          } else if(Object.keys(data.client).length === 0 ) {
            cl.style.animation = 'none';
            cl.style.height = '50px';
            cl.innerText = 'There have no clients under you!'
          } else {
            await sleep(2700);
            cl.style.height = '300px';
          }
      } else {
        setopenProfile(data=>({
          1: false,
          2: data['2'],
          3: data['3']
        }));
        cl.style.display = 'none';
        cl.style.animation = 'none';
      };
    } else if(id === 'earns') {
      if(openProfile['2'] === false) {
        setopenProfile(data=>({
          1: data['1'],
          2: true,
          3: data['3']
        }));
        er.style.display = 'flex';
        er.style.animation = 'heights 3s';
        await sleep(300);
        if(!accInfo) {
            er.style.animation = 'none';
            er.style.height = '50px';
            er.innerHTML = "<a href='/login'>click</a><p>here to login and fetch your data</p>"
          } else if(data.earning <= 0 ) {
            er.style.animation = 'none';
            er.style.height = '50px';
            er.innerText = "Add users and start you're community!"
          } else {
            await sleep(2700);
            er.style.height = '300px';
          }
      } else {
        setopenProfile(data=>({
          1: data['1'],
          2: false,
          3: data['3']
        }));
        er.style.display = 'none';
        er.style.animation = 'none';
      };
    } else if(id === 'product') {
      if(openProfile['3'] === false) {
        setopenProfile(data=>({
          1: data['1'],
          2: data['2'],
          3: true
        }));
        pr.style.display = 'flex';
        pr.style.animation = 'heights 3s';
        await sleep(300);
        if(!accInfo) {
            pr.style.animation = 'none';
            pr.style.height = '50px';
            pr.innerHTML = "<a href='/login'>click</a><p>here to login and fetch your data</p>";
          } else if(data.product <= 0 ) {
            pr.style.animation = 'none';
            pr.style.height = '50px';
            pr.innerText = "Add users and start you're community!";
          } else {
            await sleep(2700);
            pr.style.height = '300px';
          }
      } else {
        setopenProfile(data=>({
          1: data['1'],
          2: data['2'],
          3: false 
        }));
        pr.style.display = 'none';
        pr.style.animation = 'none';
      }
    };
  }, [accInfo, profileValues, openProfile]);
  return (
    <div>
    {helmet}
      <header className="head-home">
        <img className="home-logo" src={image} alt="Logo" />
        <div className="home-top-admin">
          <h2>INRL</h2>
          <p>{product.description}</p>
        </div>
        <FaRegCircleUser
          onClick={infoAcc}
          className="show-user-info-home"
        ></FaRegCircleUser>
      </header>
      <div className="acc-info">
        <div className="user-info-name-home">
          <button
            className="button-upload"
            id="button-up"
            onClick={handleClick}
          >
            <img
              src={
                accInfo && accInfo.img
                  ? `${accInfo.img + "?timestamp=" + new Date().getTime()}`
                  : "https://i.imgur.com/JOkWGYr.jpeg"
              }
              alt="Logo"
              id="user-img"
            />
          </button>
          <p style={{ display: "none" }} className="username-home"></p>
        </div>
        <input
          style={{ display: "none" }}
          type="file"
          onChange={handleChange}
          ref={hiddenFileInput}
        />
        <div className="infos-home">
          <a className="Account-home" href="/info/account">
            Account
          </a>
          <a className="Contact-home" href="/contact">
            Contact
          </a>
          <button className="auth-login-button" onClick={checkLogin}>
            Login
          </button>
        </div>
      </div>
      <div className="main-homepage">
        <div className="info-home"></div>
        <div className="error-home"></div>
        <img alt="img" className="loading-home" src={loading} />
        <div className="loading-main-homepage">
          <form className="home-search" onSubmit={inputHome}>
            <input
              type="text"
              id="input"
              placeholder="Search for Products..."
            />
            <IoMdSearch id="search" onClick={inputHome}/>
          </form>
          <p className="discount-msg">
            <CiLocationOn id="location" /> Add delivery location to check extra
            discount
          </p>
          <div className="users-attract">
            <div className="secure-ua">
              <RiSecurePaymentLine className="icon-ua" />
              <p>secure transaction</p>
            </div>
            <div className="delivery-ua">
              <CiDeliveryTruck className="icon-ua" />
              <p>fast delivery</p>
            </div>
            <div className="price-ua">
              <IoIosPricetag className="icon-ua" />
              <p>affordable price</p>
            </div>
            <div className="support-ua">
              <BiSupport className="icon-ua" />
              <p>customer support</p>
            </div>
            <div className="exchange-ua">
              <FaExchangeAlt className="icon-ua" />
              <p>easy exchange</p>
            </div>
          </div>
          <div className="top-offers-home" onClick={()=>goToNewOffers(offers.id)}>
            <img src={offers.img} alt="offer" />
            <div id="infos">
              <p id="title">{offers.title}</p>
              <p id="desc">{offers.desc}</p>
              <p id="price">loading...</p>
              <p id="time">not found</p>
            </div>
          </div>
          <h2 className="catogery-div">{product["1"].head}</h2>
          <div className="three-div-one">
            {product["1"].list.map((a, index) =>
              a.type === "loading" ? (
                <div key={index} className="prodcts-list-home">
                  <img
                    alt="img"
                    className="last-loading-product"
                    src={loading}
                  />
                </div>
              ) : a.type === 'done' ? (
                <div key={index} className="prodcts-list-home">
                  <h3>There have no more products to load</h3>
                </div>
              ) :  (
                <div
                  key={index}
                  className="prodcts-list-home"
                  id={"infoPLH" + a.id}
                >
                  <div
                    className="product-info-home"
                    id={"infoPIH" + a.id}
                    onClick={() => loadProduct(a.id)}
                  >
                    {a.img.includes(',') ? <img alt="p1" src={a.img.split(',')[0]} /> : <img alt="p1" src={a.img} /> }
                    <p id="name">{a.name.length > 9 ? a.name.slice(0, 9) + '..' : a.name}</p>
                    <p id="price">Price: {a.LastPrice}</p>
                    <p id="desc">{a.description.length > 16 ? a.description.slice(0, 16) + "..." : a.description}</p>
                  </div>
                  <div className="product-onclick-hm" id={"infoANH" + a.id}>
                    <img alt="p-bh" src={loading} className="last-loading-product" />
                  </div>
                </div>
              ),
            )}
          </div>
          <h2 className="catogery-div">{product["2"].head}</h2>
          <div className="three-div-two">
            {product["2"].list.map((a, index) =>
              a.type === "loading" ? (
                <div key={index} className="prodcts-list-home">
                  <img
                    alt="img"
                    className="last-loading-product"
                    src={loading}
                  />
                </div>
              ) : a.type === 'done' ? (
                <div key={index} className="prodcts-list-home">
                  <h3>There have no more products to load</h3>
                </div>
              ) : (
                <div
                  key={index}
                  className="prodcts-list-home"
                  id={"infoPLH" + a.id}
                >
                  <div
                    className="product-info-home"
                    id={"infoPIH" + a.id}
                    onClick={() => loadProduct(a.id)}
                  >
                    {a.img.includes(',') ? <img alt="p2" src={a.img.split(',')[0]} /> : <img alt="p1" src={a.img} /> }
                    <p id="name">{a.name.length > 9 ? a.name.slice(0, 9) + '..' : a.name}</p>
                    <p id="price">Price: {a.LastPrice}</p>
                    <p id="desc">{a.description.length > 16 ? a.description.slice(0, 16) + "..." : a.description}</p>
                  </div>
                  <div className="product-onclick-hm" id={"infoANH" + a.id}>
                    <img alt="p2-ld" src={loading} className="last-loading-product" />
                  </div>
                </div>
              ),
            )}
          </div>
          <h2 className="catogery-div">{product["3"].head}</h2>
          <div className="three-div-three">
            {product["3"].list.map((a, index) =>
              a.type === "loading" ? (
                <div key={index} className="prodcts-list-home">
                  <img
                    alt="img"
                    className="last-loading-product"
                    src={loading}
                  />
                </div>
              ) : a.type === 'done' ? (
                <div key={index} className="prodcts-list-home">
                  <h3>There have no more products to load</h3>
                </div>
              ) :  (
                <div
                  key={index}
                  className="prodcts-list-home"
                  id={"infoPLH" + a.id}
                >
                  <div
                    className="product-info-home"
                    id={"infoPIH" + a.id}
                    onClick={() => loadProduct(a.id)}
                  >
                    {a.img.includes(',') ? <img alt="p3" src={a.img.split(',')[0]} /> : <img alt="p1" src={a.img} /> }
                    <p id="name">{a.name.length > 9 ? a.name.slice(0, 9) + '..' : a.name}</p>
                    <p id="price">Price: {a.LastPrice}</p>
                    <p id="desc">{a.description.length > 16 ? a.description.slice(0, 16) + "..." : a.description}</p>
                  </div>
                  <div className="product-onclick-hm" id={"infoANH" + a.id}>
                    <img alt="p3-ld" src={loading} className="last-loading-product" />
                  </div>
                </div>
              ),
            )}
          </div>
          <div className="two-raw-ca-h-one">
            <div id="shoes" onClick={() => redirectedTo("shoes")}>
              <GiRunningShoe className="shoe-ch-mh" />
              <p>shoes</p>
            </div>
            <div id="watch" onClick={() => redirectedTo("watch")}>
              <MdOutlineWatch className="watch-ch-mh" />
              <p>watches</p>
            </div>
            <div id="headset" onClick={() => redirectedTo("headset")}>
              <IoHeadsetOutline className="headset-ch-mh" />
              <p>headsets</p>
            </div>
            </div>
            <div className="two-raw-ca-h-two">
            <div id="wears" onClick={() => redirectedTo("wears")}>
              <GiAmpleDress className="wears-ch-mh" />
              <p>wears</p>
            </div>
            <div id="shirts" onClick={() => redirectedTo("shirts")}>
              <PiTShirtDuotone className="shirts-ch-mh" />
              <p>wears</p>
            </div>
            <div id="Toycars" onClick={() => redirectedTo("Toycars")}>
              <TbCarSuv className="toycars-ch-mh" />
              <p>wears</p>
            </div>
          </div>
        </div>
      </div>
      <div className="home-cart">
        {!User || !User.reg_pkocd ? (
          <div className="login-first">
            <h3>
              For our records, we do not store any of your information before
              you sign up.
            </h3>
            <button onClick={loginNow}>sign up.</button>
          </div>
        ) : !cartMsg.status ? (
          <img alt="img" className="loading-home" src={loading} />
        ) : cartMsg.status && cartMsg.msg === "nothing" ? (
          <h3 className="null-cart">
            Explore our page further and shop for incredible deals today! Don't
            miss out on our amazing products with nothing in your cart - start
            adding items now!
          </h3>
        ) : cartMsg.status && cartMsg.list ? (
          cartMsg.list.map((list, index) => (
            <div key={index} className="cart-list-home">
              <img alt="img" src={list.img} />
              <div className="cart-infos">
                {" "}
                {list.name.length > 17 ? (
                  <p className="name-ca">{list.name.slice(0, 18) + "..."}</p>
                ) : (
                  <p className="name-ca">{list.name}</p>
                )}
                {list.type === "done" ? (
                  <p className="delivered-ca">
                    delivered <MdDownloadDone className="icon-ca" />
                  </p>
                ) : list.discount ? (
                  <div className="pricess-ca">
                    <p className="price-ca">
                      <span>Ã¢â€šÂ¹</span> {list.total}
                    </p>
                    <p className="actul-ca">
                      <del>{list.price}</del>
                    </p>
                  </div>
                ) : (
                  <p className="actul-ca">
                    <span>Ã¢â€šÂ¹</span> {list.price}
                  </p>
                )}
                {list.desc.length > 28 ? (
                  <p className="desc-ca">{list.desc.slice(0, 28) + "..."}</p>
                ) : (
                  <p className="desc-ca">{list.desc}</p>
                )}
                <p className="quantity-ca">Qty: {list.quantity}</p>
              </div>
              {list.type === "cart" ? (
                <IoHeart
                  className="save-ca"
                  id={"cart-cc" + list.id}
                  onClick={() => removeFromCart("cart-cc" + list.id)}
                />
              ) : null}
            </div>
          ))
        ) : null}
      </div>
      <div className="home-notification">Syncing</div>
      <div className="home-profile">
      <div className="basic-profile">
        <img
              src={
                accInfo && accInfo.img
                  ? `${accInfo.img + "?timestamp=" + new Date().getTime()}`
                  : "https://i.imgur.com/JOkWGYr.jpeg"
              }
              alt="Logo"
         />
        <p>{accInfo ? accInfo.username : "You're not logined"}</p>
      </div>
      <div className="home-profile-info">
        <div className="h-p-divs">
          <p className="h-p-info">your client</p>
          <p className="h-p-value">0</p>
          { openProfile['1'] === false ? <IoMdArrowDropdown className="h-p-icon-cl" onClick={()=>explain('client')}/> : <IoCloseSharp className="h-p-icon-cl" onClick={()=>explain('client')}/> }
        </div>
        <div className="h-p-cl-ex"></div>
        <div className="h-p-divs">
          <p className="h-p-info">your earning:</p>
          <p className="h-p-value">0</p>
          { openProfile['2'] === false ? <IoMdArrowDropdown className="h-p-icon-er" onClick={()=>explain('earns')}/> : <IoCloseSharp className="h-p-icon-er" onClick={()=>explain('earns')}/> }
        </div>
        <div className="h-p-er-ex"></div>
        <div className="h-p-divs">
          <p className="h-p-info">your products:</p>
          <p className="h-p-value">0</p>
          { openProfile['3'] === false ? <IoMdArrowDropdown className="h-p-icon-pr" onClick={()=>explain('product')}/> : <IoCloseSharp className="h-p-icon-pr" onClick={()=>explain('product')}/>}
        </div>
        <div className="h-p-pr-ex"></div>
        <div className="h-p-divs">
          <p className="h-p-info">your id:</p>
          <p className="h-p-value-none">70708080</p>
         </div>
      </div>
    </div>
      <div className="bottom-home">
        <IoHome
          className="icon-bo"
          id="home-icon-home"
          onClick={() => switchPage('home')}
        />
        <FaShoppingCart
          className="icon-bo"
          id="home-icon-cart"
          onClick={() => switchPage('cart')}
        />
        <IoIosNotifications
          className="icon-bo"
          id="home-icon-notification"
          onClick={() => switchPage('notification')}
        />
        <CiUser
          className="icon-bo"
          id="home-icon-profile"
          onClick={() => switchPage('profile')}
        />
      </div>
    </div>
  );
};

export default Home;

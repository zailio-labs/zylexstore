import React, { useState, useRef, useEffect } from "react";
import "./upload.css";
import { useLocation } from "react-router-dom";
import { FaImage } from "react-icons/fa6";
import { sleep, makeid } from "../../fn/fn";
import { socket } from "../../socket";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const Uploadproduct = () => {
  const location = useLocation();
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const hideClick = useRef();
  const User = localStorage.getItem('AUTH-T');
  const user = User ? JSON.parse(User) : {};
  const [tag, setTag] = useState([]);
  const [size, setSize] = useState([]);
  const [url, setUrl] = useState([]);

  useEffect(() => {
    if(!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', undefined);
    } else if(location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', getCurrPath);
    }
    const textArea = document.querySelector(".product-desc-up");
    const tagInput = document.querySelector(".tags-up");
    const sizeInput = document.querySelector(".size-input-up");
    const sizeSelect = document.querySelector(".more-sizes-up");
    const sizeDiv = document.querySelector(".selctions-size-up");
    textArea.addEventListener("input", function () {
      textArea.style.height = textArea.scrollHeight + "px";
    });
    tagInput.addEventListener("input", function () {
      if (tagInput.value.includes(" ")) {
        const newTag = tagInput.value.split(" ")[0];
        if (newTag) {
          setTag((a) => [...a, newTag]);
          tagInput.value = "";
        } else {
          tagInput.value = "";
        }
      }
    });
    sizeInput.addEventListener("input", function () {
      if (sizeInput.value.includes(" ")) {
        const newSize = sizeInput.value.split(" ")[0];
        if (newSize) {
          setSize((a) => [...a, newSize]);
          sizeInput.value = "";
        } else {
          sizeInput.value = "";
        }
      }
    });
    sizeSelect.addEventListener("change", () => {
      if (sizeSelect.value === "yes") {
        sizeDiv.style.display = "block";
      } else {
        sizeDiv.style.display = "none";
      }
    });
  }, []);
  const uploadProduct = () => {
    hideClick.current.click();
  };
  const convertToUrl = async (e) => {
    const info = document.querySelector(".info-up");
    const error = document.querySelector(".error-up");
    const files = e.target.files;
    if (files && files[0]) {
      for (let i = 0; i < Math.min(5, files.length); i++) {
        const data = new FormData();
        data.append("file", files[i]);
        data.append("token", user.reg_pkocd);
        const url = await axios("/api/get_url", {
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "multipart/form-data; ",
          },
        }).catch((e) => e.response);
        if (url.data.url) {
          setUrl((e) => [...e, url.data.url]);
          info.style.display = "block";
          info.innerText = `uploading ${i + 1} of images from 5 images`;
        } else {
          error.style.display = "block";
          error.innerText = `error while uploading ${i + 1}st image`;
        }
      }
      await sleep(2000);
      info.style.display = "none";
      error.style.display = "none";
    }
  };
  const remove = (name) => {
    const tags = tag.filter((item) => item !== name);
    setTag(tags);
  };
  const removeSize = (name) => {
    const sizes = size.filter((item) => item !== name);
    setSize(sizes);
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    const info = document.querySelector(".info-up");
    const error = document.querySelector(".error-up");
    const admin_id = document.querySelector(".product-admin_id-up").value;
    const name = document.querySelector(".product-name-up").value;
    const subtitle = document.querySelector(".product-subtitle-up").value;
    const description = document.querySelector(".product-desc-up").value;
    const price = document.querySelector(".product-price-up").value;
    const firstBuyDiscount = document.querySelector(".product-first-up").value;
    const discountPrice = document.querySelector(".product-disc-up").value;
    const LoginDiscount = document.querySelector(".product-login-up").value;
    const gender = document.querySelector(".gender-up").value;
    const returnPolicy = document.querySelector(".refund-available-up").value;
    const sizeCategory = document.querySelector(".more-sizes-up").value;
    const cashOnDelivery = document.querySelector(".cash-on-delivery-up").value;
    const freeDelivery = document.querySelector(".free-delivery-up").value;
    const categoryType = document.querySelector(".category-up").value;
    const colorSelections = document.querySelector(".colors-up").value;
    const LastPrice = discountPrice - LoginDiscount - firstBuyDiscount;
    if (!url.length) {
      error.style.display = "block";
      error.innerText = "please upload at least one image";
      await sleep(3000);
      error.style.display = "none";
    } else if (!tag.length) {
      error.style.display = "block";
      error.innerText = "add tags to filter content";
      await sleep(3000);
      error.style.display = "none";
    } else if (LastPrice <= 0) {
      error.style.display = "block";
      error.innerText = "after computing all offers, the price must be more then 10rs!";
      await sleep(3000);
      error.style.display = "none";
    } else if (sizeCategory === "yes" && !size.length) {
      error.style.display = "block";
      error.innerText = "provide available size of product";
      await sleep(3000);
      error.style.display = "none";
    } else if((((firstBuyDiscount - discountPrice) / firstBuyDiscount) * 100) >= 90) {
      error.style.display = "block";
      error.innerText = "discount  %  must be less then 90%";
      await sleep(3000);
      error.style.display = "none";
    } else {
      info.style.display = "block";
      info.innerText = `uploading your product`;
      const ofr = {ofr: []};
      if(LoginDiscount !== 0) {
        ofr.ofr.push({
          id: makeid(16),
          title: 'login discount',
          price: LoginDiscount
        });
      };
      if(firstBuyDiscount !== 0) {
        ofr.ofr.push({
          id: makeid(16),
          title: 'first purchase discount',
          price: firstBuyDiscount
        });
      };
      socket.emit("uploade-products", {
        auth: user.reg_pkocd,
        admin_id,
        name,
        img: url,
        subtitle,
        description,
        price,
        firstBuyDiscount,
        discountPrice,
        tags: tag,
        LoginDiscount,
        gender,
        returnPolicy,
        sizeCategory,
        size: size,
        cashOnDelivery,
        freeDelivery,
        category: categoryType,
        colorSelections,
        LastPrice,
        comments: {cmt: []},
        offers: ofr
      });
      await sleep(3000);
      info.style.display = "none";
    }
  };
  return (
    <div className="product-upload-main">
      <form className="uploaded-product" onSubmit={submitEvent}>
        <div className="error-up"></div>
        <div className="info-up"></div>
        <input
          type="text"
          placeholder="enter your admin_suid"
          className="product-admin_id-up"
          required={true}
        />
        <div className="name-and-img-up">
          <input
            type="text"
            placeholder="Product Name..."
            className="product-name-up"
            required={true}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={hideClick}
            multiple={true}
            accept="image/*"
            onChange={convertToUrl}
          />
          <FaImage onClick={uploadProduct} className="upload-img-up" />
        </div>
        <input
          type="text"
          placeholder="sub title..."
          className="product-subtitle-up"
          required={true}
        />
        <textarea
          placeholder="product description"
          className="product-desc-up"
          required={true}
        />
        <div className="tags-up-div">
          <div className="list-tags-up">
            {tag.map((item, index) => (
              <div key={index} className="tags-list-up">
                {item}
                <RxCross2 onClick={() => remove(item)} className="remove-up" />
              </div>
            ))}
          </div>
          <input type="text" placeholder="tags..." className="tags-up" />
        </div>
        <div className="price-up-div">
          <input
            type="number"
            placeholder="Product Price..."
            className="product-price-up"
            required={true}
          />
          <input
            type="number"
            placeholder="Discount First Buy..."
            className="product-first-up"
            required={true}
          />
        </div>
        <div className="extra-off-up">
          <input
            type="number"
            placeholder="discount price..."
            className="product-disc-up"
            required={true}
          />
          <input
            type="number"
            placeholder="login discount..."
            className="product-login-up"
            required={true}
          />
        </div>
        <div className="align-selections-up">
          <label htmlFor="refund">refund availability: </label>
          <select name="refund" className="refund-available-up">
            <option value="no">unavailable</option>
            <option value="7">7 days</option>
            <option value="3">3 days</option>
            <option value="exchange">exchange available</option>
          </select>
        </div>
        <div className="align-selections-up">
          <label htmlFor="gender">Gender specify: </label>
          <select name="gender" className="gender-up">
            <option value="both">everyone</option>
            <option value="male">male</option>
            <option value="femail">female</option>
            <option value="kids">kids</option>
            <option value="girls">girls</option>
            <option value="boys">boys</option>
          </select>
        </div>
        <div className="align-selections-up">
          <label htmlFor="sizes">available size:</label>
          <select name="sizes" className="more-sizes-up">
            <option value="no">unavailable</option>
            <option value="yes">available</option>
          </select>
        </div>
        <div className="selctions-size-up">
          <div className="show-sizes-up">
            {size.map((item, index) => (
              <div key={index} className="show-size-up">
                {item}
                <RxCross2
                  onClick={() => removeSize(item)}
                  className="sizes-up"
                />
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="enter available size..."
            className="size-input-up"
          />
        </div>
        <div className="align-selections-up">
          <label htmlFor="payment">payments type: </label>
          <select name="payment" className="cash-on-delivery-up">
            <option value="online">online</option>
            <option value="offline">at delivery</option>
            <option value="both">both</option>
          </select>
        </div>
        <div className="align-selections-up">
          <label htmlFor="free-del">free delivery: </label>
          <select name="free-del" className="free-delivery-up">
            <option value="yes">yes</option>
            <option value="29">₹ 29</option>
            <option value="40">₹ 40</option>
          </select>
        </div>
        <div className="align-selections-up">
          <label htmlFor="category">select category: </label>
            <select name="category" className="category-up">
            <option value="watch">watch</option>
            <option value="shoes">shoes</option>
            <option value="wear">wear</option>
            <option value="gadgets">gadgets</option>
            <option value="toys">toys</option>
          </select>
        </div>
        <div className="align-selections-up">
          <label htmlFor="color">multiple color: </label>
          <select name="color" className="colors-up">
            <option value="no">one color</option>
            <option value="yes">multiple color</option>
          </select>
        </div>
        <button type="submit" className="submit-up">
          upload product
        </button>
      </form>
    </div>
  );
};

export default Uploadproduct;

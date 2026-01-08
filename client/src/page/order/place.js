import React, { useState, useCallback, useEffect } from "react";
import { sleep, makeid } from "../../fn/fn";
import { socket } from "../../socket";
import './order.css';
import loading from "../../assets/loading.gif";

import { Bs1CircleFill, Bs2CircleFill, Bs3CircleFill } from "react-icons/bs";
import { FaAddressCard, FaLocationDot } from "react-icons/fa6";
import { MdOutlineNavigateNext } from "react-icons/md";
import { FaSearch } from "react-icons/fa"
import { LuSend } from "react-icons/lu";


export default function PlaceOrder() {
  const [up, setUp] = useState({
    pd: false,
    resave: false,
    list: [],
  });
  const [price, setPrice] = useState(999);
  const [updated, setUpdated] = useState({});
  const [product, ss] = useState({
    status: true,
    info: {
      title: "cartiear watch",
      img: "https://imgur.com/lVVR1Nb.jpeg",
      desc: "we sel the best to you at any of cost and i like it as how to you like it anyways thank you bro",
      discountPrice: 999,
      sizeCategory: true,
      size: ["68 small", "89 medium", "XL"],
      colorSelections: ["blue", "red", "green"],
    },
    offers: [
      {
        title: "login discount",
        price: 20,
        id: "jsjsjjsjsjjw",
      },
      {
        title: "login discount",
        price: 20,
        id: "jwhshdjxxjseuusijd",
      },
      {
        title: "login discount",
        price: 20,
        id: "jsjsjjsjsjjw",
      },
      {
        title: "login discount",
        price: 20,
        id: "jwhshdjxxjseuusijd",
      },
      {
        title: "login discount",
        price: 20,
        id: "jsjsjjsjsjjw",
      },
      {
        title: "login discount",
        price: 20,
        id: "jwhshdjxxjseuusijd",
      },
    ],
  });
  const [select, setSelect] = useState("kerala");
  const [town, setTown] = useState("");
  const [an, setAn] = useState(false);
  const [res, setRes] = useState([]);
  useEffect(() => {
    const popup = document.querySelector(".bottom-buy");
    const line = document.querySelector(".line-bt-by");
    const close = document.querySelector(".bottom-buy span");
    const db = localStorage.getItem("adrs");
    const json = db ? JSON.parse(db) : {};
    if (json.location && !up.pd) {
      setUp({
        pd: true,
        resave: false,
        list: [...json.location],
      });
      popup.style.height = "max-content";
      close.style.display = "block";
      line.style.display = "none";
    }

    const locations = document.querySelectorAll(".l-i-d-buy");
    const handleClick = (e) => {
      const nameBuy = document.getElementById("name-buy");
      const numberBuy = document.getElementById("number-buy");
      const pincodeBuy = document.getElementById("pincode-buy");
      const stateBuy = document.getElementById("state-buy");
      const cityBuy = document.getElementById("city-buy");
      const townBuy = document.getElementById("town-buy");
      const adrsBuy = document.getElementById("adrs-buy");
      const element = e.target.id.replace("radioButtonBuyBottom", "");
      const data = json.location[element];
      nameBuy.value = data.name;
      numberBuy.value = data.number;
      pincodeBuy.value = data.pincode;
      stateBuy.value = data.state;
      cityBuy.value = data.city;
      townBuy.value = data.town;
      adrsBuy.value = data.address;
      popup.style.height = "35px";
      line.style.display = "block";
      close.style.display = "none";
      setUp((a) => ({
        ...a,
        resave: true,
      }));
    };

    if (locations) {
      locations.forEach((a) => {
        a.addEventListener("click", handleClick);
      });
    }
    return () => {
      if (locations) {
        locations.forEach((a) => {
          a.removeEventListener("click", handleClick);
        });
      }
    };
  }, [up]);
  const saveSize = useCallback(
    (id) => {
      const size = [...product.info.size][id];
      setUpdated((a) => ({
        ...a,
        size: size,
      }));
    },
    [product, updated],
  );
  const submit = useCallback(
    (e) => {
      e.preventDefault();
      const nameBuy = document.getElementById("name-buy").value;
      const numberBuy = document.getElementById("number-buy").value;
      const pincodeBuy = document.getElementById("pincode-buy").value;
      const stateBuy = document.getElementById("state-buy").value;
      const cityBuy = document.getElementById("city-buy").value;
      const townBuy = document.getElementById("town-buy").value;
      const adrsBuy = document.getElementById("adrs-buy").value;
      if (
        !nameBuy ||
        !numberBuy ||
        !pincodeBuy ||
        !stateBuy ||
        !cityBuy ||
        !townBuy ||
        !adrsBuy
      ) {
        alert("Please fill in all the fields.");
      } else {
        const local = localStorage.getItem("adrs");
        if (local && !up.resave) {
          const data = {
            location: [
              ...JSON.parse(local).location,
              {
                name: nameBuy,
                number: numberBuy,
                pincode: pincodeBuy,
                state: stateBuy,
                city: cityBuy,
                town: townBuy,
                address: adrsBuy,
              },
            ],
          };
          localStorage.setItem("adrs", JSON.stringify(data));
        } else if (!up.resave) {
          const data = {
            location: [
              {
                name: nameBuy,
                number: numberBuy,
                pincode: pincodeBuy,
                state: stateBuy,
                city: cityBuy,
                town: townBuy,
                address: adrsBuy,
              },
            ],
          };
          localStorage.setItem("adrs", JSON.stringify(data));
        }
        document.querySelector(".address-buy").style.display = "none";
        document.querySelector(".payment-f-buy").style.display = "none";
        document.querySelector(".pr-info-buy").style.display = "block";
        document.querySelector(".bottom-buy").style.display = "none";
      }
    },
    [up],
  );
  const compleate = () => {
    document.querySelector(".address-buy").style.display = "none";
      document.querySelector(".payment-f-buy").style.display = "block";
      document.querySelector(".pr-info-buy").style.display = "none";
      document.querySelector(".bottom-buy").style.display = "none";
  };
  const loocap = useCallback(async () => {
    const not = document.querySelector(".qick-info-buy");
    const value = document.getElementById("pincode-buy");
    const label = document.querySelector(`label[for="pincode-buy"]`);
    not.innerText = "looking up please wait";
    if (!value.value) {
      label.innerText = "Pincode cannot be empty.";
      label.style.color = "red";
    } else if (value.value.length !== 6) {
      label.innerText = "Pincode must be exactly 6 digits.";
      label.style.color = "red";
    } else {
      label.style.color = "#000";
      not.style.display = "block";
      not.style.animation = "poptob 3s";
      if (an) {
        not.style.animation = "none";
        clearTimeout(an);
        setAn(false);
      }
      setAn(setTimeout(() => {}, 3000));
      not.style.animation = "vibrate 1s infinite";
      await fetch("https://www.inrl.online/api/grablocation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pincode: value.value,
          auth: {},
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            return (not.innerText = data.message);
          } else if (!data.result.length) {
            return (not.innerText = "no result found");
          } else {
            setSelect(data.result[0].State.toLowerCase());
            document.getElementById("city-buy").value = data.result[0].City;
            const office = data.result.map((a) => a.PostOfficeName);
            setRes([...office]);
            setTown(office[0]);
            not.style.display = "none";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [an]);
  const code = (e) => {
    e.preventDefault();
  };
  const toUp = () => {
    document.querySelector(".bottom-buy").style.height = "max-content";
    document.querySelector(".bottom-buy span").style.display = "block";
    document.querySelector(".line-bt-by").style.display = "none";
  };
  const closePopup = () => {
    document.querySelector(".bottom-buy").style.height = "35px";
    document.querySelector(".bottom-buy span").style.display = "none";
    document.querySelector(".line-bt-by").style.display = "block";
  };
  const townChange = (event) => {
    setTown(event.target.value);
  };
  const handleChange = (event) => {
    setSelect(event.target.value);
  };
  const getLocation = useCallback(async () => {
    const not = document.querySelector(".qick-info-buy");
    if (an) {
      not.style.animation = "none";
      clearTimeout(an);
      setAn(false);
    }

    if (navigator.geolocation) {
      not.style.display = "block";
      not.style.animation = "poptob 1s";
      not.innerText = "please wait, locating your address!";
      await sleep(1000);
      not.style.animation = "vibrate 1s infinite";
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          if (!lat || !lon) {
            not.style.display = "block";
            not.style.animation = "poptob 3s";
            not.innerText = "Unable to retrieve your location";

            await sleep(3000);
            not.style.display = "none";
          } else {
            const gg = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  not.innerText = "no result found";
                  setAn(
                    setTimeout(() => {
                      not.style.animation = "none";
                      not.style.display = "none";
                    }, 3000),
                  );
                } else {
                  not.style.animation = "none";
                  not.style.display = "none";
                  const pincodeBuy = document.getElementById("pincode-buy");
                  const stateBuy = document.getElementById("state-buy");
                  const cityBuy = document.getElementById("city-buy");
                  const townBuy = document.getElementById("town-buy");
                  const adrsBuy = document.getElementById("adrs-buy");
                  if (!pincodeBuy.value) {
                    pincodeBuy.value = data.address.postcode;
                  }
                  if (!stateBuy.value) {
                    stateBuy.value = data.address.state.toLowerCase();
                  }
                  if (!cityBuy.value) {
                    cityBuy.value = data.address.county;
                  }
                  if (!townBuy.value) {
                    townBuy.value = data.address.town;
                  }
                  adrsBuy.value = data.display_name;
                }
              })
              .catch((error) => {
                alert("service unavailable");
              });
          }
        },
        async (error) => {
          not.style.display = "block";
          not.style.animation = "poptob 3s";
          not.innerText = "Unable to retrieve your location";

          await sleep(3000);
          not.style.display = "none";
        },
      );
    } else {
      not.style.display = "block";
      not.style.animation = "poptob 3s";
      not.innerText = "Geolocation is not supported by this browser";

      await sleep(3000);
      not.style.display = "none";
    }
  }, [an]);
  const toWa= () => {
    window.location.href = "/https://wa.me/+917025099154?text=done"
  }
  const increase = useCallback(() => {
    const quantityInput = document.getElementById("quantity-buy");
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
    setPrice((a) => a + product.info.discountPrice);
  }, [product]);

  const decrease = useCallback(() => {
    const quantityInput = document.getElementById("quantity-buy");
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
      setPrice((a) => a - product.info.discountPrice);
    }
  }, [price, product]);
  return (
    <div>
      {product.status === false ? (
        <img className="loading-buy" src={loading} alt="loading" />
      ) : product.status === "error" ? (
        <h4 className="e-s-e-buy">Internal server error!</h4>
      ) : null}
      <div className="qick-info-buy">Inrs is the best</div>
      <div className="buy-now">
        <div className="hd-buy">
          <div className="hd-b-t">
            <FaAddressCard className="address-icon-buy"/>
            <p>Add your Address</p>
          </div>
          <div className="list-f-buy">
            <hr />
            <Bs1CircleFill className="adrs-slct-by"/>
            <b className="adrs-t-by">address</b>
            <Bs2CircleFill className="prdct-i-by"/>
            <p className="prdct-t-by">product info</p>
            <Bs3CircleFill className="pymt-i-by"/>
            <p className="pymt-t-by">payment</p>
          </div>
        </div>
        <form className="address-buy" onSubmit={submit}>
          <label htmlFor="name-buy">Enter your name</label>
          <input type="text" id="name-buy" required={true} />
          <label htmlFor="number-buy">Enter your number</label>
          <input type="number" id="number-buy" required={true} />
          <div className="input-cl-buy">
            <div className="pin-cd-d-buy">
              <label htmlFor="pincode-buy">Enter your pincode</label>
              <input type="number" id="pincode-buy" required={true} />
            </div>
            <div className="pin-cd-d-buy">
             <div className="lookup-div-buy">
              <FaSearch className="pincode-lookup-buy" onClick={loocap}/>
             </div>
              <div className="loc-i-buy">
                <FaLocationDot className="lctn-i-buy"/>
                <button className="location-buy" onClick={getLocation}>
                  add location
                </button>
              </div>
            </div>
          </div>
          <div className="input-group-buy">
            <div className="stt-buy">
              <label htmlFor="state-buy">select your state</label>
              <select id="state-buy" value={select} onChange={handleChange}>
                <option value="andhra-pradesh">Andhra Pradesh</option>
                <option value="arunachal-pradesh">Arunachal Pradesh</option>
                <option value="assam">Assam</option>
                <option value="bihar">Bihar</option>
                <option value="chhattisgarh">Chhattisgarh</option>
                <option value="goa">Goa</option>
                <option value="gujarat">Gujarat</option>
                <option value="haryana">Haryana</option>
                <option value="himachal-pradesh">Himachal Pradesh</option>
                <option value="jharkhand">Jharkhand</option>
                <option value="karnataka">Karnataka</option>
                <option value="kerala">Kerala</option>
                <option value="madhya-pradesh">Madhya Pradesh</option>
                <option value="maharashtra">Maharashtra</option>
                <option value="manipur">Manipur</option>
                <option value="meghalaya">Meghalaya</option>
                <option value="mizoram">Mizoram</option>
                <option value="nagaland">Nagaland</option>
                <option value="odisha">Odisha</option>
                <option value="punjab">Punjab</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="sikkim">Sikkim</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="telangana">Telangana</option>
                <option value="tripura">Tripura</option>
                <option value="uttar-pradesh">Uttar Pradesh</option>
                <option value="uttarakhand">Uttarakhand</option>
                <option value="west-bengal">West Bengal</option>
                <option value="andaman-and-nicobar-islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="chandigarh">Chandigarh</option>
                <option value="dadra-and-nagar-haveli-and-daman-and-diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </option>
                <option value="delhi">Delhi</option>
                <option value="lakshadweep">Lakshadweep</option>
                <option value="puducherry">Puducherry</option>
              </select>
            </div>
            <div className="stt-buy">
              <label htmlFor="city-buy">Enter your district</label>
              <input type="text" id="city-buy" />
            </div>
          </div>
          <label htmlFor="town-buy">Enter your Hometown</label>
          {res.length === 0 ? (
            <input type="text" id="town-buy" required={true} />
          ) : res.length === 1 ? (
            <input type="text" id="town-buy" required={true} />
          ) : (
            <select value={town} onChange={townChange} id="town-buy">
              {res.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          )}
          <label htmlFor="adrs-buy">Enter your address</label>
          <input type="text" id="adrs-buy" required={true} />
          <div className="next-to-info-buy">
            <MdOutlineNavigateNext className="next-page-buy"/>
            <button className="btn-nxt-ad-by" type="submit">
            Next
          </button>
          </div>
        </form>
        <div className="pr-info-buy">
          <img src={product.info.img} alt="reinfo" />
          <div className="s-i-buy-pr">
            <h4>{product.info.title}</h4>
            <p>{product.info.desc}</p>
            <hr />
            <div className="color-s-buy">
              <h4>color selection</h4>
              {product.info.colorSelections.length ? (
                product.info.colorSelections.map((a, i) => (
                  <div
                    key={i}
                    style={{
                      border: `1px solid ${a}`,
                      color: a,
                    }}
                  >
                    {a}
                    <input
                      className="clr-s-buy"
                      type="radio"
                      name="colorz-buy"
                      value={a}
                      id={`s-color-buy${i}`}
                    />
                  </div>
                ))
              ) : (
                <p>color selections not available</p>
              )}
            </div>
            <div className="size-s-buy">
              <h4>sizs selection</h4>
              {product.info.sizeCategory === false ? (
                <p>size of this product not available</p>
              ) : (
                product.info.size.map((a, i) => (
                  <div key={i}>
                    {a}
                    <input
                      className="size-i-buy"
                      type="radio"
                      name="sizes-buy"
                      value={a}
                      id={`s-size-buy${i}`}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="ofr-buy">
              {product.offers.map((a, i) => (
                <div key={i} className="offers-list-buy">
                  <h4>{a.title}</h4>
                  <p>₹{a.price}</p>
                  <input type="checkbox" id={a} />
                </div>
              ))}
            </div>
            <form className="code-aply-buy" onSubmit={code}>
              <h4>enter code if you have</h4>
          <div className="code-apllay-buy">
            <div className="input-c-buy">
                <input type="text" />               
              </div>
              <div className="btn-u-cd-buy">
                <LuSend className="send-code-buy" onClick={code}/>
              </div>
          </div>
            </form>
            <hr />
            <div className="quantity-selector">
              <h4>select quantity:</h4>
              <div className="toupord-b">
                <button type="button" onClick={decrease}>
                  -
                </button>
                <input type="number" id="quantity-buy" defaultValue={1} />
                <button type="button" onClick={increase}>
                  +
                </button>
              </div>
            </div>
            <div className="pay-mant-buy">
              total amount: <span>₹{price}</span>
            </div>
            <div className="next-to-info-buy">
                <MdOutlineNavigateNext className="next-page-buy"/>
                <button className="btn-nxt-ad-by" onClick={compleate}>Next</button>
            </div>
          </div>
        </div>
        <div className="payment-f-buy">
          <button className="sent-updt-buy" onClick={toWa}>done</button></div>
        <div className="bottom-buy">
          <button className="line-bt-by" onClick={toUp}></button>
          <span onClick={closePopup}>&times;</span>
          <div className="list-l-buy">
            {up.list.map((a, i) => (
              <div className="l-i-d-buy" key={i}>
                <h4>{a.number}</h4>
                <p>{a.address}</p>
                <input
                  type="radio"
                  className="radio-button-b-buy"
                  id={`radioButtonBuyBottom${i}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

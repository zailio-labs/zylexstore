import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./chat.css";
import { socket } from "../../socket";
import { CiImageOn } from "react-icons/ci";
import { LuSendHorizonal } from "react-icons/lu";
import { FaListUl, FaCheck } from "react-icons/fa6";
import { RiCheckDoubleFill } from "react-icons/ri";
import axios from 'axios';

const UserToAdmin = () => {
  const location = useLocation();
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const hiddenFileInput = useRef(null);
  const User = localStorage.getItem("AUTH-T");
  const [isImg, setIsImg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if(!getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', undefined);
    } else if(location.pathname !== getCurrPath) {
      sessionStorage.setItem("currentUrl", location.pathname);
      sessionStorage.setItem('perviousUrl', getCurrPath);
    }
    const main = document.querySelector(".main-contact");
    const textArea = document.getElementById('textInput');
    textArea.addEventListener('input', function () {
      textArea.style.height = textArea.scrollHeight + 'px';
    });
    if (!User || !User.reg_pkocd) {
      document.querySelector(".chatToAdminInfo").style.display = "none";
      main.innerHTML = `<h1>Unable to chat admin befor a successfull login</h1><a href='/login'>Login</a>`;
      main.style = "text-align:center;color:red;align:center;";
    } else {
      socket.emit("load-u-to-a-chats", {
        id: User.reg_pkocd
      });
      socket.on('admin-events', (a)=>{
        if(a === true) {
          socket.emit("load-u-to-a-chats", {
            id: User.reg_pkocd
          });
        }
      });
    	socket.on("user-admin-chats", (a) => {
           if(!a.user) {
             localStorage.removeItem('AUTH-T')
             document.querySelector(".chatToAdminInfo").style.display = "none";
             main.innerHTML = `<h1>Internal Server Error!</h1><a href='/login'>Login</a>`;
             main.style = "text-align:center;color:red;align:center;";
           } else {
             setChat(a);
             const scroll = document.querySelector(".msgBox");
             scroll.scrollTop = scroll.scrollHeight;
           }
      });
       window.addEventListener('online', (e)=>{
            socket.emit('message-seen', {
                seen: 'true',
                id: User.reg_pkocd,
                path: 'contact'
           })
       });
    }
  }, []);
  const sendMsg = async(e) => {
    e.preventDefault();
    const date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const msg = document.getElementById("textInput");
    if (isImg) {
    	const data = new FormData();
     data.append('file', isImg);
     data.append('token', User.reg_pkocd);
     const img_url = await axios('/api/get_url', {
          method: 'POST',
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data; '
          },
     }).catch(e=>e.response)
     if(img_url.data.url) {
      socket.emit("user-to-admin", {
        id: User.reg_pkocd,
        typo: 'user',
        chat: {
          i: img_url.data.url,
          time: new Date(date).toLocaleTimeString("en-US", timeOptions),
        },
      });
      setIsImg(false);
      }
    } else if (msg.value) {
      document.getElementById('textInput').style.height = '35px';
      socket.emit("user-to-admin", {
        id: User.reg_pkocd,
        typo: 'user',
        chat: {
          t: msg.value,
          time: new Date(date).toLocaleTimeString("en-US", timeOptions),
        },
      });
      msg.value = "";
    }
  };
  const sendImgRequst = (e) => {
    const file = e.target.files;
    if (file && file[0]) setIsImg(file[0]);
  };

  const hideImgB = (e) => {
    e.preventDefault();
    hiddenFileInput.current.click();
  };

  return (
    <div className="main-contact">
      <div className="chatToAdminInfo">
        <img src={chat.admin.img+`?timestamp=${new Date().getTime()}`} alt="Logo" />
        <div className="admin-info-contact">
          <p className="username-contact">{chat.user.username + " to admin"}</p>
          <p className="last-seen-contact">{chat.admin.status_web}</p>
        </div>
        <FaListUl className="dot-contact" />
      </div>
      <div className="contact-msg">
        <div className="msgBox">
          {chat.msgs.map((a) =>
            a.user && a.user.t ? (
              <div className="user-chats">
                {a.user.t}
                <div className="contact-time">
                  {a.user.time}{" "}
                  {chat.admin.see === "true" ? (
                    <RiCheckDoubleFill className="contact-see" />
                  ) : chat.admin.see === "got" ? (
                    <RiCheckDoubleFill className="contact-got" />
                  ) : (
                    <FaCheck className="contact-tick" />
                  )}
                </div>
              </div>
            ) : a.user && a.user.i ? (
              <div className="user-img">
                <img alt="img" className="user-images" src={a.user.i} />
                <div className="contact-time">
                  {a.user.time}{" "}
                  {chat.admin.see === "true" ? (
                    <RiCheckDoubleFill />
                  ) : chat.admin.see === "got" ? (
                    <RiCheckDoubleFill />
                  ) : (
                    <FaCheck />
                  )}
                </div>
              </div>
            ) : a.admin && a.admin.t ? (
              <div className="admin-chats">
                {a.admin.t}
                <div className="a-contact-time">{a.admin.time}</div>
              </div>
            ) : a.admin && a.admin.i ? (
              <div className="admin-img">
                <img alt="img" className="admin-images" src={a.admin.i} />
                <div>{a.admin.time}</div>
              </div>
            ) : null,
          )}
        </div>
        <form className="send-contact">
          <CiImageOn onClick={hideImgB} className="img-upload-contact" />
              <textarea 
                rows="1"
                id="textInput" 
                placeholder="Type here..."
                className="send-message-contact"
              />
          <LuSendHorizonal onClick={sendMsg} className="send-upload" />

          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            accept="image/*"
            ref={hiddenFileInput}
            onChange={sendImgRequst}
          />
        </form>
      </div>
    </div>
  );
};

export default UserToAdmin;

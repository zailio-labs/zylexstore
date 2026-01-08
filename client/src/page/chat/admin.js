import React, { useEffect, useState, useRef } from "react";
import {useNavigate,useLocation} from "react-router-dom";
import "./admin.css";
import { socket } from "../../socket";
import { CiImageOn } from "react-icons/ci";
import { LuSendHorizonal } from "react-icons/lu";
import { FaListUl, FaCheck } from "react-icons/fa6";
import { RiCheckDoubleFill } from "react-icons/ri";

const UserToAdmin = () => {
  const location = useLocation();
  const getCurrPath = sessionStorage.getItem("currentUrl");
  const [admin, setAdmin] = useState("");
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);
  const auth = localStorage.getItem("AUTH-T");
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
    socket.on("user-admin-chats", (a) => {
      setChat(a);
    });
  }, []);
  const listMsgs = () => {
    
  }
  
  const checkout = (e) => {
    e.preventDefault();
    const admin_id = document.getElementById('admin_id');
    const button = document.querySelector('.check-admin button');
    button.innerHTML = 'updating...';
    socket.emit('admin-updates', {
      id: admin_id.value,
      type: 'check'
    });
    setAdmin(admin_id.value);
    admin_id.value = "";
  }
  socket.on('admin-info',(a)=>{
      if(a.status !== true) {
        navigate('/contact', {
        replace: true
      })
      } else {
        window.addEventListener('online', (e)=>{
          socket.emit('admin-updates',{
            status_web: 'online',
            id: admin,
            see: 'got',
            type: 'update'
          })
        })
        window.addEventListener('offline', (e)=>{
          const date = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
          });
          const timeOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          };
          socket.emit('admin-updates',{
            status_web:`last seen at ${new Date(date).toLocaleTimeString("en-US", timeOptions)}`,
            id: admin,
            see: 'false',
            type: 'update'
          })
        })
        document.querySelctor('.check-admin').style.display = 'none';
        document.querySelctor('.main-admin').style.display = 'block';
      }
    })
  const sendMsg = (e) => {
    e.preventDefault();
    const date = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const scroll = document.querySelector(".msgBox");
    scroll.scrollTop = scroll.scrollHeight;
    const msg = document.getElementById("textInput");
    if (isImg) {
      socket.emit("user-to-admin", {
        id: auth,
        admin: {
          i: isImg,
          time: new Date(date).toLocaleTimeString("en-US", timeOptions),
          see: "false",
        },
      });
      setIsImg(false);
    } else if (msg.value) {
      socket.emit("user-to-admin", {
        id: auth,
        admin: {
          t: msg.value,
          time: new Date(date).toLocaleTimeString("en-US", timeOptions),
          see: "true",
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
    <div>
    <form className="check-admin" onSubmit={checkout}>
    <input id="admin_id" type="text" placeholder="Enter your admin code..." required={true}/>
    <button type="submit">submit</button>
    </form>
    <div className="main-admin">
      <div className="chatToAdminInfo">
        <img src={chat.user.img+`?timestamp=${new Date().getTime()}`} alt="Logo" />
        <div className="admin-info-contact">
          <p className="username-contact">{chat.user.username}</p>
          <p className="last-seen-contact">{chat.user.status}</p>
        </div>
        <FaListUl className="dot-contact" onClick={listMsgs}/>
        <div className="list-chat-admin">
          
        </div>
      </div>
      <div className="contact-msg">
        <div className="msgBox">
          {chat.msgs.map((a) =>
            a.user && a.user.t ? (
              <div className="user-chats">
                {a.user.t}
                <div className="contact-time">
                  {a.user.time}{" "}
                  {a.user.see === "true" ? (
                    <RiCheckDoubleFill className="contact-see" />
                  ) : a.user.see === "got" ? (
                    <RiCheckDoubleFill className="contact-got" />
                  ) : (
                    <FaCheck className="contact-tick" />
                  )}
                </div>
              </div>
            ) : a.user && a.user.i ? (
              <div className="user-img">
                <img alt="img" className="user-images" src={a.user.i} />
                <div>
                  {a.user.time}{" "}
                  {a.user.see === "true" ? (
                    <RiCheckDoubleFill />
                  ) : a.user.see === "got" ? (
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
          <input
            type="text"
            className="send-message-contact"
            id="textInput"
            placeholder="send a message..."
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
  </div>
  );
};

export default UserToAdmin;

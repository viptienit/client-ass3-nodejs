import React, { useEffect, useState } from "react";
import "./Chat.css";
import io from "socket.io-client";
const socket = io(process.env.REACT_APP_MY_SECRET_KEY, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

function Chat(props) {
  const [activeChat, setActiveChat] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [message, setMessage] = useState([]);
  const [roomId, setRoomId] = useState(localStorage.getItem("room") || "");
  // taoj phongf ban ddaauf
  // nếu có phòng đang chát trong localStoreage thì sẽ tự vào phòng đó
  useEffect(() => {
    if (localStorage.getItem("room")) {
      socket.emit("vao-phong", localStorage.getItem("room"));
    }
  }, []);
  // tìm hết lại những message đã chat
  socket.on("vao-phong", (data) => {
    if (data.filter((mov) => mov.roomId === roomId)[0]) {
      setMessage(data.filter((mov) => mov.roomId === roomId)[0].messages);
    }
  });

  const handlerSend = () => {
    if (textMessage) {
      if (!roomId) {
        // cliend reowif phòng khi chưa vào phòng nào
        if (textMessage === "/end") {
          alert("bạn chưa có phòng nào để kết thúc");
        } else {
          // tạo phòng
          let room = (Math.random() * 1000000).toFixed(0).toString();
          //clien gửi yêu cầu tạo phòng lên server
          socket.emit("tao-phong", {
            room: room,
            message: { is_admin: false, message: textMessage },
          });
          // set phòng
          setRoomId(room);
          localStorage.setItem("room", room);
          setTextMessage("");
        }
      } else {
        // client rời phòng khi đã có phòng
        if (textMessage === "/end") {
          socket.emit("end-room", {
            room: roomId,
          });
          setTextMessage("");
          localStorage.setItem("room", "");
          setRoomId("");
          setMessage([]);
          alert("đã kết thúc cuộc trò chuyện");
          setActiveChat(false);
          return;
        } else {
          // gửi tin nhắn lên server để gửi cho client
          socket.emit("send-admin", {
            room: roomId,
            messages: [...message, { is_admin: false, message: textMessage }],
          });
          setTextMessage("");
        }
      }
    }
  };
  // nhận dữ liệu khi clien tạo phòng và lưu tin nhắn đã gửi
  socket.on("c-tao-phong", (data) => {
    if (data.filter((mov) => mov.roomId === roomId)[0]) {
      setMessage(data.filter((mov) => mov.roomId === roomId)[0].messages);
    }
  });
  // nhận dữ lieeuh khi clien rời phòng
  socket.on("c-end-phong", (data) => {
    setTextMessage("");
    localStorage.setItem("room", "");
    setRoomId("");
    setMessage([]);
    setActiveChat(false);
  });
  socket.on(roomId, (data) => setMessage(data));

  return (
    <div className="wrapper_chat">
      <div
        className="chat_messenger"
        onClick={() => setActiveChat(!activeChat)}
      >
        <svg x="0" y="0" width="60px" height="60px">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
              <circle fill="#383838" cx="30" cy="30" r="30"></circle>
              <svg x="10" y="10">
                <g transform="translate(0.000000, -10.000000)" fill="#FFFFFF">
                  <g id="logo" transform="translate(0.000000, 10.000000)">
                    <path
                      d="M20,0 C31.2666,0 40,8.2528 40,19.4 C40,30.5472 31.2666,38.8 
								20,38.8 C17.9763,38.8 16.0348,38.5327 14.2106,38.0311 C13.856,37.9335 13.4789,37.9612 
								13.1424,38.1098 L9.1727,39.8621 C8.1343,40.3205 6.9621,39.5819 6.9273,38.4474 L6.8184,34.8894 
								C6.805,34.4513 6.6078,34.0414 6.2811,33.7492 C2.3896,30.2691 0,25.2307 0,19.4 C0,8.2528 8.7334,0 
								20,0 Z M7.99009,25.07344 C7.42629,25.96794 8.52579,26.97594 9.36809,26.33674 L15.67879,21.54734 
								C16.10569,21.22334 16.69559,21.22164 17.12429,21.54314 L21.79709,25.04774 C23.19919,26.09944 
								25.20039,25.73014 26.13499,24.24744 L32.00999,14.92654 C32.57369,14.03204 31.47419,13.02404 
								30.63189,13.66324 L24.32119,18.45264 C23.89429,18.77664 23.30439,18.77834 22.87569,18.45674 
								L18.20299,14.95224 C16.80079,13.90064 14.79959,14.26984 13.86509,15.75264 L7.99009,25.07344 Z"
                    ></path>
                  </g>
                </g>
              </svg>
            </g>
          </g>
        </svg>
      </div>

      {activeChat && (
        <div className="active_chat animate__animated animate__jackInTheBox">
          <div style={{ width: "100%" }}>
            <div
              className="card card-bordered fix_boderChat"
              style={{ width: "fit-content" }}
            >
              <div className="card-header">
                <h4 className="card-title">
                  <strong>Customer Support</strong>
                </h4>{" "}
                <p className="btn btn-xs btn-secondary">Let's Chat App</p>
              </div>
              <div className="ps-container ps-theme-default ps-active-y fix_scoll">
                {message &&
                  message.map((value, stt) =>
                    !value.is_admin ? (
                      <div
                        className="media media-chat media-chat-reverse"
                        key={stt}
                      >
                        <div className="media-body">
                          <p>You: {value.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="media media-chat" key={stt}>
                        <img
                          className="avatar"
                          src="https://img.icons8.com/color/36/000000/administrator-male.png"
                          alt="..."
                        />
                        <div className="media-body">
                          <p>admin: {value.message}</p>
                        </div>
                      </div>
                    )
                  )}
              </div>
              <div className="publisher bt-1 border-light">
                <img
                  className="avatar avatar-xs"
                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                  alt="..."
                />
                <input
                  type="text"
                  placeholder="Enter Message!"
                  onChange={(e) => setTextMessage(e.target.value)}
                  value={textMessage}
                  style={{ width: "80%" }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handlerSend();
                    }
                  }}
                />
                <p onClick={handlerSend} className="publisher-btn text-info">
                  <i className="fa fa-paper-plane"></i>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;

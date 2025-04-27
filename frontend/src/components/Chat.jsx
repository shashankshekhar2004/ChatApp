import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Baseurl } from "../../servicesUrl/baseUrl";
import { MdKeyboardVoice } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";

export const Chat = ({ socket }) => {
  const { selectedUser } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [messagesend, setMessagesend] = useState(false);

  const ScrollRef = useRef();
  const inputvalue = useRef();

  const getMessages = async () => {
    if (!user || !selectedUser) return;
    try {
      const senderdata = {
        senderId: user._id,
        receiverId: selectedUser._id,
      };
      const res = await axios.post(
        `${Baseurl}/api/messages/get_messages`,
        senderdata
      );
      const data = res.data;
      setMessages(data.data);
      console.log("Get message", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && selectedUser) {
      getMessages();
    }
  }, [selectedUser, user, messagesend]);

  useEffect(() => {
    if (socket) {
      socket.off("receiveMessage");
      socket.on("receiveMessage", (newMessage) => {
        // console.log("Message from socket.io", newMessage);
        // console.log("SelectedUser from socket", selectedUser._id);
        // console.log("SelectedUser message id", newMessage.userId);

        if (newMessage.userId === selectedUser?._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          console.log("Message not for the selected user, ignoring...");
        }
      });
    }
  }, [socket, selectedUser]);

  const handleMessage = async () => {
    if (!selectedUser || !selectedUser._id) {
      console.log("No user selected");
      return;
    }

    try {
      const messagedata = {
        senderId: user._id,
        receiverId: selectedUser._id,
        message: inputvalue.current.value,
      };

      // Emit message via Socket.IO
      socket.emit("sendMessage", { messagedata });

      const UpdateMessage = {
        userId: user._id,
        message: inputvalue.current.value,
        time: Date.now(),
      };
      setMessages((prevMessages) =>
        Array.isArray(prevMessages)
          ? [...prevMessages, UpdateMessage]
          : [UpdateMessage]
      );

      // Save message to database
      await axios.post(`${Baseurl}/api/messages/send_message`, messagedata);

      inputvalue.current.value = "";
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col">
      {!selectedUser ? (
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold text-gray-700 bg-zinc-400 px-6 py-3 rounded-lg shadow-md">
            Get Started by Selecting a User
          </h1>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="w-full  fixed top-0 z-10 flex justify-between items-center py-2 px-4 bg-amber-200 shadow-md">
            <div className="flex gap-[10px] items-center">
              <img
                src={selectedUser.profile}
                alt="Profile"
                className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
              />
              <div>
                <h3 className="text-[20px] text-black">{selectedUser.name}</h3>
              </div>
            </div>
            <div className="flex gap-[15px] flex-shrink-0 ">
              <button className="text-[20px]">
                <MdVideoCall />
              </button>
              <button className="text-[20px]">
                <CiSearch />
              </button>
              <button className="text-[20px]">
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 relative mt-[65px]">
            {messages &&
              Array.isArray(messages) &&
              messages.map((message, index) => (
                <div key={index} ref={ScrollRef}>
                  <div
                    className={`${
                      message.userId === user._id
                        ? "chat chat-end ml-3"
                        : "chat chat-start"
                    }`}
                  >
                    <div
                      className={`${
                        message.userId === user._id
                          ? "chat-bubble bg-green-200 text-black"
                          : "chat-bubble bg-white text-black"
                      }`}
                    >
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center px-4 py-2 sticky bottom-0 bg-gray-100 rounded-[10px]">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-3 py-2 bg-[#EEEEF8] text-gray-800 rounded-md pr-[120px]"
                ref={inputvalue}
              />
              <button
                className="absolute right-16 top-1/2 transform -translate-y-1/2 text-[20px] px-3 py-1 text-black rounded-md"
                title="Voice Message"
              >
                <MdKeyboardVoice />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[25px] px-4 py-1 text-black rounded-md"
                title="Send Message"
                onClick={handleMessage}
              >
                <IoIosSend />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

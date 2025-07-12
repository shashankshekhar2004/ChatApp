import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { SideBar } from "../components/SideBar";
import { Chat } from "../components/Chat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import { Baseurl } from "../../servicesUrl/baseUrl";

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const newSocket = io(Baseurl);
    setSocket(newSocket);

    if (user && user._id) {
      newSocket.emit("AddUserSocket", user._id);
    }

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return (
    <section className="section bg-[url('https://w0.peakpx.com/wallpaper/744/548/HD-wallpaper-whatsapp-ma-doodle-pattern-thumbnail.jpg')] bg-gray-200 bg-center opacity-100">
      <div className="flex md:flex-row flex-col">
        <div className="basis-[19%] h-[100vh]    bg-zinc-800 overflow-y-auto ">
          <SideBar socket={socket} />
        </div>

        <div className="basis-[80%] h-[100vh] overflow-y-auto">
          <Chat socket={socket} />
        </div>
      </div>
    </section>
  );
}

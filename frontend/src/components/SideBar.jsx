import React, { useEffect, useState, useRef } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { CiLogout, CiHome } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Baseurl } from "../../servicesUrl/baseUrl";
import { logout } from "../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSelectedUser,
  setSelectedUser,
} from "../redux/features/userSlice";

export const SideBar = ({ socket }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [userdata, setUserdata] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const resp = await axios.get(`${Baseurl}/api/Auth/get_user`);
      setUserdata(resp.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const filteredUsers = userdata
    .filter((curUser) => curUser._id !== user._id)
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    if (socket) {
      socket.disconnect();
    }
    dispatch(removeSelectedUser());
    navigate("/login");
  };

  const handleUserSelect = (selectedUser) => {
    dispatch(setSelectedUser(selectedUser));
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
    return () => {
      if (socket) {
        socket.off("getUsers");
      }
    };
  }, [socket]);

  const isUserOnline = (userId) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === userId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 text-xl z-[9999] p-2 bg-white text-black rounded-lg shadow-md"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar w-full fixed top-0 left-0 z-50 h-screen bg-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col py-6 px-4 
        md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between gap-3 mt-11 md:mt-0">
          {/* Search Bar */}
          <div className="flex items-center bg-zinc-500 rounded-lg overflow-hidden w-full">
            <input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 text-sm focus:outline-none"
            />
            <button className="p-2 text-gray-500">
              <FaSearch />
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative font-[sans-serif]" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center rounded-full outline-none"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user?.profile}
                className="w-9 h-9 rounded-full object-cover"
                alt="Profile"
              />
            </button>

            <ul
              className={`absolute right-0 mt-2 shadow-lg bg-white py-2 z-[1000] min-w-24 rounded-lg max-h-60 overflow-x-hidden ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <li
                onClick={() => {
                  navigate("/");
                  setDropdownOpen(false);
                }}
                className="py-2.5 px-5 gap-2 flex items-center hover:bg-gray-100 text-gray-800 text-sm cursor-pointer"
              >
                <CiHome />
                Home
              </li>
            </ul>
          </div>
        </div>

        {/* User List */}
        <div className="my-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300">
          <h6 className="text-sm text-blue-600 font-semibold mb-6">Teams</h6>
          <ul className="space-y-6">
            {filteredUsers.map((curUser) => (
              <li
                key={curUser._id}
                onClick={() => handleUserSelect(curUser)}
                className="flex items-center text-sm text-white hover:text-blue-400 cursor-pointer transition-colors"
              >
                <span className="relative inline-block mr-4">
                  <img
                    src={curUser.profile}
                    className="ml-[5px] rounded-full w-12 h-12 object-cover"
                    alt="Profile"
                  />
                  {isUserOnline(curUser._id) && (
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 absolute bottom-1 right-1 animate-ping"></span>
                  )}
                </span>
                <span className="font-medium">{curUser.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="py-4 border-t border-gray-600 mt-4">
          <button
            onClick={handleLogout}
            className="flex gap-2 items-center w-full text-red-400 text-sm hover:bg-gray-700 p-2 rounded-lg transition-all duration-300"
          >
            <CiLogout size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

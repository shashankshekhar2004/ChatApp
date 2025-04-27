import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { Baseurl } from "../../servicesUrl/baseUrl";
import { setCredentials } from "../redux/features/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  const handleUserLogin = (e) => {
    const { name, value } = e.target;
    setUserLogin({ ...userLogin, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: userLogin.email,
      password: userLogin.password,
    };

    try {
      const resp = await axios.post(`${Baseurl}/api/auth/login`, userData);
      const data = resp.data;

      if (resp.status === 200) {
        toast.success(data.message);
        setUserLogin({
          email: "",
          password: "",
        });
        dispatch(setCredentials({ user: data.user, token: data.token }));
        navigate("/");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-zinc-700 font-[sans-serif] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Login 👋
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-semibold">
              Email Address
            </label>
            <input
              name="email"
              value={userLogin.email}
              onChange={handleUserLogin}
              type="email"
              required
              placeholder="Enter your email"
              className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-semibold">
              Password
            </label>
            <input
              name="password"
              value={userLogin.password}
              onChange={handleUserLogin}
              type="password"
              required
              placeholder="Enter your password"
              className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold text-lg tracking-wide shadow-md"
            >
              Login
            </button>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleRegister}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

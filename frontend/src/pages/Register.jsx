import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { Baseurl } from "../../servicesUrl/baseUrl";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    profile: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("profile", user.profile);

      const res = await axios.post(`${Baseurl}/api/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("here//");
      const data = await res.data;

      if (res.status === 200) {
        toast.success(data.message);
        setUser({
          name: "",
          email: "",
          password: "",
          profile: null,
        });
        navigate("/login");
      }
    } catch (error) {
      if (error?.response?.data) {
        toast.error(error.response.data.message);
      }
      console.error(error);
    }
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setUser({ ...user, [name]: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <section className="bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Upload */}
          <div className="flex flex-col items-center">
            <label htmlFor="profile" className="relative cursor-pointer group">
              <img
                src={
                  user.profile
                    ? URL.createObjectURL(user.profile)
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aZ5dsa-PRx_4ozdsfmRi6kNoZdG18gCv8Em9EtWrHCYJD3OT5sKer3_UfZ4c2uc8lrg&usqp=CAU"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-80 transition-all duration-300"
              />
              <input
                type="file"
                id="profile"
                name="profile"
                onChange={handleInput}
                className="hidden"
              />
              <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
            </label>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Upload your profile photo
            </p>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleInput}
              placeholder="Enter your name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleInput}
              placeholder="••••••••"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Register
          </button>

          {/* Login redirect */}
          <p className="text-sm text-center text-gray-700 dark:text-gray-300 mt-4">
            Already have an account?
            <button
              type="button"
              onClick={handleLogin}
              className="text-blue-600 hover:underline ml-1 font-semibold"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}

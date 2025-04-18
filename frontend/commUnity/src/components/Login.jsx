import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BiHide, BiShow } from "react-icons/bi"; 

function Login() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 For toggle
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userName", response.data.user.username);
        localStorage.setItem("profile", response.data.user.profile);
        Navigate("/");
      }
    } catch (error) {
      toast.error("Login failed, please try again");
      console.log("error: " + error);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-primary">
      <Toaster />
      <div className="w-1/2 h-full bg-sky-200 hidden md:block">
        <img
          src="/images/login_side.png"
          alt="login_side"
          className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="relative w-full md:w-1/2 h-full bg-primaryRed overflow-hidden">
        <h1 className="w-full text-center mt-10 text-2xl sm:text-4xl md:text-3xl lg:text-4xl text-primaryBlue font-bold leading-none">
          commUNITY
          <br />
          <span className="text-white text-sm sm:text-lg font-normal leading-tight">
            plan together, execute together
          </span>
        </h1>

        <div className="h-full flex flex-col justify-center items-center font-bold">
          <img
            src="/images/logo3.png"
            alt="community_logo"
            className="mx-auto w-2/8"
          />
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 w-full p-4 sm:p-0 mx-auto text-white text-base sm:text-xl sm:w-3/4"
          >
            <label className="text-sky-400">Email</label>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-sky-400 rounded-md p-1 w-full sm:p-2"
            />

            <label className="text-sky-400">Password</label>
            <div className="border border-sky-400 rounded-md p-1 sm:p-2 flex items-center">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none flex-1 bg-transparent"
                required
              />
              {/* 👇 Icon toggles password visibility */}
              {showPassword ? (
                <BiHide
                  onClick={() => setShowPassword(false)}
                  className="size-6 hover:cursor-pointer text-white"
                />
              ) : (
                <BiShow
                  onClick={() => setShowPassword(true)}
                  className="size-6 hover:cursor-pointer text-white"
                />
              )}
            </div>

            <input
              type="submit"
              className="text-white bg-sky-400 rounded-md w-fit m-auto p-1 sm:py-2 sm:px-4 cursor-pointer"
            />

            <div className="flex flex-col md:flex-row justify-between text-sm text-center sm:text-xl mt-4">
              <p className="cursor-pointer">Forgot Password?</p>
              <NavLink to="/signup">
                <p className="cursor-pointer">Sign Up</p>
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

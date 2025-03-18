import React from "react";

function Login() {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="w-1/2 h-full bg-sky-200 hidden md:block">
        <img
          src="/images/login_side.png"
          alt="login_side"
          className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
        />
      </div>

      <div className="relative w-full md:w-1/2 h-full bg-primaryRed overflow-hidden">
        <h1 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl sm:text-4xl md:text-3xl lg:text-4xl text-primaryBlue font-bold leading-none">
          commUNITY
          <br />
          <span className="text-white text-sm sm:text-lg font-normal leading-tight">
            plan together, execute together
          </span>
        </h1>
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src="/images/logo3.png"
            alt="community_logo"
            className="mx-auto w-2/8"
          />
          <form className="grid gap-4 w-full  mx-auto text-white text-base sm:text-xl sm:w-3/4">
            <label className="text-sky-400">Username</label>
            <input
              placeholder="username"
              className="border border-sky-400 rounded-md p-1 w-full sm:p-2"
            />

            <label className="text-sky-400">Password</label>
            <input
              placeholder="password"
              type="password"
              className="border border-sky-400 rounded-md p-1 sm:p-2"
            />

            <input
              type="submit"
              className="text-white bg-sky-400 rounded-md w-fit m-auto p-1 sm:py-2 sm:px-4 cursor-pointer"
            />

            <div className="flex flex-col md:flex-row justify-between text-sm text-center sm:text-xl mt-4">
              <p className="cursor-pointer">Forgot Password?</p>
              <p className="cursor-pointer">Sign Up</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

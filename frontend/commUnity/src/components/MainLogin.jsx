import React, { useState } from "react";
import Login from './Login'
import Signup from './Signup'

function App() {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-6">
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${tab === "login" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${tab === "signup" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Render LoginForm or SignupForm based on tab state */}
        {tab === "login" ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default App;

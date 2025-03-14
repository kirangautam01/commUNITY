import React, { useState } from "react";
import axios from "axios";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailError, setEmailError] = useState("");

  //****************************************************************************  //check email exists
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    // Get the selected file
    const fileInput = document.querySelector("input[name='profilePic']");
    if (fileInput.files.length > 0) {
      formData.append("profilePic", fileInput.files[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      setSuccess("Account created successfully! Please log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      fileInput.value = ""; // Clear file input
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to connect to the server."
      );
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength("Weak");
    } else if (value.length < 10) {
      setPasswordStrength("Good");
    } else {
      setPasswordStrength("Strong");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "text-red-500";
      case "Good":
        return "text-yellow-500";
      case "Strong":
        return "text-green-500";
      default:
        return "";
    }
  };

  //****************************************************************************  //check email exists
  const checkEmailExists = async (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setEmailError(""); // Clear previous errors

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      setEmailError("Invalid email format.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/users/email_exist",
        { email: emailValue }
      );

      if (response.data.exists) {
        setEmailError("Email already exists. Please use a different email.");
      }
    } catch (error) {
      setEmailError(
        error.response?.data?.message || "Failed to check email existence."
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {emailError && (
        <p className="text-red-500 text-center mb-4">{emailError}</p>
      )}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={checkEmailExists}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        {password && (
          <p className={`text-sm ${getPasswordStrengthColor()}`}>
            Password strength: {passwordStrength}
          </p>
        )}

        <input
          type="file"
          name="profilePic"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0 file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          type="submit"
          disabled={emailError}
          className={`w-full py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 
            ${
              emailError
                ? "bg-blue-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <span className="text-blue-500 hover:underline cursor-pointer">
          Log in
        </span>
      </p>
    </div>
  );
}

export default SignupForm;

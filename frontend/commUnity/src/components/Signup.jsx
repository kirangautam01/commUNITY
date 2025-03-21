import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [otpFormVisible, setOtpFormVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [mainFormVisible, setMainFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profilePic: null,
  });

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/users/otp_sent",
        { email }
      );

      if (response.data.exists) {
        // Show error if the email already exists
        toast.error(response.data.message);
        return;
      }

      // Show success if OTP was sent successfully
      toast.success(response.data.message);
      setOtpFormVisible(true); // Show OTP form after success
    } catch (error) {
      // In case of any other error
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/users/otp_verify",
        { otp, email }
      );

      toast.success(response.data.message);
      setMainFormVisible(true);
    } catch (error) {
      if (error.response && error.response.status == 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong. please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0],
    }));
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();

    //create a formData object to send file & text data
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", email); //email is already in the state
    formDataToSend.append("password", formData.password);
    formDataToSend.append("profilePic", formData.profilePic);

    try {
      const response = await axios.post(
        "http://localhost:4000/users/register",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error("something went wrong. please try again.");
    }
  };

  return (
    <div className=" flex justify-center items-center flex-col h-screen w-full bg-primaryBlue space-y-4">
      <Toaster /> {/* Toast Notification Container */}
      <h1 className="text-6xl font-bold text-primaryRed">SignUp</h1>
      <div className="relative flex flex-col w-3/4 min-h-1/2 md:w-1/2 gap-2 bg-white rounded-2xl p-6">
        {/* _______________ Send OTP Form _______________ */}
        <form
          className={`absolute inset-0 flex flex-col items-center justify-center space-y-5 transition-all duration-700 ease-in-out ${
            otpFormVisible ? "opacity-0 scale-1/2 -translate-y-40" : ""
          }`}
          onSubmit={handleSubmit1}
        >
          <label className="text-3xl">Enter Email: </label>
          <input
            value={email}
            type="email"
            placeholder="abcd@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            className="border-2 rounded-2xl p-2 border-blue-500 w-3/4 md:w-2/3 md:text-2xl"
          />
          <input
            type="submit"
            value="Send OTP"
            className="rounded-2xl p-2 w-1/2 md:w-1/4 md:text-2xl bg-blue-700 text-white hover:bg-blue-500 cursor-pointer text-ellipsis"
          />
        </form>

        {/* _______________ OTP Verify Form with Smooth Animation _______________ */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center w-full transition-all duration-700 delay-700 ease-in-out ${
            otpFormVisible && !mainFormVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5 pointer-events-none"
          } `}
        >
          {otpFormVisible && (
            <form
              className=" flex flex-col space-y-5 w-full items-center"
              onSubmit={handleSubmit2}
            >
              <label className="text-3xl">Enter OTP: </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border-2 rounded-2xl p-2 border-blue-500 w-3/4 md:w-2/3 md:text-2xl"
              />
              <input
                type="submit"
                value="Verify OTP"
                className="rounded-2xl p-2 w-1/2 md:w-1/4 md:text-2xl bg-green-700 text-white hover:bg-green-500 cursor-pointer text-ellipsis"
              />
            </form>
          )}
        </div>

        {/* _______________ final user registered form _______________ */}
        <div
          className={` transition-all delay-700 duration-700 ease-in ${
            mainFormVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-20"
          }`}
        >
          {mainFormVisible && (
            <form className="flex flex-col space-y-2" onSubmit={handleSubmit3}>
              <label>Username: </label>
              <input
                placeholder="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border-2 border-blue-500 rounded-2xl p-2"
                required
              />

              <label>Email: </label>
              <input
                type="email"
                value={email}
                readOnly
                className="border-2 border-blue-500 rounded-2xl p-2"
                required
              />

              <label>Password: </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="● ● ● ● ● ● ● ●"
                className="border-2 border-blue-500 rounded-2xl p-2 placeholder:text-sm"
                required
              />

              <label>Profile Pic: </label>
              <input
                type="file"
                name="profilePic"
                onChange={handleFileChange}
                className="border-2 border-blue-500 rounded-2xl p-2"
                required
              />

              <input
                type="submit"
                className=" bg-primaryBlue border-blue-500 w-2/4 rounded-2xl mx-auto p-2"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;

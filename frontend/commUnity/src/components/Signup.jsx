import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [otpFormVisible, setOtpFormVisible] = useState(false);
  const [otp, setOtp] = useState("");

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
    } catch (error) {
      if (error.response && error.response.status == 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong. please try again.");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen w-full bg-primaryBlue space-y-4">
        <Toaster /> {/* Toast Notification Container */}
        <h1 className="text-6xl font-bold text-primaryRed">SignUp</h1>
        <div className="flex flex-col w-3/4 md:w-1/2 gap-2 bg-white rounded-2xl h-1/2 p-6">
          {/* _______________ Send OTP Form _______________ */}
          <form
            className="flex flex-col space-y-5 my-auto items-center"
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
              className="rounded-2xl p-2 w-1/2 md:w-1/4 md:text-2xl bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
            />
          </form>

          {/* _______________ OTP Verify Form with Smooth Animation _______________ */}
          <div
            className={`transition-opacity duration-700 ease-in-out transform ${
              otpFormVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5 pointer-events-none"
            }`}
          >
            {otpFormVisible && (
              <form
                className="flex flex-col space-y-5 my-auto items-center"
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
        </div>
      </div>

      <div>
        <form className="w-40 h-40 bg-green-600 absolute -right-40">
          <h1>register here</h1>
        </form>
      </div>

      <button className="border">swipe</button>
    </>
  );
}

export default Signup;

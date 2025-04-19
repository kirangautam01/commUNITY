import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";

function Home() {
  return (
    <>
      <div className="font-primary bg-gray-50">
        {/* Hero Section - Kept exactly as you liked it */}
        <div className="relative bg-white overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 transform skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left content */}
              <div className="lg:w-1/2 z-10 mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Build Stronger Communities{" "}
                  <span className="text-blue-600">Together</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  commUNITY provides the tools you need to connect, organize,
                  and grow your community. Seamless communication, effortless
                  event management, and powerful member engagement—all in one
                  platform.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="#"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300 text-center"
                  >
                    Get Started
                  </a>
                  <a
                    href="#"
                    className="px-6 py-3 border border-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-300 text-center"
                  >
                    Learn More
                  </a>
                </div>
              </div>

              {/* Right image */}
              <div className="lg:w-1/2 lg:pl-12 z-10">
                <div className="p-2">
                  <img
                    src="/images/logo1.png"
                    alt="Community illustration"
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ************************************************************************************ FEATURES */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Empower Your Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build, manage, and grow your community in
              one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <FaUsers className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Create Communities
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Easily establish spaces for your interests or groups with
                customizable settings and branding options.
              </p>
              <a
                href="/community"
                className="flex items-center text-blue-600 font-medium"
              >
                Learn more <FaArrowRight className="ml-2" />
              </a>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <FaCalendarAlt className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Event Management
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Plan, promote, and track events with built-in RSVP systems,
                calendars, and automated reminders.
              </p>
              <a
                href="/events"
                className="flex items-center text-blue-600 font-medium"
              >
                Learn more <FaArrowRight className="ml-2" />
              </a>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <FaBell className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Notice Management
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Targeted announcements with read receipts and priority tagging
                to ensure important messages are seen.
              </p>
              <a
                href="/notice"
                className="flex items-center text-blue-600 font-medium"
              >
                Learn more <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* ************************************************************************************ CHAT PREVIEW */}

        <div className="bg-white text-gray-800 py-20 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              {/* Left Content */}
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h2 className="text-4xl font-extrabold mb-6 text-primaryBlue transition duration-300">
                  Real-time Communication
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  While messages are not stored and will reset upon refresh,
                  this lightweight system keeps your conversations fast and
                  direct. We’re actively working on adding secure message
                  storage and end-to-end encryption to improve your experience —
                  updates will be rolled out gradually to enhance user
                  efficiency and privacy.
                </p>
              </div>

              <div className="lg:w-1/2 lg:pl-12">
                <img
                  src="/images/chatPreview.png"
                  alt="chat_preview"
                  className="rounded-2xl shadow-xl border border-gray-200 transition-transform duration-300 hover:scale-105 object-cover max-h-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ************************************************************************************ NOTICE PREVIEW */}
        <div className="py-20 mt-10 w-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800">
            <div className="lg:flex lg:items-center lg:justify-between lg:flex-row-reverse md:gap-10">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <h2 className="text-4xl font-extrabold mb-6 text-primaryBlue transition duration-300">
                  Community Notices & Announcements
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Keep your community informed with timely updates and
                  announcements. Whether it's future plans, important decisions,
                  or reminders, the Notice tab lets you share it all in one
                  place. Clear and centralized notices help every member stay in
                  sync and actively participate in your community’s progress.
                </p>
              </div>

              {/* Image Preview (Left Side) */}
              <div className="lg:w-1/2 lg:pr-12">
                <img
                  src="/images/noticePreview.png"
                  alt="notice_preview"
                  className="rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

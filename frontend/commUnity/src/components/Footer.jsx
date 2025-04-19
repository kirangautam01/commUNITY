import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { GrGithub } from "react-icons/gr";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/images/logo3.png"
                alt="commUNITY Logo"
                className="h-10 w-auto"
              />
              <span className="ml-2 text-xl font-bold">commUNITY</span>
            </div>
            <p className="text-gray-400">
              Bringing people together through powerful community tools and
              seamless communication.
            </p>
            <div className="flex space-x-4">
              <a
                target="_blank"
                href="https://www.facebook.com/keyraw.an"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaFacebook className="size-6" />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/roman-gautam-19aaa8274/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin className="size-6" />
              </a>
              <a
                target="_blank"
                href="https://github.com/evillentenxon"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <GrGithub className="size-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Events
                </a>
              </li>

              <li>
                <a
                  href="/notice"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Notice Board
                </a>
              </li>

              <li>
                <a
                  href="/community"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Communities
                </a>
              </li>

              <li>
                <a
                  href="/account"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/guides"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Community Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Sundarharaicha-03, Morang</p>
              <p>Koshi, Nepal</p>
              <p>
                Email:
                <a
                  href="romangautam71399@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  romangautam71399
                  <br />
                  @gmail.com
                </a>
              </p>
              <p>Phone: (+977) 9817313776</p>
            </address>
          </div>
        </div>

        {/* Copyright and legal */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} commUNITY. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
